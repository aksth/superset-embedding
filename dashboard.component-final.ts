import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './api/http.service';
import { theme } from './setup/preamble';
import setupPlugins from './setup/setupPlugins';

@Component({
  selector: 'app-dashboard-final',
  templateUrl: './dashboard.component-final.html',
  styleUrls: [
    './dashboard.component-final.scss', 
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSupersetComponentFinal implements OnInit {

  theme = theme;

  positionJson = {};

  dashboardId = 12;

  dashboardLayout: Element[] = [];
  dashboardLayoutReady: boolean = false;

  dashboardCharts: any[] = [];

  constructor(private httpService: HttpService, private router: Router){}

  ngOnInit() {
    setupPlugins();
    this.httpService.getSession().subscribe(res => {
      this.httpService.fetchDashboardCharts(this.dashboardId).subscribe(res => {
        if(res.result.length>0){
          this.dashboardCharts = res.result;
          this.httpService.fetchDashboardDetail(this.dashboardId).subscribe(res => {
            this.positionJson = JSON.parse(res.result.position_json);
            for (var key in this.positionJson) {
              let component = this.positionJson[key];
              let type = component.type;
              if(type === "ROOT") {
                this.dashboardLayout.push(
                  {
                    id: component.id, 
                    children: this.getChildren(component), 
                    type: type, 
                    ... component.hasOwnProperty("meta") && { meta: component.meta },
                    parent: null,
                    isFirstChild: this.dashboardLayout.length == 0 ? true : false,
                  }
                );
              }
            }
            this.dashboardLayoutReady = true;
            console.log(this.dashboardLayout)
          });
        }
      });
    });
  }

  getFormData(slideId: number) {
    return this.dashboardCharts.find(chart => chart.form_data.slice_id === slideId).form_data;
  }

  getChildren(root): Element[] {
    let rootChildren: Element[] = [];
    root.children.forEach((element, index) => {
      let childElementInJson = this.positionJson[element];
      rootChildren.push(
        {
          id: element, 
          children: this.getChildren(childElementInJson), 
          type: childElementInJson.type,
          ... childElementInJson.hasOwnProperty("meta") && { meta: childElementInJson.meta },
          parent: root.type,
          isFirstChild: rootChildren.length == 0 ? true : false,
        }
      );
    });
    return rootChildren;
  }

  public refresh() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

}

interface Element {
  id: string;
  children: Element[];
  type: string;
  meta? : any;
  color?: string;
  parent: string;
  isFirstChild: boolean;
}