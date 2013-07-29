requirejs.config({
    baseUrl: 'scripts/app',
    paths: {
      vendor: '../vendor'
    }
});


// define window
define('window', function () {
  return window;
});


require([
  'foosball/global',
  'foosball/foosball',
  'vendor/underscore',
  'vendor/bootstrap'
], function (
  Global,
  Foosball,
  _,
  $
) {
  console.log(rankings, scores);

  // build player model
  var rankedPlayers = Global.Model.get('players');
  if (!rankedPlayers) {
    rankedPlayers = [];
  }

  _(rankings).each(function (player) {
    var playerM = new Foosball.Models.Player({
      name : player.name,
      win : player.win,
      tie : player.tie,
      loss : player.loss
    });

    rankedPlayers.push(playerM);
  });

  Global.Model.set({
    scores: scores,
    players : rankedPlayers
  });


  // build player view

  $('#new-game .btn-close').on('click', function (e) {
    $('#new-game').modal('hide');
  });

  // save => create a new game
  $('#new-game .btn-save').on('click', function (e) {    
    // create players
    var players = [];
    $('#new-game input').each(function (index, input) {
      var name = $(input).val();
      var player = Global.Model.getPlayer(name);
      if (!player) {
        // create player model
        var player = new Foosball.Models.Player({
          name : name,
          score : 0,
          win : 0,
          tie : 0,
          loss : 0
        });
      }
      
      players.push(player);

      var playerV = new Foosball.Models.Player({
        model : player
      });
    });

    // build game model
    var gameM = new Foosball.Models.Game({
      players : players
    });

    var gameV = new Foosball.Views.Game({
      model : gameM,
      el : 'div.game'
    });

    gameM.start();
    // build game view
    $('#new-game').modal('hide');
  });

});
