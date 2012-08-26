if (!pix_field) { var pix_field = {}; }

// A square area that progresses while hovered over
pix_field.create_hover_square = function(x, y) {
  var constants = {
    x : x,
    y : y,
    radius : 15,
    delay : 3,
    decay : 1,
    min_inner_radius : 5, // percent of outer radius
    outer_square_color : '#050',
    inner_square_color : '#070'
  };
  var calculated = {
    left : constants.x - constants.radius,
    right : constants.x + constants.radius,
    top : constants.y - constants.radius,
    bottom : constants.y + constants.radius,
    diameter : constants.radius * 2,
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
    // Update the progress dependent on if the hoverer is within
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
    },
    draw : function(context) {
      context.fillStyle = constants.outer_square_color;
      context.fillRect(calculated.left, calculated.top, calculated.diameter, calculated.diameter);
      var inner_radius = pix_field_lib.percent_between(constants.min_inner_radius, constants.radius, state.progress);
      var inner_diameter = inner_radius * 2;
      context.fillStyle = constants.inner_square_color;
      context.fillRect(constants.x - inner_radius, constants.y - inner_radius, inner_diameter, inner_diameter);
    }
  };
};