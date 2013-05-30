define([
  'vendor/backbone',
  'vendor/underscore'
], function (Backbone, _) {
  if ( !window.bvio ) {
    window.bvio = {
      globalBus : new Backbone.Model({ name : 'GlobalBus' })
    };
  }


  var clientModel = Backbone.Model.extend({
    name : 'clientModel',

    initialize : function (attrs, options) {
      this.set({
        baseUrl : 'http://localhost:3000'
      });
    },

    setFilters : function (filters) {
      var currentFilters = this.get('filters') || {};
      _(currentFilters).extend(filters);
      this.set('filters', currentFilters);
    },

    url : function (type) {
      var fetchUrl = this.get('baseUrl') + '/' + type;
      var params = _.extend( {}, this.get('filters') );
      var paramString = '';
      _(params).forEach(function (val, key) {
        paramString = paramString + key + '=' + val + '&';
      });
      return fetchUrl + '?' + paramString.substring(0, paramString.length - 1);
    }
  });

  return {
    Bus : window.bvio.globalBus,
    Model : clientModel,
    View : Backbone.View
  };
});