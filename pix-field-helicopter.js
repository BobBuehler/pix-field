if (!pix_field) { var pix_field = {}; }

// An animated helicopter that can spin and thrust
pix_field.create_helicopter = function(x, y) {
  var constants = {
    gravity: 60, // pixels / s / s
    thrust: 120, // pixels / s / s
    spin_max: 2 * Math.PI, // radians / s
    spin_delay: 0.2, //seconds
    blade_spin_idle: 1 * Math.PI, // radians / s
    blade_spin_thrust: 6 * Math.PI, // radians / s
    prop_spin: 2 * Math.PI // radians / s
  };
  var colors = {
    body: '#888',
    glass: '#88f',
    main_rotor: '#aaa',
    tail_rotor: '#444'
  };
  var pix = {
    body: [
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
    // additional element is radius at 0 radians
    main_rotor: [
      [0,0,"red",-6],
      [0,0,colors.main_rotor,-5],
      [0,0,colors.main_rotor,5],
      [0,0,"green",6]
    ],
    tail_rotor: [
      [0,-1,colors.tail_rotor],
      [0,1,colors.tail_rotor]
    ],
    main_rotor_angle: 0,
    tail_rotor_angle: 0,
    reverse: false,
    draw: function(context, x, y, angle) {
      this.main_rotor_angle = pix_field.lib.bound_angle(this.main_rotor_angle);
      this.tail_rotor_angle = pix_field.lib.bound_angle(this.tail_rotor_angle);
      var main_rotor_radius = Math.sin(this.main_rotor_angle + Math.PIOverTwo);
      this.main_rotor.forEach(function(b){
        b[0] = main_rotor_radius * b[3];
      });
      if (this.reverse != (this.main_rotor_angle < 0)) {
        this.main_rotor = this.main_rotor.reverse();
        this.reverse = !this.reverse;
      }
      context.save();
      context.translate(x, y);
      pix_field.lib.render_pix_array(context, this.body, angle);
      context.save();
      context.rotate(angle);
      context.translate(-8,0);
      context.rotate(-angle);
      pix_field.lib.render_pix_array(context, this.tail_rotor, this.tail_rotor_angle);
      context.restore();
      context.rotate(angle);
      context.translate(0,-2.9);
      context.rotate(-angle);
      pix_field.lib.render_pix_array(context, this.main_rotor, angle);
      context.restore();
    }
  };
  return {
    x: x, // pixels
    y: y, // pixels
    velocity: {x: 0, y: 0}, // pixels / s
    angle: 0, // radians cw of east
    spin: 0, // radians / s
    blade_angle: 0, // radians
    prop_angle: 0, // radians
    step_fly: function(delta_time, do_thrust, do_spin_left, do_spin_right) {
      if (do_spin_left && !do_spin_right) {
        this.spin = Math.min(this.spin, 0);
        this.spin -= constants.spin_max * (delta_time / constants.spin_delay);
        this.spin = Math.max(this.spin, -constants.spin_max);
      } else if (do_spin_right && !do_spin_left) {
        this.spin = Math.max(this.spin, 0);
        this.spin += constants.spin_max * (delta_time / constants.spin_delay);
        this.spin = Math.min(this.spin, constants.spin_max);
      } else {
        this.spin = 0;
      }
      this.angle += this.spin * delta_time;
      this.angle = pix_field.lib.bound_angle(this.angle);
      if (do_thrust) {
        var thrust_angle = this.angle - Math.PIOverTwo;
        this.velocity.x += constants.thrust * Math.cos(thrust_angle) * delta_time;
        this.velocity.y += constants.thrust * Math.sin(thrust_angle) * delta_time;
      }
      this.velocity.y += constants.gravity * delta_time;
      this.x += this.velocity.x * delta_time;
      this.y += this.velocity.y * delta_time;
    },
    step_animation: function(delta_time, do_thrust) {
      pix.main_rotor_angle += delta_time * (do_thrust ? constants.blade_spin_thrust : constants.blade_spin_idle);
      pix.tail_rotor_angle += constants.prop_spin * delta_time;
    },
    // Draw the helicopter to the context
    draw: function(context) {
      pix.draw(context, this.x, this.y, this.angle);
    },
    // Keep the helicopter within a boundary
    bound: function(bounding_rectangle) {
      if (this.x < bounding_rectangle[0]) {
        this.x = bounding_rectangle[0];
        this.velocity.x = 0;
      }
      if (this.y < bounding_rectangle[1]) {
        this.y = bounding_rectangle[1];
        this.velocity.y = 0;
      }
      if (this.x > bounding_rectangle[2]) {
        this.x = bounding_rectangle[2];
        this.velocity.x = 0;
      }
      if (this.y > bounding_rectangle[3]) {
        this.y = bounding_rectangle[3];
        this.velocity.y = 0;
      }
    }
  };
};