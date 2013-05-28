define([
  'vendor/backbone',
  'vendor/jquery',
  'vendor/underscore',
  'vendor/d3.v3'
], function (Backbone, $, _, d3) {
  var clientGraphModel = Backbone.Model.extend({
    name : 'clientGraph',

    initialize : function (attrs, options) {
      this.set({
        baseUrl : 'http://localhost:3000/clientGraph'
      });
      this.listenTo(this, 'fetchClientGraph', this.fetch);
    },

    setFilters : function (filters) {
      var currentFilters = this.get('filters') || {};
      _(currentFilters).extend(filters);
      this.set('filters', currentFilters);
    },

    url : function () {
      var fetchUrl = this.get('baseUrl');
      var params = _.extend( {}, this.get('filters') );
      var paramString = '';
      _(params).forEach(function (val, key) {
        paramString = paramString + key + '=' + val + '&';
      });
      return fetchUrl + '?' + paramString.substring(0, paramString.length - 1);
    },

    fetch : function (filters) {
      var self = this;
      this.setFilters(filters);

      var fetchRequest = $.ajax({
        url : this.url(),
        dataType : 'jsonp',
        async : true,
        cache : false,
        timeout : 20000
      });

      fetchRequest.done(function (data) {
        self.trigger('drawGraph', data);
      })
      .fail(function (error) {
        self.trigger('showError', error);
      });
    }
  });

  var clientGraphView = Backbone.View.extend({
    name : 'clientGraph',
    width : 1000,
    height : 600,

    events: {
      'click button#update-chart': 'updateChart'
    },

    initialize : function (options) {
      Backbone.View.prototype.initialize.apply(this, arguments);
      this.svgChart = d3.select('svg')
                      .attr('width', this.width)
                      .attr('height', this.height);
      this.listenTo(this.model, 'drawGraph', this.drawGraph);
    },

    updateChart : function (e) {
      e.preventDefault();
      var filters = {
        timeFrame : this.$('select#time-frame').val() || 'LAST_30_DAYS',
        minWeight : this.$('input#weight-limit').val() || 30
      };
      this.model.trigger('fetchClientGraph', filters);
    },

    drawGraph : function (data) {
      this.$('svg.chart').empty();

      var force = d3.layout.force()
          .gravity(0.05)
          .distance(300)
          .charge(-100)
          .size([this.width, this.height]);

        force
            .nodes(data.nodes)
            .links(data.links)
            .start();

        var link = this.svgChart.selectAll(".link")
            .data(data.links)
          .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
              return (d.value / 50);
            });

        var node = this.svgChart.selectAll('.node')
            .data(data.nodes)
          .enter().append('g')
            .attr('class', 'node')
            .call(force.drag)
            .on('mousedown', function(d) {
              d.fixed = true;
              var selectedNode = d3.select(this).select('circle')
                .classed('sticky', true);
            });

        node.append('circle')
          .attr('r', 10);

        node.append('text')
            .attr('dx', 16)
            .attr('dy', '.95em')
            .text(function(d) { return d.name; });

        force.on('tick', function() {
          link.attr('x1', function(d) { return d.source.x; })
              .attr('y1', function(d) { return d.source.y; })
              .attr('x2', function(d) { return d.target.x; })
              .attr('y2', function(d) { return d.target.y; });

          node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
        });
    }
  });

  return {
    model : clientGraphModel,
    view : clientGraphView
  };
});