(*The code in this project is very minimal. It only includes the main dashboard component. I'll upload a full working angular application implementing this soon.*)

# Superset-UI

This project is a sample demonstrating an idea of embedding superset into an Angular application using [superset-ui packages](https://github.com/apache-superset/superset-ui). But it may also help in regards to other frontend platforms such as React.

## What is superset-ui?

Superset-UI is a collection of packages (also available in `npm`), which provides all the chart-related React Components that are used in the main Apache Superset application. We can leverage these individual components to generate charts using the data from the main superset backend application.

### **superset-ui components can be classified as follows:**

#### **Core packages (`@superset-ui/core`)**

Mostly provides configuration that is required by the actual chart components such as configuring data formatters, data providers, plugins setup, theming, etc.

#### **Chart packages**

There are two types of chart packages:

##### **1. Legacy** (`@superset-ui/legacy-*`)

The legacy chart components uses data that is fetched using legacy API. This API uses visualization-specific python code to get the data (`viz.py`). This API is not listed in the OpenAPI (`/swagger/v1`) documentation of superset too. The legacy API URL that is used to fetch the data in this project is `/superset/explore_json/`

##### **2. New** (`@superset-ui/plugin-*`)

This is the new and preferred chart components. So we should use it whenever possible. It uses a new generic API to get the queries data, which is `/api/v1/chart/data`. This is also documented in the the OpenAPI (`/swagger/v1`) documentation.

#### How to know which chart and the API to use between these two chart packages?

If we are using `<ChartDataProvider>` component, then we don't need to worry about it, because this component will internally handle required request data and the selection of legacy and new API.

But if we need to directly get the data from the API, then we need to know which API to hit for the charts that we need to render.

For example, if the chart is `Table`, `Bar`,  `Area`, then we need to get data from  `/superset/explore_json/`. For `Pie`, `Box Plot`, we need to get data from `/api/v1/chart/data`. Not only the API, but also the request data needs to be determined. 

So to achieve this, we can use `getChartMetadataRegistry().get(vizType).useLegacyApi` and `buildQueryContext()` from `@superset-ui/core`. (See `chartAction.js`)

## React Components in Angular Application

In React,

```jsx
return(
    <ThemeProvider theme={theme}>
        <SuperChart
        chartType="pie"
        datasource={{
            columnFormats: {},
            verboseMap: this.verboseMap,
		}}
        formData={DataFormData.pie_form_data}
        queriesData={DataFormData.pie.result}
        />
    </ThemeProvider>
);
```

In Angular, we write JSX using JS. We need `react` and `react-dom` dependencies for it. (See `react-chart.component.ts`).

*(This is not yet a perfect way to do this, mainly the nesting of ThemeProvider and SuperChart components.)*

```typescript
const themeProps: ThemeProviderProps = {
	theme: this.theme,
	children: this.children,
};
const chartProps = {
	chartType: this.formData.viz_type,
	formData: this.formDataForChart,
	queriesData: this.queriesData,
	width: this.width,
	height: this.height,
	datasource: {
        columnFormats: {},
        verboseMap: this.verboseMap,
	},
};
ReactDOM.render(
	React.createElement(
		ThemeProvider,
		themeProps,
		React.createElement(SuperChart, chartProps)
	),
	root
);
```

## Superset-UI Setup Configurations

To use superset-ui chart components in an angular application, we first need to setup some configurations that are required for chart rendering. In this project, we have setup following:

1. The charts themselves (`setup/MainPreset.ts`)
2. Client (`setup/setupClient.ts`)
3. Colors (`setup/setupColors.ts`)
4. Formatters (`setup/setupFormatters.ts`), and also some other things.

## Bootstrap, jQuery and Superset-UI

Superset-UI uses bootstrap version 3.4.1. But I'm using bootstrap 4.5.0 for the given example. Using two versions of bootstrap in same Angular app is possible, but it would require View Encapsulation in the components where superset-ui charts are used. Due to this, the global css and js set by superset-ui in runtime is not reflected in our charts. So we cannot use two versions of bootstrap in our case.

To overcome this, we left our Angular application's bootstrap version as it is (4.5.0). Some styles from version 3.4.1 are still supported by 4.5.0. For those styles, we don't have any problem. But there are some styles such as pagination, etc. which is not supported by 4.5.0. So we have to get the css styles from 3.4.1 and put that into our angular component's stylesheet. We have also used `encapsulation: ViewEncapsulation.None` where the superset-ui components is used, which will enable us to access global styles by maintaining a css-class-controlled encapsulation. This means our component will have a parent class that should only be used in this single component. (`See dashboard.component-final.ts/.html/.scss`)

Bootstrap's JS as well as the jQuery are also needed by supserset-ui charts. So we need to include it in our app as well.

## Embedding Superset Dashboard using Superset-UI

We are not directly embedding the dashboard here, unlike iFrames. Here we are using the superset-ui React components in our Angular application. Since superset-ui only provides individual chart components, we need to manually build dashboard using these components. This also includes making the same layout that looks same to the dashboard.

We follow following steps:

1. Get dashboard details:

   API: `/api/v1/dashboard/{dashboardId}`

   This API not only contains the normal dashboard data, **but the most important of all is the `position_json` parameter.**

   For example, below is a simple `position_json` data. This contains all the required information regarding the layout of the dashboard and the charts in it such as its position (in row, column), width, height, etc. The width of charts is based on the 12-grid system, which means it can be well structured within the common Bootstrap grid system. Otherwise, we can also leverage Javascript. For this project, we have used Bootstrap. For the height, one unit of height is equivalent to 8px as of now. So we have to adjust accordingly.

   ```json
   {
     "CHART-DvZAucX3qs": {
       "children": [],
       "id": "CHART-DvZAucX3qs",
       "meta": {
         "chartId": 143,
         "height": 46,
         "sliceName": "Test Table",
         "uuid": "1218c510-255e-4e6b-9b3b-80077ad024dc",
         "width": 7
       },
       "parents": [
         "ROOT_ID",
         "GRID_ID",
         "ROW-xC504wIkkE"
       ],
       "type": "CHART"
     },
     "CHART-IY2fzc5NiC": {
       "children": [],
       "id": "CHART-IY2fzc5NiC",
       "meta": {
         "chartId": 144,
         "height": 46,
         "sliceName": "Request Status",
         "uuid": "3b5b59ac-cb02-4bdc-b0fa-a80969af5f5a",
         "width": 5
       },
       "parents": [
         "ROOT_ID",
         "GRID_ID",
         "ROW-xC504wIkkE"
       ],
       "type": "CHART"
     },
     "CHART-mgKJHYw2F6": {
       "children": [],
       "id": "CHART-mgKJHYw2F6",
       "meta": {
         "chartId": 146,
         "height": 50,
         "sliceName": "Amount Range 2 (2)",
         "uuid": "540f8c47-8aa4-4dec-90eb-f913acb2cfd2",
         "width": 7
       },
       "parents": [
         "ROOT_ID",
         "GRID_ID",
         "ROW-ANM3Amm4ls"
       ],
       "type": "CHART"
     },
     "DASHBOARD_VERSION_KEY": "v2",
     "DIVIDER-zZb8wKm-pm": {
       "children": [],
       "id": "DIVIDER-zZb8wKm-pm",
       "meta": {},
       "parents": [
         "ROOT_ID",
         "GRID_ID"
       ],
       "type": "DIVIDER"
     },
     "GRID_ID": {
       "children": [
         "ROW-xC504wIkkE",
         "DIVIDER-zZb8wKm-pm",
         "ROW-ANM3Amm4ls"
       ],
       "id": "GRID_ID",
       "parents": [
         "ROOT_ID"
       ],
       "type": "GRID"
     },
     "HEADER_ID": {
       "id": "HEADER_ID",
       "meta": {
         "text": "mPay - 2"
       },
       "type": "HEADER"
     },
     "ROOT_ID": {
       "children": [
         "GRID_ID"
       ],
       "id": "ROOT_ID",
       "type": "ROOT"
     },
     "ROW-ANM3Amm4ls": {
       "children": [
         "CHART-mgKJHYw2F6"
       ],
       "id": "ROW-ANM3Amm4ls",
       "meta": {
         "background": "BACKGROUND_TRANSPARENT"
       },
       "parents": [
         "ROOT_ID",
         "GRID_ID"
       ],
       "type": "ROW"
     },
     "ROW-xC504wIkkE": {
       "children": [
         "CHART-DvZAucX3qs",
         "CHART-IY2fzc5NiC"
       ],
       "id": "ROW-xC504wIkkE",
       "meta": {
         "background": "BACKGROUND_TRANSPARENT"
       },
       "parents": [
         "ROOT_ID",
         "GRID_ID"
       ],
       "type": "ROW"
     }
   }
   ```

2. After layout is ready, we can then move on to fetch the actual charts.
   The data related to chart can be divided into two: **`Form Data`** and **`Queries Data`**.
   **`Form Data`** is the preliminary data that actually tells the API to which and how the query will be executed. It forms the basis for the query that will be executed for that particular chart. It also contains other useful information for chart rendering.
   **`Queries Data`** is the actual dataset returned by the query that will be visualized by the chart.

3. Get `form data` of all charts in a dashboard:

   API: `/api/v1/dashboard/{dashboardId}/charts`
   This will return all the charts in a dashboard. This will contain `form data` but not `queries data`. So we use the `form data` from this API to get the `queries data` from another API.

4. Get `queries data` of individual chart:
   **Legacy API:** `/superset/explore_json?form_data={slice_id_only}&dashboard_id={dbId}`
   Request body for legacy API is the same `form data` fetched earlier.
   Content Type is `multipart/form-data`
   **New API:** `/api/v1/chart/data?form_data={slice_id_only}&dashboard_id={dbId}`
   Request body for new API should be generated using `buildQueryContext()` from `@superset-ui/core` as explained earlier.
   Content Type is `application/json`

### Making requests to API manually or use `<ChartDataProvider>`

In this project, we are using Angular's HttpClient and making the requests manually. Instead of that we could have also used `<ChartDataProvider>`. It looks like following in React JSX:

```jsx
 return (
    <ChartDataProvider client={SupersetClient} formData={JSON.parse(formData)}>
        {({ loading, payload, error }) => {
            if (loading) return <div>Loading!</div>;
            if (error) return <div>error</div>;
            if (payload) {
                return (
                    <SuperChart
                        id={"1"}
                        chartType='bar'
                        formData={JSON.parse(formData)}
                        queryData={Array.isArray(payload.queryData) 
                            ? payload.queryData[0] 
                            : payload.queryData}
                        width={500}
                        height={500}
                    />
                )
            }
        }}
    </ChartDataProvider>
);
```

*I haven't yet figured out how to write this JSX in terms of javascript so that it could be applied into Angular. This is still a subject of study. Thats why its not used in this project.*

## Authentication of the API

For the new API, we can just use `access_token` and the `csrf_token` received from the authentication API. But for the legacy API, we need to use the `session token` .

## Replacement of NVD3 charts with Apache eCharts

Superset uses NVD3 charts for some important chart types such as `Bar`, `Area`, `Bubble`, etc. NVD3 is regarded as legacy charts along with some others. These are being replaced by eCharts soon which uses the new API. So we may expect the changes in coming future as [mentioned here](https://preset.io/blog/2021-4-1-why-echarts/).

## Limitations in Dashboard and Charts in this project

This project doesn't implement a full-fledged working model, but only represents a brief view on how a dashboard could be embedded into our application. I haven't yet tried Apache Superset to its full potential. So I don't know how much complex a dashboard or a chart could be. The features such as dashboard filters, chart annotations, and some of the dashboard components such as `Header`, `Markdown`, etc. are not implemented in this sample project.

## superset_config.py

CORS configuration needs to be set in the superset application.

```python
# CORS Options
ENABLE_CORS = True
CORS_OPTIONS = {
    'supports_credentials': True, 
    'allow_headers': [ 
        'X-CSRFToken', 'Content-Type', 'Origin', 'X-Requested-With', 'Accept', 
    ], 
    'resources': [ 
    	'/superset/dashboard/*',
    	'/api/v1/dashboard/*',
    	'/superset/explore/*',
    	'/api/v1/chart/data/*'
        '/api/v1/security/csrf_token/',  # auth 
        '/api/v1/formData/',  # sliceId => formData 
        '/superset/explore_json/*',  # legacy query API, formData => queryData 
        '/api/v1/query/',  # new query API, queryContext => queryData 
        '/superset/fetch_datasource_metadata/'  # datasource metadata
    ], 
    'origins': ['http://localhost:4200'],
}
```
