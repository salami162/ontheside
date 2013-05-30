define([
  'vendor/bootstrap',
  'vendor/underscore',
  'forceGraph',
  'loadingOverlay',
  'global'
], function ($, _, ForceGraph, Loading, Global) {
  var clientGraphModel = Global.Model.extend({
    name : 'clientGraph',

    initialize : function (attrs, options) {
      Global.Model.prototype.initialize.apply(this, arguments);
      this.listenTo(this, 'fetchClientGraph', this.fetchClientGraph);
    },

    fetchClientGraph : function (filters) {
      var self = this;
      this.setFilters(filters);

      var fetchRequest = $.ajax({
        url : this.url('clientGraph'),
        dataType : 'jsonp',
        async : true,
        cache : false,
        timeout : 20000
      });

      fetchRequest.done(function (data) {
        self.set(data);
        self.trigger('drawClientGraph', data);
      })
      .fail(function (error) {
        self.trigger('showError', error);
      });
    }
  });

  var clientGraphView = Global.View.extend({
    name : 'clientGraph',
    width : 1280,
    height : 800,

    events: {
      'click button#update-chart': 'updateChart'
    },

    initialize : function (options) {
      Global.View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'drawClientGraph', this.drawClientGraph);
      this.listenTo(this, 'fetchDashboard', this.fetchDashboard);
    },

    updateChart : function (e) {
      e.preventDefault();
      var filters = {
        timeFrame : this.$('select#time-frame').val() || 'LAST_30_DAYS',
        minWeight : this.$('input#weight-limit').val() || 30
      };
      Loading.show();
      this.model.trigger('fetchClientGraph', filters);
    },

    drawClientGraph : function (data) {
      var self = this;
      this.$('svg.chart').empty();
      Loading.hide();
      var forceGraph = new ForceGraph( 'svg.chart', 1280, 800, this );
      forceGraph.draw(data);
    },

    fetchDashboard : function (client) {
      Loading.show();
      Global.Bus.trigger( 'fetchClientDashboard', client, this.model.get('filters') );
    }
  });

  return {
    model : clientGraphModel,
    view : clientGraphView
  };
});