// returns a stateful lifter
pix_field_lib.create_lifter = function(x, y) {

  // Variables that are not changed during the lifetime of the lifter
  var constants = {
    size : 2, // pixels
    gravity : 60, // pixels / s / s
    thrust_max : 120, // pixels / s / s
    thrust_air_brake : 120, // pixels / s / s
    spin_max : 2 * Math.PI, // radians / s
    spin_delay : 0.2, //seconds
    spin_air_brake : 2 * Math.PI, // radians / s
    min_velocity_threshold : 10
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

  var _apply_min_velocity_threshold = function() {
    if (Math.abs(state.velocity.x) < constants.min_velocity_threshold &&
      Math.abs(state.velocity.y) < constants.min_velocity_threshold) {
        state.velocity.x = 0;
        state.velocity.y = 0;
      }
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

  var _apply_air_brakes = function(delta_time) {
    if (state.velocity.x === 0 && state.velocity.y === 0) {
      state.spin = 0;
      state.thrust = 0;
      return;
    }
    // spin at spin_air_brake in the direction opposite of velocity
    var thrust_angle = state.angle - Math.PIOverTwo;
    var velocity_angle = Math.atan2(state.velocity.y, state.velocity.x);
    var target_thrust_angle = velocity_angle + Math.PI;
    var diff_angle = pix_field_lib.bound_angle(thrust_angle - target_thrust_angle);
    if (diff_angle === 0) {
      state.spin = 0;
    } else if (diff_angle < 0) {
      state.spin = constants.spin_air_brake;
    } else {
      state.spin = -constants.spin_air_brake;
    }
    var delta_angle = state.spin * delta_time;
    if (Math.abs(delta_angle) < Math.abs(diff_angle)) {
      state.angle += delta_angle;
    } else {
      state.angle = target_thrust_angle + Math.PIOverTwo;
    }
    // apply thrust between 0 and thrust_air_brake*delta_time that minimizes the magnitude of velocity
    thrust_angle = state.angle - Math.PIOverTwo;
    var max_delta_velocity_x = constants.thrust_air_brake * Math.cos(thrust_angle) * delta_time;
    var max_delta_velocity_y = constants.thrust_air_brake * Math.sin(thrust_angle) * delta_time;
    var desired_velocity_x = -state.velocity.x;
    var desired_velocity_y = -state.velocity.y;
    var t =
        ((desired_velocity_x * max_delta_velocity_x) + (desired_velocity_y * max_delta_velocity_y)) /
        (Math.square(max_delta_velocity_x) + Math.square(max_delta_velocity_y));
    if (t < 0) {
      t = 0;
    } else if (t > 1) {
      t = 1;
    }
    state.thrust = t * constants.thrust_air_brake;
    state.velocity.x += max_delta_velocity_x * t;
    state.velocity.y += max_delta_velocity_y * t;
  };

  // Public interface
  return {
    get_x : function() { return state.x; },
    get_y : function() { return state.y; },
    get_angle : function() { return state.angle; },
    get_thrust_percent : function() { return state.thrust / constants.thrust_max; },
    get_frozen : function() { return state.spin === 0 && state.thrust === 0; },
    step : function(delta_time, do_air_brake, do_thrust, do_spin_left, do_spin_right) {
      if (do_air_brake) {
        _apply_min_velocity_threshold();
        _apply_air_brakes(delta_time);
      } else {
        _calculate_spin(delta_time, do_spin_left, do_spin_right);
        _apply_spin_to_angle(delta_time);
        _calculate_thrust(do_thrust);
        _apply_thrust_to_velocity(delta_time);
        _apply_gravity_to_velocity(delta_time);
      }
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
