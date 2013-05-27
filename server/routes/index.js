var _ = require('underscore');
var BVIO = require('../lib/bvio');

exports.index = function (req, res) {
  var data = {
    title : 'Limin Shen'
  };
  res.render('index', data);
};

exports.clientGraph = function (req, res) {
  BVIO()
    .setFilters({
      timeFrame : req.query.timeFrame || 'LAST_30_DAYS',
      minWeight : req.query.minWeight || 30
    })
    .request('clientGraph')
      .done(function (data) {
        res.jsonp(200, data);
      })
      .fail(function (error) {
        res.jsonp(500, {
          error : 'Request server data failed!'
        });
      });
};

