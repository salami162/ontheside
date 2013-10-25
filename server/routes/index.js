var _ = require('underscore');
var BVIO = require('../lib/bvio');
var Foosball = require('../lib/foosball')();
var Funnel = require('../lib/funnel')();
var DriverRatings = require('../lib/driverRatings')();

exports.index = function (req, res) {
  var data = {
    title : 'On the Side'
  };
  res.render('index', data);
};

exports.bvio = function (req, res) {
  var data = {
    title : 'BV Network Audience'
  };
  res.render('bvio', data);
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
  if ( !req.query.targetClient ) {
    return res.jsonp(500, {
      error : 'Client Name is required.'
    });
  }

  BVIO()
    .setClient(req.query.targetClient)
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
  if ( !req.query.targetClient ) {
    return res.jsonp(500, {
      error : 'Client Name is required.'
    });
  }

  BVIO()
    .setClient(req.query.targetClient)
    .setFilters({
      timeFrame : req.query.timeFrame || 'LAST_30_DAYS',
      minWeight : req.query.minWeight || 50000
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

exports.foosball = function (req, res) {
  var data = {
    title : 'We Love Foosball!'
  };
  Foosball.initialize().done(function (foosball) {
    res.render( 'foosball', _(data).extend(foosball) );
  });
};

exports.saveScore = function (req, res) {
  try {
    Foosball.saveScore(req.body);
    if (Foosball.serveLocal) {
      res.send(200);
    }
    else {
      console.log('redirect');
      res.redirect('/foosball');
    }
  }
  catch (e) {
    res.send(500, { error: e });
  }
};

exports.funnel = function (req, res) {
  var data = {
    title : 'Funnel Steps'
  };
  _(data).extend( Funnel.toJSON() );
  res.render( 'funnel', data );
};

exports.driverRatings = function (req, res) {
  var data = {
    title : 'Driver Ratings'
  };
  DriverRatings.getData({
    exists : false,
    min : 5
  }).done(function (ratings) {
    _(data).extend({
      drivers : ratings
    });
    res.render('driverratings', data);
  });
};