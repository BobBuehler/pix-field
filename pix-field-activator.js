pix_field_lib.create_activator = function(delay, decay, callback) {
  var constants = {
    progress_rate : 1 / delay,
    decay_rate : 1 / decay
  };
  var state = {
    progress : 0
  };
  return {
    get_progress : function() {
      return state.progress;
    },
    reset : function() {
      state.progress = 0;
    },
    step : function(delta_time, do_progress) {
      if (state.progress === 1) {
        return;
      } else if (do_progress) {
        state.progress += delta_time * constants.progress_rate;
        if (state.progress > 1) {
          state.progress = 1;
          callback(this);
        }
      } else {
        state.progress -= delta_time * constants.decay_rate;
        if (state.progress < 0) {
          state.progress = 0;
        }
      }
    }
  };
};