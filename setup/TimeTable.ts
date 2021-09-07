import { t, validateNonEmpty } from '@superset-ui/core';
import { sections } from '@superset-ui/chart-controls';

export default {
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['adhoc_filters'],
        ['groupby'],
        ['limit'],
        [
          {
            name: 'column_collection',
            config: {
              type: 'CollectionControl',
              label: t('Time series columns'),
              validators: [validateNonEmpty],
              controlName: 'TimeSeriesColumnControl',
            },
          },
        ],
        ['row_limit'],
        [
          {
            name: 'url',
            config: {
              type: 'TextControl',
              label: t('URL'),
              description: t(
                "Templated link, it's possible to include {{ metric }} " +
                  'or other values coming from the controls.',
              ),
              default: '',
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    groupby: {
      multiple: false,
    },
  },
};
