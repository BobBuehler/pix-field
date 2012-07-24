var KeyBoard = function() {
  var _state = {};
  document.onkeydown = function(ev) {
    _state[ev.which] = true;
  };
  document.onkeyup = function(ev) {
    _state[ev.which] = false;
  };
  return {
    SPACE : 32,
    LEFT : 37,
    RIGHT : 39,
    get : function(key) {
      return _state[key];
    }
  };
}();

var Loop = function() {
  var
    _canvas,
    _context,
    _request_animation_frame,
    _zoom = 5,
    _last_time,
    _lifter,
    _helicopter,
    _hover_zone;
  return {
    init : function(canvas) {
      _canvas = canvas;
      _context = _canvas.getContext("2d");
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
      _lifter.step(delta_time, KeyBoard.get(KeyBoard.SPACE), KeyBoard.get(KeyBoard.LEFT), KeyBoard.get(KeyBoard.RIGHT));
      _lifter.bound(0, 0, _canvas.width / _zoom, _canvas.height / _zoom);
      _helicopter.step(delta_time, _lifter.get_thrust_percent());
      _hover_zone.step(delta_time, _hover_zone.contains(_lifter.get_x(), _lifter.get_y()));
      pix_field_lib.reset_context(_context, "black");
      _context.scale(_zoom, _zoom);
      _hover_zone.draw(_context);
      _helicopter.draw(_context, _lifter.get_x(), _lifter.get_y(), _lifter.get_angle());
      document.getElementById("fps").innerHTML = "fps: " + (1 / delta_time);
      _request_animation_frame(function() {
        Loop.iterate();
      });
    }
  };
}();

window.onload = function() {
  Loop.init(document.getElementById("canvas"));
  Loop.iterate();
};