define([
  'vendor/backbone',
  'vendor/jquery',
  'vendor/underscore'
], function (Backbone, $, _) {
  var clientGraphModel = Backbone.Model.extend({
    name : 'clientGraph',

    initialize : function (attrs, options) {
      this.set({
        baseUrl : 'http://localhost:3000/clientGraph'
      });
    },

    setFilters : function (filters) {
      var currentFilters = this.get('filters') || {};
      _(currentFilters).extend(filters);
      this.set('filters', currentFilters);
    },

    url : function () {
      var fetchUrl = this.get('baseUrl');
      var params = _.extend( {}, this.get('filters') );
      var paramString = '';
      _(params).forEach(function (val, key) {
        paramString = paramString + key + '=' + val + '&';
      });
      return fetchUrl + '?' + paramString.substring(0, paramString.length - 1);
    },

    fetch : function () {
      var fetchUrl = this.url();

      var fetchData = $.ajax({
        url : fetchUrl,
        dataType : 'jsonp',
        async : true,
        cache : false,
        timeout : 20000
      });

      return fetchData;
    }

  });

  return clientGraphModel;
});