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
  'clientGraph',
  'clientDashboard',
  'vendor/d3.v3',
  'vendor/underscore'
], function (
  GlobalBus,
  ClientGraph,
  ClientDashboard,
  d3,
  _
) {
  var graphModel = new ClientGraph.model();
  var graphView = new ClientGraph.view({
    model : graphModel,
    el : 'div.client-graph'
  });
  var dashboardModel = new ClientDashboard.model();
  var dashboardView = new ClientDashboard.view({
    model : dashboardModel,
    el : 'div#dashboard'
  });

});
