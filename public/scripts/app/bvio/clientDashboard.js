define([
  'vendor/bootstrap',
  'vendor/underscore',
  'vendor/d3.v3',
  'bvio/forceGraph',
  'bvio/treeGraph',
  'loadingOverlay',
  'bvio/global'
], function ($, _, d3, ForceGraph, TreeGraph, Loading, Global) {

  var dashboardModel = Global.Model.extend({
    name : 'dashboard',

    initialize : function (attrs, options) {
      Global.Model.prototype.initialize.apply(this, arguments);
      this.listenTo(Global.Bus, 'fetchClientDashboard', this.fetchClientDashboard);
    },

    fetchClientDashboard : function (client, filters) {
      var self = this;
      this.setFilters( _.extend({}, filters, { targetClient : client }) );

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
      'click a.center-chart' : 'fetchCenteredChart',
      'click button#close-dashboard' : 'hideDashboard'
    },

    initialize : function (options) {
      Global.View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'showDashboard', this.showDashboard);
    },

    showDashboard : function () {
      Loading.hide();
      var data = this.model.toJSON();

      var numbers = function(num) {
        var largeIntegerSuffixSpecs = [
          {
            factor: 1,
            ceiling: Math.pow(10, 6),
            suffix: undefined
          },
          {
            factor: Math.pow(10, 6),
            ceiling: Math.pow(10, 9),
            suffix: ' million'
          },
          {
            factor: Math.pow(10, 9),
            ceiling: Math.pow(10, 12),
            suffix: ' billion'
          },
          {
            factor: Math.pow(10, 12),
            ceiling: Math.pow(10, 15),
            suffix: ' trillion'
          }
        ];

        var index = 0;
        for (;index < largeIntegerSuffixSpecs.length; index++) {
          if (num < largeIntegerSuffixSpecs[index].ceiling) {
            break;
          }
        }

        var spec = largeIntegerSuffixSpecs[index];
        if (spec.suffix) {
          return (num / spec.factor).toFixed(2) + spec.suffix;
        }
        return num
      };

      var label = function(key, aliases) {
        return aliases[key] ? aliases[key] : key;
      };

      var context = {
        formatters: {
          uniqueData: function(key, val) {
            if (key === 'earliestVisitor') {
              return val;
            } else {
              return numbers(val);
            }
          },

          tracking: function(val) {
            var aliases = {
              "1st": "Client (1st party cookie)",
              "3rd": "Network (3rd party cookie)",
              "anon": "Anonymous",
              "1stAnd3rd": "Network + Client"
            };
            return label(val, aliases);
          },

          uniqueKeys: function(key) {
            var aliases = {
              "clientVisitors": "@ client",
              "totalNetworkVisitors": "network-wide",
              "earliestVisitor": "from"
            };
            return label(key, aliases);
          },

          number: function(num) {
            return numbers(num);
          }
        }
      };

      if (data && data.raw) {
        var template = '<div class="dashboard-details">'
                     + '  <div class="row-fluid">'
                     + '    <div class="span6">'
                     + '      <div class="text-info"><strong>Impressions</strong></div>'
                     + '      <% _.each(impressions, function (data, key) { %>'
                     + '        <div class="detail-item"><strong><%= key %> : </strong> <%= formatters.number(data.total) %></div>'
                     + '      <% }); %>'
                     + '    </div>'
                     + '    <div class="span6">'
                     + '      <div class="text-info"><strong>PageViews</strong></div>'
                     + '        <div class="detail-item"><strong>total : </strong><%= formatters.number(pageViews.total) %></div>'
                     + '        <% _.each(pageViews.pageTypes, function (data, key) { %>'
                     + '          <% if (key) { %>'
                     + '            <div class="detail-item"><strong><%= key %> : </strong><%= formatters.number(data.total) %></div>'
                     + '          <% } %>'
                     + '      <% }); %>'
                     + '    </div>'
                     + '  </div><br /><br />'
                     + '  <div class="row-fluid">'
                     + '    <div class="span6">'
                     + '      <div class="text-info"><strong>Uniques</strong></div>'
                     + '      <% _.each(uniques, function (data, key) { %>'
                     + '        <% if (data) { %>'
                     + '        <div class="detail-item"><strong><%= formatters.uniqueKeys(key) %> : </strong><%= formatters.uniqueData(key, data) %></div>'
                     + '        <% } %>'
                     + '      <% }); %>'
                     + '    </div>'
                     + '    <div class="span6">'
                     + '      <div class="text-info"><strong>Tracking Types</strong></div>'
                     + '      <% _.each(details.tracking, function (data) { %>'
                     + '        <div class="detail-item"><%= formatters.tracking(data) %></div>'
                     + '      <% }); %>'
                     + '    </div>'
                     + '  </div>'
                     + '</div>';

        var compiled = _.template(template);
        var html = compiled(_.extend(context, data.raw));
        this.$('.modal-body').html(html);
        this.$('#modal-title').html(data.filters.targetClient);
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

    fetchCenteredChart : function (e) {
      Loading.show();
      this.model.trigger('fetchClientCenterGraph');
    }

  });

  return {
    model : dashboardModel,
    view : dashboardView
  };

});