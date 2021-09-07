import moment from 'moment';
import { configure, supersetTheme } from '@superset-ui/core';
import { merge } from 'lodash';
import setupColors from './setupColors';
import setupClient from './setupClient';
import setupFormatters from './setupFormatters';

let bootstrapData: any;
// Configure translation
if (typeof window !== 'undefined') {
  const root = document.getElementById('app');

  bootstrapData = root
    ? JSON.parse(root.getAttribute('data-bootstrap') || '{}')
    : {};
  if (bootstrapData.common && bootstrapData.common.language_pack) {
    const languagePack = bootstrapData.common.language_pack;
    configure({ languagePack });
    moment.locale(bootstrapData.common.locale);
  } else {
    configure();
  }
} else {
  configure();
}

setupClient();

setupColors(
  bootstrapData?.common?.extra_categorical_color_schemes,
  bootstrapData?.common?.extra_sequential_color_schemes,
);

// Setup number formatters
setupFormatters();

export const theme = merge(
  supersetTheme,
  bootstrapData?.common?.theme_overrides ?? {},
);
