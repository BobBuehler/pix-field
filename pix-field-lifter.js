if (!pix_field) { var pix_field = {}; }

// An entity that can spin and thrust.
// Dependent on pix-field-lib.js
pix_field.create_lifter = function(x, y) {
  var constants = {
    gravity : 60, // pixels / s / s
    thrust : 120, // pixels / s / s
    spin_max : 2 * Math.PI, // radians / s
    spin_delay : 0.2 //seconds
  };
  var state = {
    x : x, // pixels
    y : y, // pixels
    velocity : { x : 0, y : 0 }, // pixels / s
    angle : 0, // radians ccw of north
    spin : 0 // radians / s
  };
  var apply_spin_to_angle = function(delta_time, do_spin_left, do_spin_right) {
    if (do_spin_left && !do_spin_right) {
      state.spin = Math.min(state.spin, 0);
      state.spin -= constants.spin_max * (delta_time / constants.spin_delay);
      state.spin = Math.max(state.spin, -constants.spin_max);
    } else if (do_spin_right && !do_spin_left) {
      state.spin = Math.max(state.spin, 0);
      state.spin += constants.spin_max * (delta_time / constants.spin_delay);
      state.spin = Math.min(state.spin, constants.spin_max);
    } else {
      state.spin = 0;
      return;
    }
    state.angle += state.spin * delta_time;
    state.angle = pix_field_lib.bound_angle(state.angle);
  };
  var apply_thrust_to_velocity = function(delta_time, do_thrust) {
    if (do_thrust) {
      var thrust_angle = state.angle - Math.PIOverTwo;
      state.velocity.x += constants.thrust * Math.cos(thrust_angle) * delta_time;
      state.velocity.y += constants.thrust * Math.sin(thrust_angle) * delta_time;
    }
  };
  var apply_gravity_to_velocity = function(delta_time) {
      state.velocity.y += constants.gravity * delta_time;
  };
  var apply_velocity_to_xy = function(delta_time) {
    state.x += state.velocity.x * delta_time;
    state.y += state.velocity.y * delta_time;
  };
  return {
    get_x : function() { return state.x; },
    get_y : function() { return state.y; },
    get_angle : function() { return state.angle; },
    step : function(delta_time, do_thrust, do_spin_left, do_spin_right) {
      apply_spin_to_angle(delta_time, do_spin_left, do_spin_right);
      apply_thrust_to_velocity(delta_time, do_thrust);
      apply_gravity_to_velocity(delta_time);
      apply_velocity_to_xy(delta_time);
    },
    bound : function(min_x, min_y, max_x, max_y) {
      if (state.x < min_x) {
        state.x = min_x;
        state.velocity.x = 0;
      }
      if (state.y < min_y) {
        state.y = min_y;
        state.velocity.y = 0;
      }
      if (state.x > max_x) {
        state.x = max_x;
        state.velocity.x = 0;
      }
      if (state.y > max_y) {
        state.y = max_y;
        state.velocity.y = 0;
      }
    }
  };
};
