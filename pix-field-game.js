var pix_field_loop = function() {
  var
    _canvas,
    _context,
    _zoom = 5,
    _keyboard_state, SPACE = 32, LEFT = 37, RIGHT = 39, DOWN = 40,
    _request_animation_frame,
    _last_time,
    _lifter, _helicopter, _hover_zone;
  return {
    init : function(canvas) {
      _canvas = canvas;
      _context = _canvas.getContext("2d");
      _keyboard_state = pix_field_lib.key_state_tracker(document, "onkeydown", "onkeyup");
      _request_animation_frame = pix_field_lib.animation_frame_requester();
      _last_time = new Date().getTime();
      _lifter = pix_field_lib.create_lifter(_canvas.width / 2 / _zoom, _canvas.height / 2 / _zoom);
      _helicopter = pix_field_lib.create_helicopter_pix();
      _hover_zone = pix_field_lib.create_hover_zone(_canvas.width / 3 / _zoom, _canvas.height / 3 / _zoom);
    },
    iterate : function() {
      var time = new Date().getTime();
      var delta_time = (time - _last_time) / 1000;
      _last_time = time;
      _lifter.step(delta_time, _keyboard_state.get(DOWN), _keyboard_state.get(SPACE), _keyboard_state.get(LEFT), _keyboard_state.get(RIGHT));
      _lifter.bound(0, 0, _canvas.width / _zoom, _canvas.height / _zoom);
      if (!(_keyboard_state.get(DOWN) && _lifter.get_frozen())) {
        _helicopter.step(delta_time, _lifter.get_thrust_percent());
      }
      if (_hover_zone.is_complete()) {
        _hover_zone = pix_field_lib.create_hover_zone(Math.random() * _canvas.width / _zoom, Math.random() * _canvas.height / _zoom);
      }
      _hover_zone.step(delta_time, _hover_zone.contains(_lifter.get_x(), _lifter.get_y()));
      pix_field_lib.reset_context(_context, "black");
      _context.scale(_zoom, _zoom);
      _hover_zone.draw(_context);
      _helicopter.draw(_context, _lifter.get_x(), _lifter.get_y(), _lifter.get_angle());
      _request_animation_frame(function() {
        pix_field_loop.iterate();
      });
    }
  };
}();

window.onload = function() {
  pix_field_loop.init(document.getElementById("canvas"));
  pix_field_loop.iterate();
};