define([
  'vendor/bootstrap',
  'vendor/underscore',
  'vendor/d3.v3',
  'forceGraph',
  'treeGraph',
  'loadingOverlay',
  'global'
], function ($, _, d3, ForceGraph, TreeGraph, Loading, Global) {

  var dashboardModel = Global.Model.extend({
    name : 'dashboard',

    initialize : function (attrs, options) {
      this.set({
        baseUrl : 'http://localhost:3000'
      });
      this.listenTo(Global.Bus, 'fetchClientDashboard', this.fetchClientDashboard);
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
        self.set(data);
        self.trigger('showDashboard', data);
      })
      .fail(function (error) {
        self.trigger('showError', error);
      });
    }
  });

  var dashboardView = Global.View.extend({
    name : 'dashboard',

    events: {
      'click a.detail-list' : 'showDashboard',
      'click a.tree-chart' : 'drawTreeChart',
      'click a.centered-chart' : 'drawCenteredChart',
      'click button#close-dashboard' : 'hideDashboard'
    },

    initialize : function (options) {
      Global.View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'showDashboard', this.showDashboard);
    },

    showDashboard : function () {
      Loading.hide();
      var data = this.model.toJSON();
      if (data && data.raw) {
        var template = '<dl>'
                     + '  <dt>Impressions</dt>'
                     + '  <% _.each(impressions, function (data, key) { %>'
                     + '    <dd><%= key %> : <%= data.total %></dd>'
                     + '  <% }); %>'
                     + '  <dt>PageViews</dt>'
                     + '  <% _.each(pageViews.pageTypes, function (data, key) { %>'
                     + '    <dd><%= key %> : <%= data.total %></dd>'
                     + '  <% }); %>'
                     + '  <dt>Tracking Types</dt>'
                     + '  <% _.each(details.tracking, function (data) { %>'
                     + '    <dd><%= data %></dd>'
                     + '  <% }); %>'
                     + '  <dt>Uniques</dt>'
                     + '  <% _.each(uniques, function (data, key) { %>'
                     + '    <% if (data) { %>'
                     + '    <dd><%= key %> : <%= data %></dd>'
                     + '    <% } %>'
                     + '  <% }); %>'
                     + '</dl>';

        var compiled = _.template(template);
        var html = compiled(data.raw);
        this.$('.modal-body').html(html);
        this.$el.modal('show');
      }
    },

    hideDashboard : function (e) {
      this.$el.modal('hide');
    },

    drawTreeChart : function (e) {
      this.$('.modal-body').html('<svg class="tree-chart"></svg>');
      var treeGraph = new TreeGraph( 'svg.tree-chart', 1000, 800 );
      treeGraph.draw(this.model.toJSON().graph);
      this.resize();
    },

    drawCenteredChart : function (e) {

    },

    resize : function () {
      this.$el.css('width', 'auto');
      this.$('.modal-body').css('max-height', '800px');
    }
  });

  return {
    model : dashboardModel,
    view : dashboardView
  };

});