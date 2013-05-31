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
      this.listenTo(this, 'updateClients', this.updateClients);
    },

    updateFilters : function (filters) {
      this.set(filters);
      this.trigger( 'fetchGraph', this.toJSON() );
    },

    updateClients : function (clients) {
      this.set('clients', clients);
      this.trigger('populateClients');
    }

  });

  var filtersView = Global.View.extend({
    name : 'filters',

    events: {
      'click button#update-chart' : 'updateChart',
      'change input#find-client' : 'selectClient'
    },

    initialize : function (options) {
      Global.View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'populateClients', this.populateClients);
      this.listenTo(Global.Bus, 'switchTab', this.updateTargetClient);
    },

    updateChart : function (e) {
      e.preventDefault();
      var filters = {
        targetClient : this.$('input#find-client').val() || '*',
        timeFrame : this.$('select#time-frame').val() || 'LAST_30_DAYS',
        minWeight : Math.max(this.$('input#weight-limit').val() || 50000, 1000)
      };
      Loading.show();
      this.model.trigger('updateFilters', filters);
    },

    populateClients : function () {
      var clients = this.model.get('clients');
      if ( !_(clients).isEmpty() ) {
        this.$('#find-client').typeahead({ source : clients });
      }
    },

    selectClient : function (e) {
      var targetClient = e.target.value;
      this.model.set('targetClient', targetClient);
      Loading.show();
      Global.Bus.trigger( 'fetchClientCenterGraph', this.model.toJSON() );
    },

    updateTargetClient : function (clientName) {
      if (clientName === 'network') {
        this.$('input#find-client').val('');
      }
      else {
        this.$('input#find-client').val(clientName);
      }
    }
  });

  return {
    model : filtersModel,
    view : filtersView
  };
});