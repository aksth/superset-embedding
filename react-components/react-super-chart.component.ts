import { Component, OnChanges, Input, AfterViewInit } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SuperChart } from '@superset-ui/core';
import { Props } from '@superset-ui/core/lib/chart/components/SuperChart';

@Component({
  selector: 'app-react-super-chart',
  template: '<div [id]="rootId"></div>',
})
export class ReactSuperChartComponent implements OnChanges, AfterViewInit {
  @Input() chartType: string;
  @Input() formData?;
  @Input() queriesData?;

  public rootId = 'theme-super-chart';
  private hasViewLoaded = false;

  public ngOnChanges() {
    this.renderComponent();
  }

  public ngAfterViewInit() {
    this.hasViewLoaded = true;
    this.renderComponent();
  }

  private renderComponent() {
    if (!this.hasViewLoaded) {
      return;
    }

    const props: Props = {
      chartType: this.chartType,
      ...(this.formData ? { formData: this.formData } : {}),
      ...(this.queriesData ? { queriesData: this.queriesData } : {}),
    };

    ReactDOM.render(
      React.createElement(SuperChart, props),
      document.getElementById(this.rootId)
    );
  }
}
