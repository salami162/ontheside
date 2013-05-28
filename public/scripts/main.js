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
  'clientGraph'
], function (ClientGraph) {
  var graphModel = new ClientGraph.model();
  var graphView = new ClientGraph.view({
    model : graphModel,
    el : 'div.client-graph'
  });
});
