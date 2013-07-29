var 
    util = require('util')
  , _ = require('underscore')
  , fs = require('fs')
  , couchdb = require('felix-couchdb')
  , client = couchdb.createClient(5984, 'localhost')
  , db = client.db('foosball');

_.mixin( require('underscore.deferred') );

var gamesView = {
  games : {
    map : function (doc) {
      if (doc && doc.data && doc.type === 'game') {
        emit(doc.date, doc.player1);
        // emit(doc.date, doc.player2);
      }
    }
  }
};

db.getDoc('_design/games', function (err, doc) {
  db.saveDoc('_design/games', {
    views : _.extend(doc && doc.views ? doc.views : {}, gamesView),
    _rev : doc ? doc._rev : undefined
  });
});

function Foosball () {
  this.serveLocal = true; // set to true to read json file locally.
  this.scores = {};
  this.players = {};
  this.rankings = [];
}

Foosball.prototype.toJSON = function () {
  return {
    scores : this.scores,
    rankings : this.rankings
  };
}

Foosball.prototype.initialize = function () {
  var dfd = _.Deferred();
  if (this.serveLocal) {
    this._initFromFile(dfd);
  }
  else {
    this._initFromCouch(dfd);
  }
  return dfd.promise();
}

Foosball.prototype._initFromFile = function (dfd) {
  var self = this;
  fs.readFile(__dirname + '/../data/foosball.json', 'utf8', function (err, data) {
    if (err) {
      dfd.reject({ error : err });
      return;
    }
    var jsonData = JSON.parse(data);
    self.scores = jsonData.scores;
    self._processScores();
    self._updateRankings();
    dfd.resolve( self.toJSON() );
  });
}

Foosball.prototype._initFromCouch = function (dfd) {
  db.getDoc('_design/games/_view/games', function (err, doc) {
    console.log(err, doc);
    if (err) {
      dfd.reject({ error : err });
      return;
    }
    dfd.resolve(data);
  });
}

Foosball.prototype._initPlayer = function (player) {
  if (this.players[player]) return;
  this.players[player] = {
    win : 0,
    tie : 0,
    loss : 0,
    name : player
  };
}

Foosball.prototype._processScores = function () {
  var self = this;
  _(this.scores).each(function (score) {
    self._initPlayer(score.player1);
    self._initPlayer(score.player2);
    if (score.score1 > score.score2) {
      self.players[score.player1].win += 1;
      self.players[score.player2].loss += 1;
    }
    else if (score.score1 < score.score2) {
      self.players[score.player2].win += 1;
      self.players[score.player1].loss += 1;
    }
    else {
      self.players[score.player1].tie += 1;
      self.players[score.player2].tie += 1;
    }
  });
}

Foosball.prototype._updateRankings = function () {
  this.rankings = _(this.players)
    .sortBy(function (r) {
      return 0 - r.win;
    });
  console.log(this.rankings);
}

module.exports = function () {
  return new Foosball();
};
