var util = require('util');
var querystring = require('querystring');
var request = require('request');
var moment = require('moment');
var _ = require('underscore');
_.mixin(require('underscore.deferred'));

function BVIO (client) {
  // Set up the base URL and the dictionary of reusable query parameters
  this.host = 'web-cdh4-bv-io-client-graph.mag.bazaarvoice.com:8080/api';
  this.paths = {
    clientGraph : '/graph/enhanced/client',
    clientDashboard : '/client/dashboard/',
    clientCenterGraph : '/graph/client/'
  };

  this.queryParams = {
    passkey : 'e7da1235-02e6-4a77-b0f8-a0444f278aab',
    stack : 'production'
  };

  this.urlFormats = {
    clientGraph : 'http://%s%s?%s',
    clientDashboard : 'http://%s%s%s?%s',
    clientCenterGraph : 'http://%s%s%s?%s'
  };

  this.processFunc = {
    clientGraph : processGraphData,
    clientDashboard : processDashboardData,
    clientCenterGraph : processGraphData
  };

  this.headers = {
    'Content-Type' : 'application/json'
  };
}

BVIO.prototype.setFilterDates = function (timeFrame) {
  this.filters = this.filters || {};
  delete this.filters.timeFrame;

  var currentDate = moment();
  this.filters.end_date = currentDate.format('YYYYMMDD');

  if (timeFrame === 'LAST_30_DAYS') {
    this.filters.start_date = currentDate.subtract('days', 30).format('YYYYMMDD');
  }
  else if (timeFrame === 'LAST_7_DAYS') {
    this.filters.start_date = currentDate.subtract('days', 7).format('YYYYMMDD');
  }
  else if (timeFrame === 'LAST_DAY') {
    this.filters.start_date = currentDate.subtract('days', 1).format('YYYYMMDD');
  }
  return this;
};

BVIO.prototype.setFilters = function (filters) {
  this.filters = filters;
  return this;
};

BVIO.prototype.setClient = function (name) {
  this.client = name;
  return this;
};

BVIO.prototype._buildUrl = function (type) {
  var queryParams = _.extend({}, this.queryParams, this.filters);

  var urlString = util.format( this.urlFormats[type],
    this.host,
    this.paths[type]
  );

  if (this.client) {
    urlString = util.format( urlString, this.client, querystring.stringify(queryParams) );
  }
  else {
    urlString = util.format( urlString, querystring.stringify(queryParams) );
  }
  return urlString;
};

BVIO.prototype.request = function (path) {
  var requestDfd = _.Deferred();
  var url = this._buildUrl(path);
  console.log(path, url);
  var self = this;
  request(url, function (error, response, body) {
    requestDfd.resolve( self.processFunc[path](body, self) );
  });

  return requestDfd.promise();
};

function processGraphData (rawData, reference) {
  rawData = JSON.parse(rawData);
  var graphData = {
    nodes : [],
    links : []
  };
  var vertices = rawData.vertices;
  var edges = rawData.edges;

  graphData.nodes = _(vertices)
    .chain()
    .sortBy(function (vertex) {
      return vertex.id;
    })
    .map(function (vertex) {
      return {
        name : vertex.name,
        group : vertex.networkCookie ? 0 : 1
      };
    }).value();

  graphData.links = _(edges)
    .map(function (edge) {
      return {
        source : edge.from - 1,
        target : edge.to - 1,
        value : edge.weight,
        left : false,
        right : true
      };
    });

  graphData.clients = _(vertices)
    .map(function (vertex) {
      return vertex.name;
    }).sort();

  return graphData;
}

function processDashboardData (rawData, reference) {
  rawData = JSON.parse(rawData);
  if (rawData.uniques && rawData.uniques.earliestVisitor) {
    rawData.uniques.earliestVisitor = moment(rawData.uniques.earliestVisitor).format('L');
  }
  var dashboard = {
    name : reference.client,
    children : buildNode(rawData)
  };
  var size = 0;
  _(dashboard.children).forEach(function (c) {
    size = size + c.size;
  });
  dashboard.size = size;
  dashboard.isRoot = true;

  return {
    graph : dashboard,
    raw : rawData
  };
}

function buildNode (node) {
  var array = [];
  var isArray = _(node).isArray();

  _(node).forEach(function (childNode, key) {
    if (key !== 'total') {
      var child = {
        name : isArray ? childNode : key,
        size : 0
      };
      if ( !_(childNode).isObject() ) {
        if ( _(childNode).isNumber() ) {
          child.size = isArray ? 1 : childNode;
        }
      }
      else {
        child.children = buildNode(childNode);
        if (childNode.total) {
          var total = childNode.total;
          if ( _(total).isObject() ) {
            total = total.total;
          }
          child.size = total;
        }
        else {
          child.size = _(child.children).reduce(function (memo, value) {return memo + value.size;}, 0);
        }
      }
      array.push(child);
    }
  });
  return array;
}

module.exports = function (client) {
  this.BVIO = BVIO;
  return new BVIO();
};
