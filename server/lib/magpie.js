var util = require('util');
var querystring = require('querystring');
var request = require('request');
var moment = require('moment');
var _ = require('underscore');
_.mixin(require('underscore.deferred'));

function Magpie (client) {
  // Set up the base URL and the dictionary of reusable query parameters
  this.host = 'magpie.bazaarvoice.com/api';
  this.client = client;
  this.paths = {
    ugcimpression_timeseries : '/ugcimpressions/timeseries/client/',
    timeseries : '/client/timeseries/'
  };

  this.queryParams = {
    passkey : '69eda16e-121c-402a-b8e0-633030f14d75'
  };

  this.headers = {
    'Content-Type' : 'application/json'
  };
}

Magpie.prototype._buildUrl = function (path, dateMin, dateMax) {
  var queryParams = _.extend({}, this.queryParams, {
    clients : this.client,
    start_date : dateMin,
    end_date : dateMax
  });
  return util.format( 'https://%s%s?%s',
    this.host,
    this.paths[path],
    querystring.stringify(queryParams)
  );
};

Magpie.prototype.request = function (path, dateMin, dateMax) {
  var requestDfd = _.Deferred();
  var url = this._buildUrl(path, dateMin, dateMax);
  console.log('magpie request url = ', url);
  var self = this;
  request(url, function (error, response, body) {
    var rawData = getFirebirdData(body, self.client);

    var data = {
      raw : rawData,
      graph : processData(rawData)
    };

    requestDfd.resolve(data);
  });

  return requestDfd.promise();
};

function getFirebirdData (dataString, client) {
  var dataObj = JSON.parse(dataString);
  var fbData = {};

  _( dataObj.clientData[client.toLowerCase()] ).forEach(function (data, dateTime) {
    fbData[dateTime] = data.firebird.classes;
  });

  return fbData;
}

function processData (magpieData) {
  var dates = [];
  var errors = [];
  var impressions = [];
  var pageviews = {
    Read : [],
    Write : []
  };
  var scis = {
    Hover : [],
    Click : [],
    Paginate : [],
    Sort : [],
    Submission : [],
    Write : []
  };

  _(magpieData).forEach(function (dataObj, date) {
    dates.push( moment(date, 'YYYYMMDD').valueOf() );

    errors.push( parseInt(dataObj.Error ? dataObj.Error.totalEvents : 0) );
    impressions.push( parseInt(dataObj.Impression.totalEvents) );

    _(pageviews).forEach(function (array, key) {
      array.push( parseInt(dataObj.PageView.types[key].totalEvents) );
    });

    _(scis).forEach(function (array, key) {
      array.push( parseInt(dataObj.SCI.types[key] ? dataObj.SCI.types[key].totalEvents : 0) );
    });

  });

  return {
    dates : dates,
    errors : errors,
    impressions : impressions,
    pageviews : pageviews,
    scis : scis
  };
}

module.exports = function (client) {
  this.Magpie = Magpie;
  return new Magpie(client);
};
