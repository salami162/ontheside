requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
//        app: '../app'
    }
});


// define window
define('window', function () {
  return window;
});


// define env
define('env', ['window', 'backbone'], function (window, backbone) {
  window.givepulse = window.givepulse || {};
  var Env = backbone.Model.extend({});
  window.givepulse.env = new Env(window.givepulse.options || {});
  window.givepulse.options = undefined;
  return window.givepulse.env;
});

// define error
define('gperror', ['window'], function (window) {
  return {
    dataError : function (msg) {
      msg = msg || 'There was an error.';

      console.log(msg);
    }
  };
});


require('main', {
    hbs : {
        templateExtension : 'hbs',
        disableI18n : true
    },
    paths : { 'template' : '../templates' }
},
[
  'env',
  'jquery',
//  'View/Intervals',
//  'Model/Interval',
//  'Collection/Intervals',
  'gperror',
//  'hbs!template/container'
], function (env, $, /*IntervalsView, IntervalModel, IntervalCollection, */gpError/*, containerTmpl*/) {
  var dataError = globalError.dataError;

  //set initial state
  var $dfd = $.ajax({
    url : env.get('api_base_url') + 'challenge/' + env.get('challenge_id')
  });

  $dfd.success(function (resp) {
    if (resp.error) {
      return dataError(resp.error_msg);
    }

    var data = resp.data;
    console.log('data', data);
    env.set({
    });

    document.getElementsByTagName('body')[0].innerHTML = containerTmpl(env.toJSON());

//    mainView.render();
  });

  $dfd.fail(dataError);
});
