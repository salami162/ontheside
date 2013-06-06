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
      this.listenTo(this.get('filtersModel'), 'fetchGraph', this.fetchGraph);
      this.listenTo(Global.Bus, 'fetchClientCenterGraph', this.fetchClientCenterGraph);
    },

    fetchGraph : function (filtersModel) {
      var type = Global.Bus.get('graphType');
      this['fetch' + type[0].toUpperCase() + type.slice(1) + 'Graph'](filtersModel);
    },

    fetchNetworkGraph : function (filtersModel) {
      var self = this;
      this.setFilters({
        timeFrame : filtersModel.timeFrame,
        minWeight : filtersModel.minWeight
      });

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
        self.trigger('drawClientGraph', data);
      })
      .fail(function (error) {
        self.trigger('showError', error);
      });
    },

    fetchClientCenterGraph : function (filters) {
      var self = this;
      this.setFilters( _.extend({}, _(filters).pick('timeFrame', 'targetClient', 'minWeight')) );

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

    events : {
      'click #chart-tabs li a' : 'switchTab'
    },

    initialize : function (options) {
      Global.View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'drawClientGraph', this.drawClientGraph);
      this.listenTo(this, 'fetchDashboard', this.fetchDashboard);
      this.listenTo(this.model, 'drawClientCenterGraph', this.drawClientCenterGraph);
    },

    switchTab : function (e) {
      var tabName = $(e.target).text().toLowerCase();
      Global.Bus.set('graphType', tabName === 'network' ? tabName : 'clientCenter');
      Global.Bus.trigger('switchTab', tabName);
    },

    fetchDashboard : function (client) {
      Loading.show();
      Global.Bus.trigger( 'fetchClientDashboard', client, this.model.get('filters') );
    },

    drawClientGraph : function (data) {
      var self = this;
      this.$('div#network svg.chart').empty();
      Loading.hide();
      this.$('#chart-tabs a:first').tab('show');
      var forceGraph = new ForceGraph('div#network svg.chart', this.width, this.height, this);
      forceGraph.draw(data);
    },

    drawClientCenterGraph : function (data) {
      Global.Bus.set('graphType', 'clientCenter');
      var filters = this.model.get('filters');
      var targetClient = filters ? (filters.targetClient || '*') : '*';
      var selector = 'div#' + targetClient + ' svg.chart';
      var existTab = this.$('#chart-tabs').find('a.' + targetClient);

      if (existTab.length === 0) {
        this.$('#chart-tabs').append('<li><a href="#' + targetClient + '" data-toggle="tab" class="' + targetClient + '">' + targetClient + '</a></li>');
        this.$('.tab-content').append('<div id="' + targetClient + '" class="tab-pane"><svg class="chart"></svg></div>');
      }
      else {
        this.$('.tab-content').find(selector).empty();
      }

      this.$('#chart-tabs a.' + targetClient).tab('show');

      var forceGraph = new ForceGraph(selector, this.width, this.height, this);
      forceGraph.draw(data, true, targetClient);

      Loading.hide();
    }
  });

  return {
    model : clientGraphModel,
    view : clientGraphView
  };
});