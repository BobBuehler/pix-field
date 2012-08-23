if (!pix_field) { var pix_field = {}; }

pix_field.create_hover_square = function(x, y) {
  var constants = {
    x : x,
    y : y,
    radius : 15,
    delay : 3,
    decay : 1
  };
  var calculated = {
    left : constants.x - constants.radius,
    right : constants.x + constants.radius,
    top : constants.y - constants.radius,
    bottom : constants.y + constants.radius,
    progress_rate : 1 / constants.delay,
    decay_rate : 1 / constants.decay
  };
  var state = {
    progress : 0
  };
  var contains = function(x, y) {
    return x > calculated.left && x < calculated.right && y > calculated.top && y < calculated.bottom;
  };
  return {
    get_x : function() { return constants.x; },
    get_y : function() { return constants.y; },
    get_radius : function() { return constants.radius; },
    get_progress : function() { return state.progress; },
    step : function(delta_time, x, y) {
      if (contains(x, y)) {
        state.progress += delta_time * calculated.progress_rate;
        if (state.progress > 1) {
          state.progress = 1;
        }
      } else {
        state.progress -= delta_time * calculated.decay_rate;
        if (state.progress < 0) {
          state.progress = 0;
        }
      }
    }
  };
};