var util = require('util');
var querystring = require('querystring');
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var _ = require('underscore');
_.mixin(require('underscore.deferred'));

function BVIO (client) {
  // Set up the base URL and the dictionary of reusable query parameters
  this.host = 'web-cdh4-bv-io-client-graph.mag.bazaarvoice.com:8080/api';
  this.serveLocal = true; // set to true to read json file locally.
  this.paths = {
    clientGraph : '/graph/enhanced/client',
    clientDashboard : '/client/dashboard/',
    clientCenterGraph : '/graph/enhanced/client/'
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

  // for local json data file
  this.fileHost = __dirname + '/../data/';
}

BVIO.prototype.setFilterDates = function (timeFrame) {
  this.filters = this.filters || {};
  this.filters.timeFrame = timeFrame;

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

// format lookup key based on filters
BVIO.prototype._getLocalKey = function (type) {
  var filterFormat = {
    clientGraph : util.format('%s_%s', this.filters.minWeight, this.filters.timeFrame),
    clientDashboard : util.format('%s_%s', this.client, this.filters.timeFrame),
    clientCenterGraph : util.format('%s_%s_%s', this.client, this.filters.minWeight, this.filters.timeFrame)
  }
  var key = filterFormat[type].toLowerCase();
  console.log('lookup key = ', key);
  return key;
};
// build a path to the local JSON file
BVIO.prototype._buildLocalPath = function (type) {
  var filePath = {
    clientGraph : 'network-graph',
    clientDashboard : 'client-details',
    clientCenterGraph : 'client-graph'
  };
  return this.fileHost + filePath[type] + '.json';
};

// build real URL to the server if "serveLocal" flag is not set to true
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
  var self = this;
  var requestDfd = _.Deferred();
  var url = this.serveLocal ? this._buildLocalPath(path) : this._buildUrl(path);
  console.log(path, url);

  if (this.serveLocal) {
    var key = this._getLocalKey(path);
    fs.readFile(url, 'utf8', function (err, data) {
      if (err) {
        throw err;
      }
      var jsonData = JSON.parse(data);
      requestDfd.resolve( self.processFunc[path]( (jsonData[key] || jsonData['default']), self) );
    });
  }
  else {
    request(url, function (error, response, body) {
      requestDfd.resolve( self.processFunc[path](JSON.parse(body), self) );
    });
  }

  return requestDfd.promise();
};

function processGraphData (rawData, reference) {
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
      var weight = 0;
      _(edges).forEach(function (eg) {
        if (eg.from === vertex.id || eg.to === vertex.id) {
          weight = weight + eg.weight;
        }
      });
      return {
        name : vertex.name,
        sum : weight,
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
