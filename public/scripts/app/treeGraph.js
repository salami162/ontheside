define([
  'vendor/underscore',
  'vendor/d3.v3'
], function (_, d3) {

  function treeGraph (selector, width, height) {
    this.margin = [20, 120, 20, 120];
    this.width = width || 800;
    this.height = height || 600;
    var w = this.width - this.margin[1] - this.margin[3];
    var h = this.height - this.margin[0] - this.margin[2];
    this.svgChart = d3.select(selector)
                      .attr('width', w)
                      .attr('height', h);
    this.tree = d3.layout.tree()
        .size([h, w]);
    this.diagonal = d3.svg.diagonal()
        .projection(function(d) {
          return [d.y, d.x];
        });

    return this;
  }

  treeGraph.prototype.draw = function (data) {
    var maxSize = data.size;
    var i = 0;
    var vis = this.svgChart
      .append("svg:g")
        .attr("transform", "translate(" + this.margin[3] + "," + this.margin[0] + ")");

    data.x0 = (this.height - this.margin[0] - this.margin[2]) / 2;
    data.y0 = 0;

    this.startNodes = this.tree.nodes(data).reverse();

    data.children.forEach(toggleAll);
    toggle(data.children[0]);
    toggle(data.children[0].children[1]);

    update(data, this);

    function update(source, ref) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = ref.tree.nodes(data).reverse();

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * 180; });

      // Update the nodes…
      var node = vis.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", function(d) {
            toggle(d);
            update(d, ref);
          });

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
          .data(ref.tree.links(nodes), function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return ref.diagonal({source: o, target: o});
          })
        .transition()
          .duration(duration)
          .attr("d", ref.diagonal);

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", ref.diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return ref.diagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }
  };

  treeGraph.prototype.update = function (source, vis, maxSize) {
    var self = this;
    var i = 0;

    var duration = d3.event && d3.event.altKey ? 5000 : 500;

    // Compute the new tree layout.
    var nodes = this.startNodes;

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
    });

    // Update the nodes…
    var node = vis.selectAll("g.node")
        .data(nodes, function(d) {
          return d.id || (d.id = ++i);
        });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", function(d) {
          toggle(d);
          update(d, ref);
        });

    nodeEnter.append("svg:circle")
        .attr("r", 1e-6)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        });

    nodeEnter.append("svg:text")
        .attr("x", function(d) {
          return d.children || d._children ? -10 : 10;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
        })
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
        .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

    nodeUpdate.select("circle")
        .attr("r", function (d) {
          var s = d.size ? Math.max( ( (30 / maxSize) * d.size ) , 4.5 ) : 4.5;
          return s;
        })
        // .attr("r", 4.5)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = vis.selectAll("path.link")
        .data(ref.tree.links(nodes), function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = { x : source.x0, y : source.y0 };
          return self.diagonal({ source : o, target : o });
        })
      .transition()
        .duration(duration)
        .attr("d", self.diagonal);

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", self.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = { x : source.x, y : source.y };
          return self.diagonal({source : o, target : o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
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

  return treeGraph;
});
