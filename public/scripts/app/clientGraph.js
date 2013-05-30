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
      this.listenTo(Global.Bus, 'fetchClientCenterGraph', this.fetchClientCenterGraph);
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
    },

    fetchClientCenterGraph : function (client, filters) {
      var self = this;
      this.setFilters( _.extend({}, _(filters).pick('timeFrame', 'targetClient', 'minWeight'), { client : client }) );

      var fetchRequest = $.ajax({
        url : this.url('clientCenterGraph'),
        dataType : 'jsonp',
        async : true,
        cache : false,
        timeout : 20000
      });

      fetchRequest.done(function (data) {
        self.trigger('drawClientCenterGraph', data);
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
      this.listenTo(this.model, 'drawClientCenterGraph', this.drawClientCenterGraph);
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
    },

    drawClientCenterGraph : function (data) {
      var filters = this.model.get('filters');
      var targetClient = filters ? (filters.targetClient || '*') : '*';
      this.$('#chart-tabs').append('<li><a href="#' + targetClient + '" data-toggle="tab" class="' + targetClient + '">' + targetClient + '</a></li>');
      this.$('.tab-content').append('<div id="' + targetClient + '" class="tab-pane"><svg class="chart"></svg></div>');

      Loading.hide();

      var selector = 'div#' + targetClient + ' svg.chart'
      var treeGraph = new ForceGraph( selector, this.width, this.height, this );
      treeGraph.draw(data);
      this.$('#chart-tabs a.' + targetClient).tab('show');
    }
  });

  return {
    model : clientGraphModel,
    view : clientGraphView
  };
});