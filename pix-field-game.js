var pix_field_loop = function() {
  var
    _canvas, _context,
    _zoom = 5, _world_width, _world_height,
    _keyboard_state, SPACE = 32, LEFT = 37, RIGHT = 39, DOWN = 40,
    _request_animation_frame,
    _last_time,
    _lifter, _helicopter, _hover_zone;
  return {
    init : function(canvas) {
      _canvas = canvas;
      _context = _canvas.getContext("2d");
      _world_width = _canvas.width / _zoom;
      _world_height = _canvas.height / _zoom;
      _keyboard_state = pix_field_lib.key_state_tracker(document, "onkeydown", "onkeyup");
      _request_animation_frame = pix_field_lib.animation_frame_requester();
      _last_time = new Date().getTime();
      _lifter = pix_field_lib.create_lifter(_world_width / 2, _world_height / 2);
      _helicopter = pix_field_lib.create_helicopter_pix();
      _hover_zone = pix_field_lib.create_hover_zone(_world_width / 3, _world_height / 3);
    },
    iterate : function() {
      var time = new Date().getTime();
      var delta_time = (time - _last_time) / 1000;
      _last_time = time;
      _lifter.step(delta_time, _keyboard_state.get(DOWN), _keyboard_state.get(SPACE), _keyboard_state.get(LEFT), _keyboard_state.get(RIGHT));
      _lifter.bound(0, 0, _world_width, _world_height);
      if (!(_keyboard_state.get(DOWN) && _lifter.get_frozen())) {
        _helicopter.step(delta_time, _lifter.get_thrust_percent());
      }
      if (_hover_zone.is_complete()) {
        _hover_zone = pix_field_lib.create_hover_zone(Math.random() * _world_width, Math.random() * _world_height);
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