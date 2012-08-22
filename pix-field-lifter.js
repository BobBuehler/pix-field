// returns a stateful lifter
pix_field_lib.create_lifter = function(x, y) {

  // Variables that are not changed during the lifetime of the lifter
  var constants = {
    size : 2, // pixels
    gravity : 60, // pixels / s / s
    thrust_max : 120, // pixels / s / s
    spin_max : 2 * Math.PI, // radians / s
    spin_delay : 0.2 //seconds
  };

  // Variables that change during step function
  var state = {
    x : x,
    y : y,
    velocity : { x : 0, y : 0 },
    thrust : 0,
    angle : 0,
    spin : 0
  };

  // Updates state.spin
  var _calculate_spin = function(delta_time, do_spin_left, do_spin_right) {
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
    }
  };

  // Updates state.angle based on state.spin
  var _apply_spin_to_angle = function(delta_time) {
    state.angle += state.spin * delta_time;
    state.angle = pix_field_lib.bound_angle(state.angle);
  };

  // Updates state.thrust
  var _calculate_thrust = function(do_thrust) {
    if(do_thrust) {
      state.thrust = constants.thrust_max;
    } else {
      state.thrust = 0;
    }
  };

  // Updates state.velocity based on state.thrust
  var _apply_thrust_to_velocity = function(delta_time) {
    var thrust_angle = state.angle - Math.PIOverTwo;
    state.velocity.x += state.thrust * Math.cos(thrust_angle) * delta_time;
    state.velocity.y += state.thrust * Math.sin(thrust_angle) * delta_time;
  };

  // Updates state.velocity based on constants.gravity
  var _apply_gravity_to_velocity = function(delta_time) {
      state.velocity.y += constants.gravity * delta_time;
  };

  // Updates state.x and state.y based on state.velocity
  var _apply_velocity_to_xy = function(delta_time) {
    state.x += state.velocity.x * delta_time;
    state.y += state.velocity.y * delta_time;
  };

  // Public interface
  return {
    get_x : function() { return state.x; },
    get_y : function() { return state.y; },
    get_angle : function() { return state.angle; },
    get_thrust_percent : function() { return state.thrust / constants.thrust_max; },
    step : function(delta_time, do_thrust, do_spin_left, do_spin_right) {
      _calculate_spin(delta_time, do_spin_left, do_spin_right);
      _apply_spin_to_angle(delta_time);
      _calculate_thrust(do_thrust);
      _apply_thrust_to_velocity(delta_time);
      _apply_gravity_to_velocity(delta_time);
      _apply_velocity_to_xy(delta_time);
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
