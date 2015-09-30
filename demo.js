window.onload = function() {
  var ZOOM = 5, PADDING = 30, ENTER = 13, SPACE = 32, LEFT = 37, UP = 38, RIGHT = 39;

  // identifiy the elements
  var canvas = document.getElementById('game-canvas');
  var context = canvas.getContext('2d');
  var scoreboard = document.getElementById('scoreboard');
  var do_wind = document.getElementById('do_wind');
  var do_move_squares = document.getElementById('do_move_squares');
  var do_regen = document.getElementById('do_regen');
  var do_starburst = document.getElementById('do_starburst');
  
  // setup keyboard hooks
  var keyboard = {};
  var preventDefault = [ENTER, SPACE, LEFT, UP, RIGHT].reduce(function(c, key) {c[key] = true; return c;}, {});
  document.onkeydown = function(ev) {
    keyboard[ev.which] = true;
    if (preventDefault[ev.which]) ev.preventDefault();
  };
  document.onkeyup = function(ev) {
    keyboard[ev.which] = false;
    if (preventDefault[ev.which]) ev.preventDefault();
  };
  
  // resolve animation frame callback
  var request_frame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };

  // launch the game
  var game = pix_field.create_game((canvas.width - PADDING * 2) / ZOOM, (canvas.height - PADDING * 2) / ZOOM);
  var last_time = new Date().getTime();
  (function iterate() {
    request_frame(function() {
      iterate();
    });
    var time = new Date().getTime();
    var delta_time = (time - last_time) / 1000;
    last_time = time;
    game.step(delta_time, keyboard[ENTER] || keyboard[SPACE] || keyboard[UP], keyboard[LEFT], keyboard[RIGHT], do_wind.checked, do_move_squares.checked, do_regen.checked, do_starburst.checked);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = '#222';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.translate(PADDING, PADDING);
    context.scale(ZOOM, ZOOM);
    context.fillStyle = 'black';
    context.fillRect(0, 0, game.boundary.width, game.boundary.height);
    game.draw(context);
    scoreboard.innerHTML = game.scoreboard.text;
  })();
};