window.onload = function() {
  var ZOOM = 5, SPACE = 32, LEFT = 37, RIGHT = 39;
  var canvas = document.getElementById("game-canvas");
  var keyboard = pix_field_lib.key_state_tracker();
  var game = pix_field.create_game(canvas.width / ZOOM, canvas.height / ZOOM);
  var step_with_keyboard = function(delta_time) {
    game.step(delta_time, keyboard.get(SPACE), keyboard.get(LEFT), keyboard.get(RIGHT));
  };
  pix_field_lib.do_canvas_game_loop(canvas, ZOOM, step_with_keyboard, game.draw);
};