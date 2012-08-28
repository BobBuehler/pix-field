if (!pix_field) { var pix_field = {}; }

// A square area that progresses while hovered over
pix_field.create_hover_square = function(x, y) {
  var constants = {
    square : pix_field.create_square(x, y, 15),
    delay : 3, // seconds to complete
    decay : 1, // seconds to lose all progress
    inner_radius : 0.3, // pixels
    outer_square_color : '#050',
    inner_square_color : '#070'
  };
  var calculated = {
    progress_rate : 1 / constants.delay,
    decay_rate : 1 / constants.decay
  };
  var state = {
    progress : 0 // percent
  };
  return {
    get_progress : function() { return state.progress; },
    // Update the progress dependent on if the hoverer is within
    step : function(delta_time, x, y) {
      if (constants.square.contains(x, y)) {
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
      context.save();
      context.translate(x, y);
      constants.square.draw_here(context, constants.outer_square_color);
      var scale = constants.inner_radius +  state.progress * (1 - constants.inner_radius);
      context.scale(scale, scale);
      constants.square.draw_here(context, constants.inner_square_color);
      context.restore();
    }
  };
};