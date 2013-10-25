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
  'driverRatings',
  'vendor/underscore',
  'vendor/bootstrap'
], function (
  DriverRatings,
  _,
  $
) {
  console.log(drivers);

  var dr = new DriverRatings(drivers);

  dr.drawGraph();

});
