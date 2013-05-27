requirejs.config({
    baseUrl: 'scripts/app',
    paths: {
      vendor: '../vendor'
    }
});


// define window
define('window', function () {
  return window;
});


require([
  'clientGraph',
  'vendor/d3.v3'
], function (ClientGraph, d3) {
  var graph = new ClientGraph();

  $('button#update-chart').click(function () {
    graph.setFilters({
      timeFrame : $('select#time-frame').val() || 'LAST_30_DAYS',
      minWeight : $('input#weight-limit').val() || 30
    });
    graph.fetch().done(function (data) {
      console.log(data);

      var json = data;

      var width = 1000,
          height = 600;

      var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

      var force = d3.layout.force()
          .gravity(0.05)
          .distance(300)
          .charge(-100)
          .size([width, height]);

        force
            .nodes(json.nodes)
            .links(json.links)
            .start();

        var link = svg.selectAll(".link")
            .data(json.links)
          .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(json.nodes)
          .enter().append("g")
            .attr("class", "node")
            .call(force.drag)
            .on("mousedown", function(d) {
              d.fixed = true;
              var selectedNode = d3.select(this).select('circle')
                .classed("sticky", true);
            });

        node.append("circle")
          .attr('r', 15);

        node.append("text")
            .attr("dx", 16)
            .attr("dy", ".95em")
            .text(function(d) { return d.name; });

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });
    });
    return false;
  });
});
