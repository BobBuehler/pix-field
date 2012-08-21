pix_field_lib.create_hover_zone = function(x, y) {
  var constants = {
    x : x,
    y : y,
    radius : 15, // pixels from center to edge
    radius_inner : 5, // pixels from center to edge
    color : "#050",
    color_inner : "#070",
    progress_rate : 0.2, // percent per second
    decay_rate : 0.5 // percent per second
  };

  var calculated = {
    left : constants.x - constants.radius,
    top : constants.y - constants.radius,
    diameter : constants.radius * 2
  };

  var state = {
    progress : 0 // percent [0,1]
  };

  // public interface
  return {
    is_complete : function() {
      return state.progress === 1;
    },
    contains : function(x, y) {
      return (x > constants.x - constants.radius) &&
        (x < constants.x + constants.radius) &&
        (y > constants.y - constants.radius) &&
        (y < constants.y + constants.radius);
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
      context.fillStyle = constants.color;
      context.fillRect(calculated.left, calculated.top, calculated.diameter, calculated.diameter);
      var radius_inner = (constants.radius - constants.radius_inner) * state.progress + constants.radius_inner;
      var diameter_inner = radius_inner * 2;
      var left_inner = constants.x - radius_inner;
      var top_inner = constants.y - radius_inner;
      context.fillStyle = constants.color_inner;
      context.fillRect(left_inner, top_inner, diameter_inner, diameter_inner);
    }
  };
};