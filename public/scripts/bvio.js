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
  'bvio/global',
  'bvio/filters',
  'bvio/clientGraph',
  'bvio/clientDashboard',
  'vendor/d3.v3',
  'vendor/underscore'
], function (
  Global,
  Filters,
  ClientGraph,
  ClientDashboard,
  d3,
  _
) {
  Global.Bus.set('graphType', 'network');
  var filtersModel = new Filters.model();
  var filtersView = new Filters.view({
    model : filtersModel,
    el : 'ul.nav'
  });

  var graphModel = new ClientGraph.model({
    filtersModel : filtersModel
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
