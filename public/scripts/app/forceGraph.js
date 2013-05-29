define([
  'vendor/underscore',
  'vendor/d3.v3'
], function (_, d3) {

  function forceGraph (selector, width, height, view) {
    this.width = width || 800;
    this.height = height || 600;
    this.svgChart = d3.select(selector)
                      .attr('width', this.width)
                      .attr('height', this.height);
    this.force = d3.layout.force()
      .gravity(0.05)
      .charge(-500)
      .size([this.width, this.height]);
    this.responseView = view;
    return this;
  }

  forceGraph.prototype.setDimensions = function (width, height) {
    this.width = width || this.width;
    this.height = height || this.height;
    this.svgChart.attr('width', this.width)
                 .attr('height', this.height);
    this.force.size([this.width, this.height]);
  };

  forceGraph.prototype._createMarkers = function () {
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
      return this;
  };

  forceGraph.prototype._displayWeight = function (d) {
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
    return this;
  };

  forceGraph.prototype._removeDisplay = function (d) {
    this.svgChart
      .selectAll('path.link.' + d.name)
      .classed('highlight', false);

    this.svgChart
      .selectAll('text.link_text')
      .remove();
    return this;
  };

  forceGraph.prototype._addSticky = function (d) {
    d.fixed = true;
    d3.select(this).select('circle')
      .classed('sticky', true);
    return this;
  };

  forceGraph.prototype._onTick = function () {
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

    node.attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
    return this;
  };

  forceGraph.prototype.draw = function (data) {
    var self = this;
    var longestPath = _(data.links).max(function (path) {
      return path.value;
    });
    var ratio = 300 / longestPath.value;

    this.force
        .distance(function (d) {
          return d.value * ratio;
        });

    this.force
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
        .call(this.force.drag)
        .on( 'mouseover', _.bind(this._displayWeight, this) )
        .on( 'mouseout', _.bind(this._removeDisplay, this) )
        .on( 'mousedown', this._addSticky)
        .on( 'dblclick', function (d) {
          self.responseView.model.trigger('fetchClientDashboard', d.name);
        });

    node.append('circle')
      .attr('r', 10);

    node.append('text')
        .attr('dx', 16)
        .attr('dy', '.95em')
        .text(function(d) { return d.name; });

    this.force.on( 'tick', _.bind(this._onTick, this) );
  };

  return forceGraph;
});
