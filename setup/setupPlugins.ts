import { getChartControlPanelRegistry } from '@superset-ui/core';

import MainPreset from './MainPreset';
import Separator from './Separator';
import TimeTable from './TimeTable';

export default function setupPlugins() {
  new MainPreset().register();

  // TODO: Remove these shims once the control panel configs are moved into the plugin package.
  getChartControlPanelRegistry()
    .registerValue('separator', Separator)
    .registerValue('time_table', TimeTable);

}
