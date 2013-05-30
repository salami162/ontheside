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
      minWeight : req.query.minWeight || 50000
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

exports.clientDashboard = function (req, res) {
  if ( !req.query.client ) {
    return res.jsonp(500, {
      error : 'Client Name is required.'
    });
  }

  BVIO()
    .setClient(req.query.client)
    .setFilterDates(req.query.timeFrame || 'LAST_30_DAYS')
    .request('clientDashboard')
      .done(function (data) {
        res.jsonp(200, data);
      })
      .fail(function (error) {
        res.jsonp(500, {
          error : 'Request server data failed!'
        });
      });
};

exports.clientCenterGraph = function (req, res) {
  if ( !req.query.client ) {
    return res.jsonp(500, {
      error : 'Client Name is required.'
    });
  }

  BVIO()
    .setClient(req.query.client)
    .setFilters({
      timeFrame : req.query.timeFrame || 'LAST_30_DAYS',
      minWeight : (req.query.minWeight * 0.8) || 40000
    })
    .request('clientCenterGraph')
      .done(function (data) {
        res.jsonp(200, data);
      })
      .fail(function (error) {
        res.jsonp(500, {
          error : 'Request server data failed!'
        });
      });
};
