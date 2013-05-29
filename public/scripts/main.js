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
  'clientGraph',
  'vendor/d3.v3',
  'vendor/underscore'
], function (ClientGraph, d3, _) {
  var graphModel = new ClientGraph.model();
  var graphView = new ClientGraph.view({
    model : graphModel,
    el : 'div.client-graph'
  });
});
