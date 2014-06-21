var 
    util = require('util')
  , _ = require('underscore')
  , fs = require('fs')
  , couchdb = require('felix-couchdb')
  , client = couchdb.createClient(5984, 'localhost')
  , db = client.db('foosball');

_.mixin( require('underscore.deferred') );

var gamesView = {
  listGames : {
    map : function (doc) {
      if (doc && doc.type === 'game') {
       emit(doc._id, {
        player1 : doc.player1,
        score1 : doc.score1,
        player2 : doc.player2,
        score2 : doc.score2
       });
      }
    }
  },
  listWins : {
    map : function (doc) {
      if (doc && doc.type === 'game') {
        var winner;
        if (doc.score1 > doc.score2) winner = doc.player1;
        else if (doc.score1 < doc.score2) winner = doc.player2;
        emit(winner, 1);
      }
    },
    reduce : function (keys, values) {
      return sum(values);
    }
  },
  listTies : {
    map : function (doc) {
      if (doc && doc.type === 'game') {
        if (doc.score1 == doc.score2) {
          emit(doc.player1, 1);
          emit(doc.player2, 1);
        }
      }
    },
    reduce : function (keys, values) {
      return sum(values);
    }
  },
  listLosses : {
    map : function (doc) {
      if (doc && doc.type === 'game') {
        var loser;
        if (doc.score1 < doc.score2) loser = doc.player1;
        else if (doc.score1 > doc.score2) loser = doc.player2;
        emit(loser, 1);
      }
    },
    reduce : function (keys, values) {
      return sum(values);
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
  this._reset();
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

Foosball.prototype._reset = function () {
  this.scores = {};
  this.players = {};
  this.rankings = [];
}

Foosball.prototype._initFromFile = function (dfd) {
  var self = this;
  this._reset();
  fs.readFile(__dirname + '/../data/foosball.json', 'utf8', function (err, data) {
    if (err) {
      dfd.reject({ error : err });
      return;
    }
    var jsonData = JSON.parse(data);
    self.scores = jsonData.scores;
    self._processScores();
    self._updateRankings();
    dfd && dfd.resolve( self.toJSON() );
  });
}

Foosball.prototype._initFromCouch = function (dfd) {
  var self = this;
  this._reset();
  db.view('games', 'listGames', function (err, docs) {
    if (err) {
      dfd.reject({ error : err });
      return;
    }
    self.scores = _(docs.rows).pluck('value');
    self._processScores();
    self._updateRankings();
    dfd && dfd.resolve( self.toJSON() );
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

Foosball.prototype.saveScore = function (newScore) {
  if (!this.serveLocal) {
    this._saveToCouch(newScore);
  }
}

Foosball.prototype._saveToCouch = function(newScore) {
  var newDoc = _.extend({}, newScore, { type : 'game' });
  db.saveDoc(newDoc);
}

module.exports = function () {
  return new Foosball();
};
