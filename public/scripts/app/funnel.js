define([
    'vendor/nv.d3',
    'vendor/d3.v3',
    'vendor/underscore',
    'vendor/jquery'
], function(nv, d3, _, $) {

    var Funnel = function () {};

    Funnel.prototype.translate = function (steps) {
      this.data = [];
      this.data.push({
        key : "Funnel Bar Graph",
        values : steps
      });
      this.displayInfo = {
        count: 'Count',
        avg_step_time: "Step time",
        avg_total_time: "Total time",
        step_perc: "Step %",
        cum_perc: "Cum %"
      };
    };

    Funnel.prototype.drawGraph = function () {
        var self = this,
            $chartSvg = $('.chart svg'),
            chartHeight = $chartSvg.height() - 80;

        nv.addGraph(function() {
        
            var chart = nv.models.discreteBarChart()
                .x(function(d) { return d.step.replace(/_/g, ' '); })
                .y(function(d) { return d.count; })
                .tooltips(false)
                .showValues(false);
            
            chart.yAxis.tickFormat(d3.format('d'));
            chart.valueFormat(d3.format('d'));

            var _updateLabels = function () {
              d3.selectAll('text.nv-text-box').remove();
              var textBoxes = d3.selectAll('g.nv-bar')
                  .append('text')
                  .attr('class', function (d) {
                    var $rect = $(this.previousSibling);
                    $(this).attr('data-mirror', $rect.attr('height') < chartHeight / 2);
                    return 'nv-text-box';
                  });

              var keys = _(self.displayInfo).keys(),
                  total = keys.length ;

              _(keys).each(function (key, index) {

                textBoxes.append('tspan')
                    .text(function (d) {
                      return self.displayInfo[key] + ':';
                    })
                    .attr('dy', function (d) {
                      var isMirror = $(this.parentNode).attr('data-mirror') === "true";
                      if (isMirror && index === 0) {
                        return 0 - ((total - index) * 40);
                      }
                      return 20;
                    })
                    .attr('x', 5);

                textBoxes.append('tspan')
                    .text(function (d) {
                      return d[key];
                    })
                    .attr('x', 15)
                    .attr('dy', 20);
              });

            };

            chart.update = function () {
                dispatch.beforeUpdate();
                container.transition().duration(transitionDuration).call(function() {
                  chart();
                  _.delay(_updateLabels, 550);
                });
            };

            d3.select('.chart svg')
                .datum(self.data)
                .transition().duration(500)
                .call(chart);


            _.delay(_updateLabels, 550);

  
            nv.utils.windowResize(function() {
              chart.update();
              _.delay(_updateLabels, 550);
            });

            return chart;
        });
    };

    return Funnel;
});