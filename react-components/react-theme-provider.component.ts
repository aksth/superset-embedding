import { Component, OnChanges, Input, AfterViewInit } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from '@superset-ui/core';
import { ThemeProviderProps, Theme } from '@emotion/react';

@Component({
  selector: 'app-react-theme-provider',
  template: '<div [id]="rootId"></div>',
})
export class ReactThemeProviderComponent implements OnChanges, AfterViewInit {
  @Input() theme: Partial<Theme> | ((outerTheme: Theme) => Theme);
  @Input() children?: React.ReactNode;

  @Input() chartType?;
  @Input() formData?;
  @Input() queriesData?;

  public rootId = 'theme-provider-root';
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

    const props: ThemeProviderProps = {
      theme: this.theme,
      ...(this.children ? { children: this.children } : {}),
    };

    ReactDOM.render(
      React.createElement(ThemeProvider, props),
      document.getElementById(this.rootId)
    );

  }
}
