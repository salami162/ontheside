define([
  'foosball/global',
  'vendor/backbone',
  'vendor/underscore',
  'vendor/handlebars'
], function (Global, Backbone, _, Handlebars) {

  var playerModel = Backbone.Model.extend({
    name : 'player',

    initialize : function (attrs, options) {
    },

    addScore : function () {
      var currentScore = this.get('score');
      if (!currentScore) {
        currentScore = 0;
      }
      currentScore += 1;
      this.set('score', currentScore);
    }
  });

  _([ 'win', 'tie', 'loss' ]).each(function (key) {
    playerModel.prototype[key] = function () {
      var val = this.get(key);
      val += 1;
      this.set(key, val);
    };
  });

  var playerView = Backbone.View.extend({
    tagName : 'li',
    className : 'foosball-player',
    initialize : function () {

    },

    render : function () {
      console.log('player');
    }
  });

  var gameModel = Backbone.Model.extend({
    name : 'game',

    initialize : function (attributes, options) {

    },

    getPlayer : function (name) {
      return _( this.get('players') ).find(function (py) {
        return py.get('name') === name;
      });
    },

    saveGame : function () {
      var players = this.get('players');
      var score1 = players[0].get('score');
      var score2 = players[1].get('score');
      
      Global.Model.saveScore({
        player1 : players[0].get('name'),
        score1 : players[0].get('score'),
        player2 : players[1].get('name'),
        score2 : players[1].get('score')
      });

      if (score1 > score2) {
        players[0].win();
        players[1].loss();
      }
      else if (score1 < score2) {
        players[1].win();
        players[0].loss();
      }
      else {
        players[0].tie();
        players[1].tie();
      }
      Global.Model.updateRankings(players);
    },

    start : function () {
      this.trigger('start');
    }
  });

  var gameView = Backbone.View.extend({
    tagName : 'div',
    className : 'foosball-game',
    events : {
      'click .btn-plus' : 'addScore',
      'click .btn-save' : 'saveGame'
    },

    initialize : function () {
      this.source = 
        '<li class="game-player player-{{name}}">'
        + '<div class="player-name">{{name}}</div>'
        + '<div class="player-score">{{score}}</div>'
        + '<div class="player-control">'
        + '  <button class="btn btn-mini btn-plus" type="button" data-player="{{name}}">+</button>'
        + '</div>'
        + '</li>';

      this.template = Handlebars.compile(this.source);
      this.model.on('start', this.render, this);
    },

    // Event handler for "+" button click
    addScore : function (e) {
      var name = $(e.target).attr('data-player');
      var player = this.model.getPlayer(name);
      if (player) {
        // Add "1" to the selected player
        player.addScore();
      }
    },

    render : function () {
      var self = this;
      var html = '';
      var playerMs = this.model.get('players');
      _(playerMs).each(function (playerM) {
        html += self.template( playerM.toJSON() );
        playerM.on('change:score', self.renderPlayer, self);
      });

      this.$el.find('ul').html(html);
      this.appendEndButton();
    },

    appendEndButton : function () {
      this.$endButton = $('<div class="save-game"></div>');
      $('<button>End Game</button>')
        .addClass('btn btn-primary btn-mini btn-save')
        .appendTo(this.$endButton);
      this.$el.append(this.$endButton);
    },

    removeEndButton : function () {
      this.$endButton.remove();
    },

    renderPlayer : function (playerM) {
      var playerName = playerM.get('name');
      var html = this.template( playerM.toJSON() );
      this.$el.find('.player-' + playerName).html(html)
    },

    saveGame : function () {
      this.model.saveGame();
      this.cleanup();
    },

    cleanup : function () {
      this.stopListening();
      this.undelegateEvents();
      this.removeEndButton();
      this.$el.find('ul').empty();
    }
  });

  return {
    Models : {
      Player : playerModel,
      Game : gameModel
    },
    Views : {
      Player : playerView,
      Game : gameView
    }
  };
});