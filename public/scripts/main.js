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
], function (clientGraph) {
  var graphData = new clientGraph();

  graphData.setFilters({
    start_date : '20130511',
    end_date : '20130515',
    minWeight : 25
  });

  graphData.fetch().done(function (data) {
    console.log(data);

  });

});
