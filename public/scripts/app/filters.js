define([
  'vendor/bootstrap',
  'vendor/underscore',
  'loadingOverlay',
  'global'
], function ($, _, Loading, Global) {
  var filtersModel = Global.Model.extend({
    name : 'filters',

    initialize : function (attrs, options) {
      Global.Model.prototype.initialize.apply(this, arguments);
      this.set({
        targetClient : '*',
        timeFrame : 'LAST_30_DAYS',
        minWeight : 50000
      });
      this.listenTo(this, 'updateFilters', this.updateFilters);
    },

    updateFilters : function (filters) {
      this.set(filters);
      this.trigger( 'fetchClientGraph', this.toJSON() );
    }
  });

  var filtersView = Global.View.extend({
    name : 'filters',

    events: {
      'click button#update-chart': 'updateChart'
    },

    initialize : function (options) {
      Global.View.prototype.initialize.apply(this, arguments);
    },

    updateChart : function (e) {
      e.preventDefault();
      var filters = {
        targetClient : this.$('input#find-client').val() || '*',
        timeFrame : this.$('select#time-frame').val() || 'LAST_30_DAYS',
        minWeight : Math.min(this.$('input#weight-limit').val() || 50000, 50000)
      };
      Loading.show();
      this.model.trigger('updateFilters', filters);
    }

  });

  return {
    model : filtersModel,
    view : filtersView
  };
});