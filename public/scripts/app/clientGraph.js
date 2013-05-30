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
      this.listenTo(this.get('filtersModel'), 'fetchClientGraph', this.fetchClientGraph);
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
        if (data && data.clients) {
          self.get('filtersModel').trigger('updateClients', data.clients);
        }
        console.log(data);
        self.trigger('drawClientGraph', data);
      })
      .fail(function (error) {
        self.trigger('showError', error);
      });
    }
  });

  var clientGraphView = Global.View.extend({
    name : 'clientGraph',
    width : 960,
    height : 660,

    initialize : function (options) {
      Global.View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'drawClientGraph', this.drawClientGraph);
      this.listenTo(this, 'fetchDashboard', this.fetchDashboard);
    },

    drawClientGraph : function (data) {
      var self = this;
      this.$('div#network svg.chart').empty();
      Loading.hide();
      this.$('#chart-tabs a:first').tab('show');
      var forceGraph = new ForceGraph( 'div#network svg.chart', this.width, this.height, this );
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