window.onload = function() {
  var ZOOM = 5, PADDING = 20, SPACE = 32, LEFT = 37, RIGHT = 39;

  // capture the canvas, keyboard, and animation frame requester
  var canvas = document.getElementById('game-canvas');
  var context = canvas.getContext('2d');
  var keyboard = {};
  document.onkeydown = function(ev) {
    keyboard[ev.which] = true;
  };
  document.onkeyup = function(ev) {
    keyboard[ev.which] = false;
  };
  var request_frame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  var game = pix_field.create_game((canvas.width - PADDING * 2) / ZOOM, (canvas.height - PADDING * 2) / ZOOM);
  var last_time = new Date().getTime();
  (function iterate() {
    request_frame(function() {
      iterate();
    });
    var time = new Date().getTime();
    var delta_time = (time - last_time) / 1000;
    last_time = time;
    game.step(delta_time, keyboard[SPACE], keyboard[LEFT], keyboard[RIGHT]);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = 'black';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.translate(PADDING, PADDING);
    context.scale(ZOOM, ZOOM);
    game.draw(context);
  })();
};