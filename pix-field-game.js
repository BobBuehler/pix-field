var KEYS = {space:32, left:37, right:39, down:40};
var ZOOM = 5;

var pix_field_game = function(width, height) {
  var _width = width,
      _height = height,
      _lifter = pix_field_lib.create_lifter(_width / 2, _height / 2),
      _helicopter = pix_field_lib.create_helicopter_pix(),
      _hover_zone = pix_field_lib.create_hover_zone(_width / 3, _height / 3);
  return {
    step : function(delta_time, keyboard) {
      _lifter.step(delta_time, keyboard.get(KEYS.down), keyboard.get(KEYS.space), keyboard.get(KEYS.left), keyboard.get(KEYS.right));
      _lifter.bound(0, 0, _width, _height);
      if (!(keyboard.get(KEYS.down) && _lifter.get_frozen())) {
        _helicopter.step(delta_time, _lifter.get_thrust_percent());
      }
      if (_hover_zone.is_complete()) {
        _hover_zone = pix_field_lib.create_hover_zone(Math.random() * _width, Math.random() * _height);
      }
      _hover_zone.step(delta_time, _hover_zone.contains(_lifter.get_x(), _lifter.get_y()));
    },
    draw : function(context) {
      _hover_zone.draw(context);
      _helicopter.draw(context, _lifter.get_x(), _lifter.get_y(), _lifter.get_angle());
    }
  };
};

window.onload = function() {
  var canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d"),
      keyboard = pix_field_lib.key_state_tracker(),
      request_animation_frame = pix_field_lib.animation_frame_requester(),
      game = pix_field_game(canvas.width / ZOOM, canvas.height / ZOOM),
      last_time = new Date().getTime();
  function iterate() {
    var time = new Date().getTime();
    var delta_time = (time - last_time) / 1000;
    last_time = time;
    game.step(delta_time, keyboard);
    pix_field_lib.reset_context(context, "black");
    context.scale(ZOOM, ZOOM);
    game.draw(context);
    request_animation_frame(function() {
      iterate();
    });
  }
  iterate();
};