// A graphic that animates and can draw itself.
// Dependent on pix-field-lib.js

pix_field_lib.create_helicopter_pix = function() {

  var colors = {
    body : "#888",
    glass : "#88f",
    top_prop : "#aaa",
    rear_prop : "#444"
  };

  // Variables that are not changed during the lifetime of the helicopter
  var constants = {
    pix : [
      [-8,0,colors.body],
      [-6,0,colors.body],
      [-4,0,colors.body],
      [-2,-1.5,colors.body],
      [0,-1.9,"#88f"],
      [0,-2.9,colors.body],
      [2,-1.5,"#88f"],
      [3,0.5,"#88f"],
      [2,2.5,"#88f"],
      [0,2.5,colors.body]],
    pix_rear_prop : [
      [0,-1,"#444"],
      [0,1,"#444"]],
    blade_spin_min : 1 * Math.PI, // radians / s at no thrust
    blade_spin_thrust : 5 * Math.PI, // radians / s added at full thrust
    blade_radius : 6, // pixels
    prop_spin : 2 * Math.PI // radians / s
  };

  // Animation state of the two propellers
  var state = {
    blades : [[0,0,"#aaa"],[0,0,"#aaa"]],
    blade_angle : 0,
    prop_angle : 0
  };

  // Public interface
  return {
    step : function(delta_time, thrust_percent) {
      state.blade_angle += delta_time * (constants.blade_spin_min + thrust_percent * constants.blade_spin_thrust);
      state.blade_angle = pix_field_lib.bound_angle(state.blade_angle);
      state.blades[0][0] = Math.sin(state.blade_angle) * constants.blade_radius;
      state.blades[1][0] = Math.sin(-state.blade_angle) * constants.blade_radius;
      state.prop_angle += constants.prop_spin * delta_time;
      state.prop_angle = pix_field_lib.bound_angle(state.prop_angle);
    },
    draw : function(context, x, y, angle) {
      context.save();
      context.translate(x, y);
      pix_field_lib.render_pix_array(context, constants.pix, angle);
      context.save();
      context.rotate(angle);
      context.translate(-8,0);
      context.rotate(-angle);
      pix_field_lib.render_pix_array(context, constants.pix_rear_prop, state.prop_angle);
      context.restore();
      context.rotate(angle);
      context.translate(0,-2.9);
      context.rotate(-angle);
      pix_field_lib.render_pix_array(context, state.blades, angle);
      context.restore();
    }
  };
};