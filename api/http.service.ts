import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { theme } from '../setup/preamble';

@Injectable({ providedIn: 'root' })
export class HttpService {
  theme = theme;
  csrfToken =
    'csrfToken';
  accessToken = 'accessToken';
  
  httpOptionsAuthorizationHeader = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.accessToken,
      'X-CSRFToken': this.csrfToken,
      'Content-Type': 'application/json'
    }),
    withCredentials: true,
  };
  
  httpOptionsLegacy = {
    headers: new HttpHeaders({
      'X-CSRFToken': this.csrfToken,
      'Content-Type': 'multipart/form-data'
    }),
    withCredentials: true,
  };

  constructor(private http: HttpClient) {
  }

  getSession = () => {
    return this.http.get<any>('/dashboard/login');
  }

  fetchDashboardDetail = (dashboardId: number) => {
    return this.http.get<any>(
      '/superset/api/v1/dashboard/' + dashboardId,
      this.httpOptionsAuthorizationHeader
    );
  };
  
  fetchDashboardCharts = (dashboardId: number) => {
    return this.http.get<any>(
      '/superset/api/v1/dashboard/' + dashboardId + '/charts',
      this.httpOptionsAuthorizationHeader
    );
  };

  fetchChartDataLegacy = (dashboardId: number, formdata: any) => {
    let input = new FormData();
    input.append('form_data', JSON.stringify(formdata));
    return this.http.post<any>(
      '/superset/superset/explore_json/?form_data=%7B%22slice_id%22%3A' +
      formdata.slice_id +
      '%7D&dashboard_id=' +
      dashboardId,
      input,  
      this.httpOptionsLegacy
    );
  };

  fetchChartDataNew = (dashboardId: number, formdata: any, slice_id: number) => {
    return this.http.post<any>(
      '/superset/api/v1/chart/data?form_data=%7B%22slice_id%22%3A' + slice_id + '%7D&dashboard_id='+dashboardId,
      formdata,
      this.httpOptionsAuthorizationHeader
    );
  };
}
