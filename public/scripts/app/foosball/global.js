define([
  'vendor/backbone',
  'vendor/underscore',
  'vendor/handlebars'
], function (Backbone, _, Handlebars) {

  var globalModel = Backbone.Model.extend({
    name : 'Foosball',
    getPlayer : function (name) {
      return _( this.get('players') ).find(function (py) {
        return py.get('name') === name;
      });
    },

    saveScore : function (score) {
      var scores = this.get('scores');
      if (!scores) {
        scores = [];
      }
      scores.push(score);
      this.set('scores', scores);
    },

    updateRankings : function (gamePlayers) {
      var self = this;
      var allPlayers = this.get('players');
      _(gamePlayers).each(function (py) {
        if ( !self.getPlayer( py.get('name') ) ) {
          allPlayers.push(py);
        }
      });
      allPlayers = _(allPlayers)
        .sortBy(function (r) {
          r.set('score', 0);
          return 0 - r.get('win');
        });
      this.set('players', allPlayers);
      this.trigger('updateRankings');
    }
  });

  var globalView = Backbone.View.extend({
    name : 'Foosball',
    el : 'div.ranking',
    initialize : function () {
      this.source = 
        '<li class="player-ranking player-{{name}}">'
        + '<div class="player-name">{{name}}</div>'
        + '<div class="player-win">{{win}}</div>'
        + '<div class="player-tie">{{tie}}</div>'
        + '<div class="player-loss">{{loss}}</div>'
        + '</li>';

      this.template = Handlebars.compile(this.source);
      this.model.on('updateRankings', this.render, this);
    },
    render : function () {
      var self = this;
      var html = '';
      var playerMs = this.model.get('players');
      _(playerMs).each(function (playerM) {
        html += self.template( playerM.toJSON() );
      });
      this.$el.find('ul').html(html);
    }
  });


  if ( !window.foosball ) {
    var fbModel = new globalModel();
    var fbView = new globalView({
      model : fbModel
    })
    window.foosball = {
      Model : fbModel,
      View : fbView
    };
  }

  return window.foosball;
});