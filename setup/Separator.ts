import { t, validateNonEmpty } from '@superset-ui/core';
import { formatSelectOptions } from './utils';

export default {
  controlPanelSections: [
    {
      label: t('Code'),
      controlSetRows: [
        [
          {
            name: 'markup_type',
            config: {
              type: 'SelectControl',
              label: t('Markup type'),
              clearable: false,
              choices: formatSelectOptions(['markdown', 'html']),
              default: 'markdown',
              validators: [validateNonEmpty],
              description: t('Pick your favorite markup language'),
            },
          },
        ],
        [
          {
            name: 'code',
            config: {
              type: 'TextAreaControl',
              label: t('Code'),
              description: t('Put your code here'),
              mapStateToProps: state => ({
                language:
                  state.controls && state.controls.markup_type
                    ? state.controls.markup_type.value
                    : 'markdown',
              }),
              default: '',
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    code: {
      default:
        '####Section Title\n' +
        'A paragraph describing the section ' +
        'of the dashboard, right before the separator line ' +
        '\n\n' +
        '---------------',
    },
  },
  sectionOverrides: {
    druidTimeSeries: {
      controlSetRows: [],
    },
    sqlaTimeSeries: {
      controlSetRows: [],
    },
  },
};
