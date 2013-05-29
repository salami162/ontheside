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
      this.$('svg.chart').empty();
      this.forceGraph(data);
      // this.bundleGraph(data);
    },

    _createMarkers : function () {
      this.svgChart.append('svg:defs').append('svg:marker')
          .attr('id', 'end-arrow')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 6)
          .attr('markerWidth', 3)
          .attr('markerHeight', 3)
          .attr('orient', 'auto')
        .append('svg:path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', '#999');

      this.svgChart.append('svg:defs').append('svg:marker')
          .attr('id', 'start-arrow')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 4)
          .attr('markerWidth', 3)
          .attr('markerHeight', 3)
          .attr('orient', 'auto')
        .append('svg:path')
          .attr('d', 'M10,-5L0,0L10,5')
          .attr('fill', '#999');
    },

    _displayWeight : function (d) {
      var self = this;
      var links = this.svgChart.selectAll('path.link.' + d.name)
        .classed('highlight', true);

      _(links[0]).forEach(function(slink) {
        var pathText = self.svgChart.append("text")
          .attr('class','link_text')
          .attr('x', 20)
          .attr('dy', 25);

        pathText.append('textPath')
          .attr('xlink:href', function() {
            return '#' + slink.id;
          })
          .attr('class','text_path')
          .style('fill','#000')
          .text(function(text, i) {
            var ids = slink.id.split('_');
            return ids.pop();
          });
      });
    },

    _removeDisplay : function (d) {
      this.svgChart
        .selectAll('path.link.' + d.name)
        .classed('highlight', false);

      this.svgChart
        .selectAll('text.link_text')
        .remove();
    },

    _addSticky : function (d) {
      d.fixed = true;
      d3.select(this).select('circle')
        .classed('sticky', true);
    },

    _onTick : function () {
      var link = this.svgChart.selectAll('.link');
      var node = this.svgChart.selectAll('.node');
      // draw directed edges with proper padding from node centers
      link.attr('d', function(d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = d.left ? 17 : 12,
            targetPadding = d.right ? 17 : 12,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
      });

      node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    },

    forceGraph : function (data) {
      var self = this;
      var longestPath = _(data.links).max(function (path) {
        return path.value;
      });
      var ratio = 300 / longestPath.value;

      var force = d3.layout.force()
          .gravity(0.05)
          .distance(function (d) {
            return d.value * ratio;
          })
          .charge(-500)
          .size([this.width, this.height]);
      force
          .nodes(data.nodes)
          .links(data.links)
          .start();

      this._createMarkers();

      var link = this.svgChart.selectAll('.link')
          .data(data.links)
        .enter().append('svg:path')
          .attr('class', function (d) {
            return 'link ' + d.source.name + ' ' + d.target.name;
          })
          .attr('id', function (d) {
            return d.source.name + '_' + d.target.name + '_' + d.value;
          })
          .style("stroke-width", function(d) {
            return (d.value / 20);
          })
          .style('marker-start', function(d) {
            return d.left ? 'url(#start-arrow)' : '';
          })
          .style('marker-end', function(d) {
            return d.right ? 'url(#end-arrow)' : '';
          });

      var node = this.svgChart.selectAll('.node')
          .data(data.nodes)
        .enter().append('svg:g')
          .attr('class', function (d) {
            return 'node ' + d.name;
          })
          .call(force.drag)
          .on( 'mouseover', _.bind(this._displayWeight, this) )
          .on( 'mouseout', _.bind(this._removeDisplay, this) )
          .on( 'mousedown', this._addSticky)
          .on( 'dblclick', function (d) {
            console.log('double click');
            self.model.trigger('fetchClientDashboard', d.name);
          });

      node.append('circle')
        .attr('r', 10);

      node.append('text')
          .attr('dx', 16)
          .attr('dy', '.95em')
          .text(function(d) { return d.name; });

      force.on( 'tick', _.bind(this._onTick, this) );
    },

    bundleGraph : function (data) {
      var w = 1280,
          h = 800,
          rx = w / 2,
          ry = h / 2,
          m0,
          rotate = 0;


      var bundle = d3.layout.bundle();

      var line = d3.svg.line.radial()
          .interpolate("bundle")
          .tension(0.85)
          .radius(function(d) { return d.y; })
          .angle(function(d) { return d.x / 180 * Math.PI; });

      // Chrome 15 bug: <http://code.google.com/p/chromium/issues/detail?id=98951>
      var div = d3.select("body").insert("div", "h2")
          .style("top", "-80px")
          .style("left", "-160px")
          .style("width", w + "px")
          .style("height", w + "px")
          .style("position", "absolute");

      var svg = this.svgChart.append("svg:svg")
          .attr("width", w)
          .attr("height", w)
        .append("svg:g")
          .attr("transform", "translate(" + rx + "," + ry + ")");

      svg.append("svg:path")
          .attr("class", "arc")
          .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI));


        var nodes = data.nodes,
            links = data.links,
            splines = bundle(links);

        var path = svg.selectAll("path.link")
            .data(links)
          .enter().append("svg:path")
            .attr("class", function(d) { return "link source-" + d.source.key + " target-" + d.target.key; })
            .attr("d", function(d, i) { return line(splines[i]); });

        svg.selectAll("g.node")
            .data(nodes.filter(function(n) { return !n.children; }))
          .enter().append("svg:g")
            .attr("class", "node")
            .attr("id", function(d) { return "node-" + d.key; })
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
          .append("svg:text")
            .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
            .text(function(d) { return d.key; });
    },

    drawClientDashboard : function (data) {
      this.$('svg.chart').empty();
      this.treeGraph(data);
    },

    treeGraph : function (data) {
      var m = [20, 120, 20, 120],
          w = this.width - m[1] - m[3],
          h = this.height - m[0] - m[2],
          i = 0;
      var maxSize = data.size;

      var tree = d3.layout.tree()
          .size([h, w]);

      var diagonal = d3.svg.diagonal()
          .projection(function(d) {
            return [d.y, d.x];
          });

      var vis = this.svgChart
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        data.x0 = h / 2;
        data.y0 = 0;

        function toggleAll(d) {
          if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
          }
        }

        // Initialize the display to show a few nodes.
        data.children.forEach(toggleAll);
        toggle(data.children[0]);
        toggle(data.children[0].children[1]);

        update(data);

      function update(source) {
        var duration = d3.event && d3.event.altKey ? 5000 : 500;

        // Compute the new tree layout.
        var nodes = tree.nodes(data).reverse();

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        var node = vis.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function(d) { toggle(d); update(d); });

        nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeEnter.append("svg:text")
            .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) {
              var string = d.name;
              if (d.size && !d.isRoot) {
                string = string + '(' + d.size + ')';
              }
              return string;
            })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", function (d) {
              var s = d.size ? Math.max( ((30/maxSize) * d.size) , 4.5) : 4.5;
              return s;
            })
            // .attr("r", 4.5)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = vis.selectAll("path.link")
            .data(tree.links(nodes), function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            })
          .transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      // Toggle children.
      function toggle(d) {
        if (!d) {
          return;
        }
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
      }
    }
  });

  return {
    model : clientGraphModel,
    view : clientGraphView
  };
});