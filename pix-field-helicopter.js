if (!pix_field) { var pix_field = {}; }

// An animated helicopter that can spin and thrust
pix_field.create_helicopter = function(x, y) {
  var constants = {
    gravity : 60, // pixels / s / s
    thrust : 120, // pixels / s / s
    spin_max : 2 * Math.PI, // radians / s
    spin_delay : 0.2, //seconds
    blade_spin_idle : 1 * Math.PI, // radians / s
    blade_spin_thrust : 6 * Math.PI, // radians / s
    blade_radius : 6, // pixels
    prop_spin : 2 * Math.PI // radians / s
  };
  var colors = {
    body : '#888',
    glass : '#88f',
    blade : '#aaa',
    prop : '#444'
  };
  var pix = {
    body : [
      [-8,0,colors.body],
      [-6,0,colors.body],
      [-4,0,colors.body],
      [-2,-1.5,colors.body],
      [0,-1.9,colors.glass],
      [0,-2.9,colors.body],
      [2,-1.5,colors.glass],
      [3,0.5,colors.glass],
      [2,2.5,colors.glass],
      [0,2.5,colors.body]
    ],
    blades : [
      [0,0,colors.blade],
      [0,0,colors.blade]
    ],
    prop : [
      [0,-1,colors.prop],
      [0,1,colors.prop]
    ]
  };
  var state = {
    x : x, // pixels
    y : y, // pixels
    velocity : { x : 0, y : 0 }, // pixels / s
    angle : 0, // radians cw of east
    spin : 0, // radians / s
    blade_angle : 0, // radians
    prop_angle : 0 // radians
  };
  var apply_spin = function(delta_time, do_spin_left, do_spin_right) {
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
    state.angle = pix_field.lib.bound_angle(state.angle);
  };
  var apply_thrust_and_gravity = function(delta_time, do_thrust) {
    if (do_thrust) {
      var thrust_angle = state.angle - Math.PIOverTwo;
      state.velocity.x += constants.thrust * Math.cos(thrust_angle) * delta_time;
      state.velocity.y += constants.thrust * Math.sin(thrust_angle) * delta_time;
    }
    state.velocity.y += constants.gravity * delta_time;
    state.x += state.velocity.x * delta_time;
    state.y += state.velocity.y * delta_time;
  };
  var animate = function(delta_time, is_thrusting) {
      state.blade_angle += delta_time * (is_thrusting ? constants.blade_spin_thrust : constants.blade_spin_idle);
      state.blade_angle = pix_field.lib.bound_angle(state.blade_angle);
      pix.blades[0][0] = Math.sin(state.blade_angle) * constants.blade_radius;
      pix.blades[1][0] = Math.sin(-state.blade_angle) * constants.blade_radius;
      state.prop_angle += constants.prop_spin * delta_time;
      state.prop_angle = pix_field.lib.bound_angle(state.prop_angle);
  };
  return {
    get_x : function() { return state.x; },
    get_y : function() { return state.y; },
    get_angle : function() { return state.angle; },
    // Move the helicopter and animate its propellers
    step_fly : function(delta_time, do_thrust, do_spin_left, do_spin_right) {
      apply_spin(delta_time, do_spin_left, do_spin_right);
      apply_thrust_and_gravity(delta_time, do_thrust);
    },
    step_animation : function(delta_time, do_thrust) {
      animate(delta_time, do_thrust);
    },
    // Draw the helicopter to the context
    draw : function(context) {
      context.save();
      context.translate(state.x, state.y);
      pix_field.lib.render_pix_array(context, pix.body, state.angle);
      context.save();
      context.rotate(state.angle);
      context.translate(-8,0);
      context.rotate(-state.angle);
      pix_field.lib.render_pix_array(context, pix.prop, state.prop_angle);
      context.restore();
      context.rotate(state.angle);
      context.translate(0,-2.9);
      context.rotate(-state.angle);
      pix_field.lib.render_pix_array(context, pix.blades, state.angle);
      context.restore();
    },
    // Keep the helicopter within a boundary
    bound : function(bounding_rectangle) {
      if (state.x < bounding_rectangle[0]) {
        state.x = bounding_rectangle[0];
        state.velocity.x = 0;
      }
      if (state.y < bounding_rectangle[1]) {
        state.y = bounding_rectangle[1];
        state.velocity.y = 0;
      }
      if (state.x > bounding_rectangle[2]) {
        state.x = bounding_rectangle[2];
        state.velocity.x = 0;
      }
      if (state.y > bounding_rectangle[3]) {
        state.y = bounding_rectangle[3];
        state.velocity.y = 0;
      }
    }
  };
};