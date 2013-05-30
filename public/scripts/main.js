requirejs.config({
    baseUrl: 'scripts/app',
    paths: {
      vendor: '../vendor'
    }
});


// define window
define('window', function () {
  return window;
});


require([
  'global',
  'filters',
  'clientGraph',
  'clientDashboard',
  'vendor/d3.v3',
  'vendor/underscore'
], function (
  GlobalBus,
  Filters,
  ClientGraph,
  ClientDashboard,
  d3,
  _
) {
  var filtersModel = new Filters.model();
  var filtersView = new Filters.view({
    model : filtersModel,
    el : 'ul.nav'
  });

  var graphModel = new ClientGraph.model({
    filters : filtersModel
  });
  var graphView = new ClientGraph.view({
    model : graphModel,
    el : 'div.client-graph'
  });

  var dashboardModel = new ClientDashboard.model();
  var dashboardView = new ClientDashboard.view({
    model : dashboardModel,
    el : 'div#dashboard'
  });

  $('button#update-chart').click();
});
