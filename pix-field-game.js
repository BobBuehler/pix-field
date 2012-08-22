// An animation and game loop that maintains the game model and renders to a context
// Dependent on pix-field-lib.js, pix-field-lifter.js, pix-field-helicopter.js, and pix-field-hover-zone.js

var KEYS = {space:32, left:37, right:39};
var ZOOM = 5;

var pix_field_game = function(width, height) {
  var _lifter = pix_field_lib.create_lifter(width / 2, height / 2),
      _helicopter = pix_field_lib.create_helicopter_pix(),
      _hover_zone = pix_field_lib.create_hover_zone(width / 3, height / 3);
  return {
    step : function(delta_time, keyboard) {
      _lifter.step(delta_time, keyboard.get(KEYS.space), keyboard.get(KEYS.left), keyboard.get(KEYS.right));
      _lifter.bound(0, 0, width, height);
      _helicopter.step(delta_time, _lifter.get_thrust_percent());
      _hover_zone.step(delta_time, _hover_zone.contains(_lifter.get_x(), _lifter.get_y()));
      if (_hover_zone.is_complete()) {
        _hover_zone = pix_field_lib.create_hover_zone(Math.random() * width, Math.random() * height);
      }
    },
    draw : function(context) {
      _hover_zone.draw(context);
      _helicopter.draw(context, _lifter.get_x(), _lifter.get_y(), _lifter.get_angle());
    }
  };
};

window.onload = function() {
  var canvas = document.getElementById("canvas");
  canvas.width = 1000;
  canvas.height = 800;
  var context = canvas.getContext("2d"),
      keyboard = pix_field_lib.key_state_tracker(),
      next_frame = pix_field_lib.animation_frame_requester(),
      game = pix_field_game(canvas.width / ZOOM, canvas.height / ZOOM),
      last_time = new Date().getTime();
  (function iterate() {
    next_frame(function() {
      iterate();
    });
    var time = new Date().getTime();
    var delta_time = (time - last_time) / 1000;
    game.step(delta_time, keyboard);
    last_time = time;
    pix_field_lib.reset_context(context, "black");
    context.scale(ZOOM, ZOOM);
    game.draw(context);
  })();
};