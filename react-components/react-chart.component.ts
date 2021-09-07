import {
  Component,
  OnChanges,
  Input,
  AfterViewInit,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from '@superset-ui/core';
import { ThemeProviderProps, Theme } from '@emotion/react';
import { SuperChart } from '@superset-ui/core';
import {
  getChartDataRequestPayload,
  shouldUseLegacyApi,
} from '../api/chartAction';
import { HttpService } from '../api/http.service';

@Component({
  selector: 'app-react-chart',
  template: '<div [id]="rootId" #root></div>',
})
export class ReactChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() theme: Partial<Theme> | ((outerTheme: Theme) => Theme);
  @Input() children?: React.ReactNode;

  @Input() formData;
  @Input() dashboardId: number;
  @Input() width?: number;
  @Input() height?: number;

  @ViewChild('root') rootDOMElement;

  public rootId;
  private hasViewLoaded = false;

  public chartResultLoaded: boolean = false;
  private queriesData: any[] = [];
  private verboseMap: any = {};
  private formDataForChart: any;

  constructor(
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.rootId = 'chart_' + this.formData.slice_id;
  }

  public ngOnChanges() {}

  public ngAfterViewInit() {
    this.hasViewLoaded = true;
    getChartDataRequestPayload({
      formData: this.formData,
      setDataMask: () => {},
      resultFormat: 'json',
      resultType: 'full',
      force: false,
      ownState: {},
    }).subscribe((data) => {
      if (this.formData.viz_type === 'pivot_table') {
        data = {
          ...data,
          date_format: 'smart_date',
          number_format: 'SMART_NUMBER',
          order_desc: true,
          pandas_aggfunc: 'sum',
          pivot_margins: true,
          time_grain_sqla: 'P1D',
          extra_filters: [],
          label_colors: {},
          url_params: {},
        };
      }
      if (shouldUseLegacyApi(this.formData)) {
        this.httpService
          .fetchChartDataLegacy(this.dashboardId, data)
          .subscribe((res) => {
            this.formDataForChart = res.form_data;
            this.queriesData.push(res);
            if (this.formData.viz_type === 'pivot_table') {
              let metrics: any[] = res.form_data.metrics;
              for (let i = 0; i < metrics.length; i++) {
                if (typeof metrics[i] === 'string') {
                  this.verboseMap[metrics[i]] = metrics[i];
                } else if (
                  typeof metrics[i] === 'object' &&
                  metrics[i].hasOwnProperty('label')
                ) {
                  this.verboseMap[metrics[i].label] = metrics[i].label;
                }
              }
            }
            this.chartResultLoaded = true;
            this.renderComponent();
          });
      } else {
        this.httpService
          .fetchChartDataNew(this.dashboardId, data, this.formData.slice_id)
          .subscribe((res) => {
            this.formDataForChart = this.formData;
            this.queriesData = res.result;
            this.chartResultLoaded = true;
            this.renderComponent();
          });
      }
    });
  }

  private renderComponent() {
    if (!this.hasViewLoaded || !this.chartResultLoaded) {
      return;
    }

    const themeProps: ThemeProviderProps = {
      theme: this.theme,
      ...(this.children ? { children: this.children } : {}),
    };

    //Inside your function
    const root = this.rootDOMElement.nativeElement;
    const chartProps = {
      chartType: this.formData.viz_type,
      formData: this.formDataForChart,
      queriesData: this.queriesData,
      ...(this.width && { width: this.width }),
      ...(this.height && { height: this.height }),
      ...(this.formData.viz_type === 'pivot_table' && {
        datasource: {
          columnFormats: {},
          verboseMap: this.verboseMap,
        },
      }),
    };
    ReactDOM.render(
      React.createElement(
        ThemeProvider,
        themeProps,
        React.createElement(SuperChart, chartProps)
      ),
      root
    );
  }
}
