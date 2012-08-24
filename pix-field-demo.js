var pix_field_demo = function() {
  var ZOOM = 5, SPACE = 32, LEFT = 37, RIGHT = 39;
  var canvas, context, keyboard, request_frame;
  return {
    init : function() {
      canvas = document.getElementById("game-canvas");
      context = canvas.getContext("2d");
      keyboard = {};
      document.onkeydown = function(ev) {
        keyboard[ev.which] = true;
      };
      document.onkeyup = function(ev) {
        keyboard[ev.which] = false;
      };
      request_frame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    },
    begin : function() {
      var game = pix_field.create_game(canvas.width / ZOOM, canvas.height / ZOOM);
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
        context.fillStyle = "black";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.scale(ZOOM, ZOOM);
        game.draw(context);
      })();
    }
  };
}();

window.onload = function() {
  pix_field_demo.init();
  pix_field_demo.begin();
};