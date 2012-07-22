var pix_field_lib = function() {
  return {
    // Grab json, parse, and call me back. No callback on error.
    read_json : function(path, callback) {
      var first = true; // only invoke callback on first response
      var READY = 4;
      var txtFile = new XMLHttpRequest();
      txtFile.open("GET", path, true);
      txtFile.onreadystatechange = function() {
        if (first && txtFile.readyState == READY) {
          first = false;
          callback(JSON.parse(txtFile.responseText));
        }
      };
      txtFile.send(null);
    },

    // Returns a function(callback) for chaining animation frames.
    animation_frame_requester : function() {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    },

    bound_angle : function(angle) {
      while (angle < 0) {
        angle += Math.TwoPI;
      }
      while (angle > Math.TwoPI) {
        angle -= Math.TwoPI;
      }
      return angle;
    },

    // Resets a context to the standard transform and clears it.
    reset_context : function(context) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    },

    // parses a comma separated list of arrays
    parse_pix_array : function(pix_text) {
      return JSON.parse('{"pix":[' + pix_text + ']}').pix;
    },

    // returns repeating [x,y,"color"],
    stringify_pix_array : function(pix) {
      var buf = [];
      pix.forEach(function(p) {
        buf[buf.length] = '[' + p[0] + ',' + p[1] + ',"' + p[2] + '"]';
      });
      return buf.join(',\n');
    },

    // Draws a pix field at the current position of the context, rotated.
    render_pix_array : function(context, pix, angle) {
      context.rotate(angle);
      pix.forEach(function(p) {
        context.save();
        context.translate(p[0], p[1]);
        context.rotate(-angle);
        context.fillStyle = p[2];
        context.fillRect(-0.5, -0.5, 1, 1);
        context.restore();
      });
      context.rotate(-angle);
    },

    // returns a stateful lifter
    create_lifter : function(x, y, constants_override) {
      // variables that are not changed during step function
      var constants = {
        size : 2, // pixels
        gravity : 1, // pixels / s
        thrust_max : 2, // pixels / s
        thrust_delay : 0, // seconds
        spin_max : 2 * Math.PI, // radians / s
        spin_delay : 0.2, //seconds
        drag : 0.01 // pixels / s
      };
      // extend constants with override
      if (constants_override) {
        for (var prop in constants_override) {
          constants[prop] = constants_override[prop];
        }
      }
      // variables that can change during step function
      var state = {
        x : x,
        y : y,
        velocity : { x : 0, y : 0 },
        thrust : 0,
        angle : 0,
        spin : 0
      };
      return {
        get_x : function() { return state.x; },
        get_y : function() { return state.y; },
        get_angle : function() { return state.angle; },
        get_thrust_percent : function() { return state.thrust / constants.thrust_max; },
        step : function(delta_time, do_thrust, do_spin_left, do_spin_right) {
          if(do_thrust) {
            state.thrust += constants.thrust_max * (delta_time / constants.thrust_delay);
            state.thrust = Math.min(state.thrust, constants.thrust_max);
          } else {
              state.thrust = 0;
          }
          if (do_spin_left && !do_spin_right) {
            if (state.spin > 0) state.spin = 0;
            state.spin -= constants.spin_max * (delta_time / constants.spin_delay);
            state.spin = Math.max(state.spin, -constants.spin_max);
            state.angle += state.spin * delta_time;
          } else if (do_spin_right && !do_spin_left) {
            state.spin = Math.max(state.spin, 0);
            state.spin += constants.spin_max * (delta_time / constants.spin_delay);
            state.spin = Math.min(state.spin, constants.spin_max);
            state.angle += state.spin * delta_time;
            state.angle = pix_field_lib.bound_angle(state.angle);
          } else {
            state.spin = 0;
          }
          state.velocity.x += state.thrust * Math.sin(state.angle) * delta_time;
          state.velocity.y += state.thrust * -Math.cos(state.angle) * delta_time;
          state.velocity.y += constants.gravity * delta_time;
          state.velocity.x *= 1 - (constants.drag * delta_time);
          state.velocity.y *= 1 - (constants.drag * delta_time);
          state.x += state.velocity.x;
          state.y += state.velocity.y;
        },
        bound : function(min_x, min_y, max_x, max_y) {
          if ((state.x - constants.size) < min_x) {
            state.x = min_x + constants.size;
            state.velocity.x = 0;
          }
          if ((state.y - constants.size) < min_y) {
            state.y = min_y + constants.size;
            state.velocity.y = 0;
          }
          if ((state.x + constants.size) > max_x) {
            state.x = max_x - constants.size;
            state.velocity.x = 0;
          }
          if ((state.y + constants.size) > max_y) {
            state.y = max_y - constants.size;
            state.velocity.y = 0;
          }
        }
      };
    },

    create_helicopter_pix : function() {
      var constants = {
        pix : [
          [-8,0,"#888"],
          [-6,0,"#888"],
          [-4,0,"#888"],
          [-2,-1.5,"#888"],
          [0,-1.9,"#88f"],
          [0,-2.9,"#888"],
          [2,-1.5,"#88f"],
          [3,0.5,"#88f"],
          [2,2.5,"#88f"],
          [0,2.5,"#888"]],
        pix_rear_prop : [
          [0,-1,"#444"],
          [0,1,"#444"]],
        blade_spin_min : 1 * Math.PI, // radians / s at no thrust
        blade_spin_thrust : 5 * Math.PI, // radians / s added at full thrust
        blade_radius : 6, // pixels
        prop_spin : 2 * Math.PI // radians / s
      };
      var state = {
        blades : [[0,0,"#aaa"],[0,0,"#aaa"]],
        blade_angle : 0,
        prop_angle : 0
      };
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
          pix_field_lib.render_pix_array(context, constants.pix_rear_prop, state.prop_angle);// + state.angle);
          context.restore();
          context.rotate(angle);
          context.translate(0,-2.9);
          context.rotate(-angle);
          pix_field_lib.render_pix_array(context, state.blades, angle);
          context.restore();
        }
      };
    }
  };
}();

Math.TwoPI = Math.PI * 2;
