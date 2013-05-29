define([
  'vendor/backbone',
  'vendor/jquery',
  'vendor/underscore',
  'vendor/d3.v3',
  'forceGraph',
  'treeGraph'
], function (Backbone, $, _, d3, ForceGraph, TreeGraph) {
  var clientGraphModel = Backbone.Model.extend({
    name : 'clientGraph',

    initialize : function (attrs, options) {
      this.set({
        baseUrl : 'http://localhost:3000'
      });
      this.listenTo(this, 'fetchClientGraph', this.fetchClientGraph);
      this.listenTo(this, 'fetchClientDashboard', this.fetchClientDashboard);
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
        self.trigger('drawClientGraph', data);
      })
      .fail(function (error) {
        self.trigger('showError', error);
      });
    },

    fetchClientDashboard : function (client) {
      var self = this;
      this.setFilters({ client : client });

      var fetchRequest = $.ajax({
        url : this.url('clientDashboard'),
        dataType : 'jsonp',
        async : true,
        cache : false,
        timeout : 20000
      });

      fetchRequest.done(function (data) {
        self.trigger('drawClientDashboard', data);
      })
      .fail(function (error) {
        self.trigger('showError', error);
      });
    }
  });

  var clientGraphView = Backbone.View.extend({
    name : 'clientGraph',
    width : 1280,
    height : 800,

    events: {
      'click button#update-chart': 'updateChart'
    },

    initialize : function (options) {
      Backbone.View.prototype.initialize.apply(this, arguments);
      this.svgChart = d3.select('svg')
                      .attr('width', this.width)
                      .attr('height', this.height);
      this.listenTo(this.model, 'drawClientGraph', this.drawClientGraph);
      this.listenTo(this.model, 'drawClientDashboard', this.drawClientDashboard);
    },

    updateChart : function (e) {
      e.preventDefault();
      var filters = {
        timeFrame : this.$('select#time-frame').val() || 'LAST_30_DAYS',
        minWeight : this.$('input#weight-limit').val() || 30
      };
      this.model.trigger('fetchClientGraph', filters);
    },

    drawClientGraph : function (data) {
      var self = this;
      this.$('svg.chart').empty();
      var forceGraph = new ForceGraph( 'svg.chart', 1280, 800, this );
      forceGraph.draw(data);
    },

    drawClientDashboard : function (data) {
      this.$('svg.chart').empty();
      var treeGraph = new TreeGraph( 'svg.chart', 1280, 800 );
      treeGraph.draw(data);
    }
  });

  return {
    model : clientGraphModel,
    view : clientGraphView
  };
});