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

var HoverZone = function() {
  var constants = {
    radius : 15, // pixels from center to edge
    progress_rate : 0.2, // percent per second
    decay_rate : 0.5, // percent per second
    radius_inner : 5, // pixels from center to edge
    color : "#050",
    color_inner : "#070"
  };
  var state = {
    x : 0,
    y : 0,
    progress : 0 // percent [0,1]
  };
  return {
    reset : function(x, y) {
      state.x = x;
      state.y = y;
      state.progress = 0;
    },
    contains : function(x, y) {
      return (x > state.x - constants.radius) &&
        (x < state.x + constants.radius) &&
        (y > state.y - constants.radius) &&
        (y < state.y + constants.radius);
    },
    step : function(delta_time, do_progress) {
      if (do_progress) {
        state.progress += delta_time * constants.progress_rate;
        if (state.progress > 1) {
          state.progress = 1;
        }
      } else {
        state.progress -= delta_time * constants.decay_rate;
        if (state.progress < 0) {
          state.progress = 0;
        }
      }
    },
    draw : function(context) {
      context.save();
      context.translate(state.x, state.y);
      context.fillStyle = constants.color;
      context.fillRect(-constants.radius, -constants.radius, constants.radius * 2, constants.radius * 2);
      var radius_inner = (constants.radius - constants.radius_inner) * state.progress + constants.radius_inner;
      context.fillStyle = constants.color_inner;
      context.fillRect(-radius_inner, -radius_inner, radius_inner * 2, radius_inner * 2);
      context.restore();
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
    _helicopter;
  return {
    init : function(canvas) {
      _canvas = canvas;
      _context = _canvas.getContext("2d");
      _request_animation_frame = pix_field_lib.animation_frame_requester();
      _last_time = new Date().getTime();
      _lifter = pix_field_lib.create_lifter(_canvas.width / 2 / _zoom, _canvas.height / 2 / _zoom);
      _helicopter = pix_field_lib.create_helicopter_pix();
      HoverZone.reset(_canvas.width / 3 / _zoom, _canvas.height / 3 / _zoom);
    },
    animate : function() {
      var time = new Date().getTime();
      var delta_time = (time - _last_time) / 1000;
      _last_time = time;
      _lifter.step(delta_time, KeyBoard.get(KeyBoard.SPACE), KeyBoard.get(KeyBoard.LEFT), KeyBoard.get(KeyBoard.RIGHT));
      _lifter.bound(0, 0, _canvas.width / _zoom, _canvas.height / _zoom);
      _helicopter.step(delta_time, _lifter.get_thrust_percent());
      HoverZone.step(delta_time, HoverZone.contains(_lifter.get_x(), _lifter.get_y()));
      pix_field_lib.reset_context(_context);
      _context.fillStyle = "black";
      _context.fillRect(0, 0, _canvas.width, _canvas.height);
      _context.scale(_zoom, _zoom);
      HoverZone.draw(_context);
      _helicopter.draw(_context, _lifter.get_x(), _lifter.get_y(), _lifter.get_angle());
      _request_animation_frame(function() {
        Loop.animate();
      });
    }
  };
}();

window.onload = function() {
  Loop.init(document.getElementById("canvas"));
  Loop.animate();
};