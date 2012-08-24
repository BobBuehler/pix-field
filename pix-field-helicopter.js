if (!pix_field) { var pix_field = {}; }

// A helicopter graphic that animates and can draw itself.
// Dependent on pix-field-lib.js
pix_field.create_helicopter = function() {
  var colors = {
    body : "#888",
    glass : "#88f",
    blade : "#aaa",
    prop : "#444"
  };
  var constants = {
    body_pix : [
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
    prop_pix : [
      [0,-1,colors.prop],
      [0,1,colors.prop]
    ],
    blade_spin_idle : 1 * Math.PI, // radians / s
    blade_spin_thrust : 6 * Math.PI, // radians / s
    blade_radius : 6, // pixels
    prop_spin : 2 * Math.PI // radians / s
  };
  var state = {
    blade_pix : [
      [0,0,colors.blade],
      [0,0,colors.blade]
    ],
    blade_angle : 0, // radians
    prop_angle : 0 // radians
  };
  return {
    step : function(delta_time, is_thrusting) {
      state.blade_angle += delta_time * (is_thrusting ? constants.blade_spin_thrust : constants.blade_spin_idle);
      state.blade_angle = pix_field_lib.bound_angle(state.blade_angle);
      state.blade_pix[0][0] = Math.sin(state.blade_angle) * constants.blade_radius;
      state.blade_pix[1][0] = Math.sin(-state.blade_angle) * constants.blade_radius;
      state.prop_angle += constants.prop_spin * delta_time;
      state.prop_angle = pix_field_lib.bound_angle(state.prop_angle);
    },
    draw : function(context, x, y, angle) {
      context.save();
      context.translate(x, y);
      pix_field_lib.render_pix_array(context, constants.body_pix, angle);
      context.save();
      context.rotate(angle);
      context.translate(-8,0);
      context.rotate(-angle);
      pix_field_lib.render_pix_array(context, constants.prop_pix, state.prop_angle);
      context.restore();
      context.rotate(angle);
      context.translate(0,-2.9);
      context.rotate(-angle);
      pix_field_lib.render_pix_array(context, state.blade_pix, angle);
      context.restore();
    }
  };
};