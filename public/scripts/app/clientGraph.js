define([
  'vendor/backbone',
  'vendor/jquery',
  'vendor/underscore'
], function (Backbone, $, _) {
  var clientGraphModel = Backbone.Model.extend({
    name : 'clientGraph',

    initialize : function (attrs, options) {
      this.set({
        baseUrl : 'http://web-cdh4-bv-io-client-graph.mag.bazaarvoice.com:8080/api/graph/client',
        stack : 'staging',
        passkey : 'e7da1235-02e6-4a77-b0f8-a0444f278aab'
      });
    },

    setFilters : function (filters) {
      var currentFilters = this.get('filters') || {};
      _(currentFilters).extend(filters);
      this.set('filters', currentFilters);
    },

    url : function () {
      var fetchUrl = this.get('baseUrl') + '?passkey=' + this.get('passkey');
      var params = {
        stack : this.get('stack')
      };
      _(params).extend(this.get('filters'));

      _(params).forEach(function (val, key) {
        fetchUrl = fetchUrl + '&' + key + '=' + val;
      });
      return fetchUrl;
    },

    fetch : function () {
      var fetchUrl = this.url();

      var fetchData = $.ajax({
        url : fetchUrl,
        dataType : 'jsonp',
        cache : false,
        timeout : 20000,
        jsonpCallback : 'bvio' + $.fn.jquery.replace(/\./ig, "") + '_' + Date.now(),
        success : function(json) {
          console.dir(json.sites);
        },
        error : function(e) {
          console.log(e.message);
        }
      });

      return fetchData;
    }

  });

  return clientGraphModel;
});