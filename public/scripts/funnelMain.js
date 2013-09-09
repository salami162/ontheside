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
  'funnel',
  'vendor/underscore',
  'vendor/bootstrap'
], function (
  Funnel,
  _,
  $
) {
  console.log('steps = ', steps);
  var f = new Funnel();

  f.translate(steps);
  f.drawGraph();
});
