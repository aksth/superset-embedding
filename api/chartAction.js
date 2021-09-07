import {
  getChartMetadataRegistry,
  getChartBuildQueryRegistry,
  buildQueryContext,
} from '@superset-ui/core';
import { from } from 'rxjs';
import { of } from 'rxjs';

export function getChartDataRequestPayload({
  formData,
  setDataMask = () => {},
  resultFormat = 'json',
  resultType = 'full',
  force = false,
  ownState = {},
}) {

  if (shouldUseLegacyApi(formData)) {
    return of(formData);
  }

  return from(v1ChartDataRequestPayload(
    formData,
    resultFormat,
    resultType,
    force,
    setDataMask,
    ownState
  ));

}

export function shouldUseLegacyApi(formData) {
  const vizType = formData.viz_type;
  const vizMetadata = getChartMetadataRegistry().get(vizType);
  return vizMetadata ? vizMetadata.useLegacyApi : false;
}

const v1ChartDataRequestPayload = async (
  formData,
  resultFormat,
  resultType,
  force,
  setDataMask,
  ownState,
) => {
  const payload = buildV1ChartDataPayload({
    formData,
    resultType,
    resultFormat,
    force,
    setDataMask,
    ownState,
  });
  return JSON.stringify(payload);
};

export const buildV1ChartDataPayload = ({
  formData,
  force,
  resultFormat,
  resultType,
  setDataMask,
  ownState,
}) => {
  const buildQuery =
    getChartBuildQueryRegistry().get(formData.viz_type) ??
    (buildQueryformData =>
      buildQueryContext(buildQueryformData, baseQueryObject => [
        {
          ...baseQueryObject,
        },
      ]));
  return buildQuery(
    {
      ...formData,
      force,
      result_format: resultFormat,
      result_type: resultType,
    },
    {
      ownState,
      hooks: {
        setDataMask,
      },
    },
  );
};