var util = require('util');
var querystring = require('querystring');
var request = require('request');
var moment = require('moment');
var _ = require('underscore');
_.mixin(require('underscore.deferred'));

function BVIO (client) {
  // Set up the base URL and the dictionary of reusable query parameters
  this.host = 'web-cdh4-bv-io-client-graph.mag.bazaarvoice.com:8080/api';
  this.client = client || '*';
  this.paths = {
    clientGraph : '/graph/client',
    clientDashboard : '/client/dashboard/'
  };

  this.queryParams = {
    passkey : 'e7da1235-02e6-4a77-b0f8-a0444f278aab',
    stack : 'staging'
  };

  this.headers = {
    'Content-Type' : 'application/json'
  };
}

BVIO.prototype.setFilters = function(filters) {
  this.filters = filters;
  return this;
};

BVIO.prototype._buildUrl = function (type) {
  var queryParams = _.extend({}, this.queryParams, this.filters);
  return util.format( 'http://%s%s?%s',
    this.host,
    this.paths[type],
    querystring.stringify(queryParams)
  );
};

BVIO.prototype.request = function (path) {
  var requestDfd = _.Deferred();
  var url = this._buildUrl(path);
  console.log('bvio request url = ', url);
  var self = this;
  request(url, function (error, response, body) {
    requestDfd.resolve( processData(body) );
  });

  return requestDfd.promise();
};

function processData (rawData) {
  rawData = JSON.parse(rawData);
  var graphData = {
    nodes : [],
    links : []
  };
  var vertices = rawData.vertices;
  var edges = rawData.edges;

  graphData.nodes = _(vertices)
    .chain()
    .sort(function (vertex) {
      return vertex.id;
    })
    .map(function (vertex) {
      return {
        name : vertex.name
      };
    }).value();

  graphData.links = _(edges)
    .map(function (edge) {
      return {
        source : edge.from - 1,
        target : edge.to - 1,
        value : edge.weight
      };
    });
  return graphData;
}

module.exports = function (client) {
  this.BVIO = BVIO;
  return new BVIO();
};
