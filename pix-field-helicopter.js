if (!pix_field) { var pix_field = {}; }

// An animated helicopter that can spin and thrust
pix_field.create_helicopter = function(x, y) {
  var colors = {
    body: '#888',
    glass: '#88f',
    top: '#aaa',
    tail: '#444'
  };
  return {
    pix: {
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
      tail: [
        [0,-1,colors.tail],
        [0,1,colors.tail]
      ]},
    x: x, // pixels
    y: y, // pixels
    velocity: {x: 0, y: 0}, // pixels / s
    gravity: 60, // pixels / s / s
    wind_force: 0.5, // percent of 100 force winds to apply
    thrust: 120, // pixels / s / s
    angle: 0, // radians cw of east
    spin: 0, // radians / s
    spin_max: 2 * Math.PI, // radians / s
    spin_delay: 0.2, //seconds
    top_full_radius: 6,
    top_angle: 0,
    top_spin_idle: 1 * Math.PI, // radians / s
    top_spin_thrust: 6 * Math.PI, // radians / s
    tail_angle: 0,
    tail_spin: 2 * Math.PI, // radians / s
    step_fly: function(delta_time, do_thrust, do_spin_left, do_spin_right) {
      if (do_spin_left && !do_spin_right) {
        this.spin = Math.min(this.spin, 0);
        this.spin -= this.spin_max * (delta_time / this.spin_delay);
        this.spin = Math.max(this.spin, -this.spin_max);
      } else if (do_spin_right && !do_spin_left) {
        this.spin = Math.max(this.spin, 0);
        this.spin += this.spin_max * (delta_time / this.spin_delay);
        this.spin = Math.min(this.spin, this.spin_max);
      } else {
        this.spin = 0;
      }
      this.angle = pix_field.lib.bound_angle(this.angle + this.spin * delta_time);
      if (do_thrust) {
        var thrust_angle = this.angle - Math.PIOverTwo;
        this.velocity.x += this.thrust * Math.cos(thrust_angle) * delta_time;
        this.velocity.y += this.thrust * Math.sin(thrust_angle) * delta_time;
      }
      this.velocity.y += this.gravity * delta_time;
      this.x += this.velocity.x * delta_time;
      this.y += this.velocity.y * delta_time;
    },
    step_wind: function(delta_time, wind_velocity) {
      var delta_velocity = [
        wind_velocity[0] * this.wind_force * delta_time,
        wind_velocity[1] * this.wind_force * delta_time
      ];
      this.velocity.x += delta_velocity[0];
      this.velocity.y += delta_velocity[1];
      this.x += delta_velocity[0] * delta_time;
      this.y += delta_velocity[1] * delta_time;
    },
    step_animation: function(delta_time, do_thrust) {
      this.top_angle = pix_field.lib.bound_angle(this.top_angle + delta_time * (do_thrust ? this.top_spin_thrust : this.top_spin_idle));
      this.tail_angle = pix_field.lib.bound_angle(this.tail_angle + this.tail_spin * delta_time);
    },
    // Draw the helicopter to the context
    draw: function(context) {
      context.save();
      context.translate(this.x, this.y);
      pix_field.lib.render_pix_array(context, this.pix.body, this.angle);
      context.save();
      context.rotate(this.angle);
      context.translate(-8,0);
      context.rotate(-this.angle);
      pix_field.lib.render_pix_array(context, this.pix.tail, this.tail_angle);
      context.restore();
      context.rotate(this.angle);
      context.translate(0,-2.9);
      context.rotate(-this.angle);
      var top_radius = Math.sin(this.top_angle) * this.top_full_radius;
      pix_field.lib.render_pix_array(context, [[top_radius,0,colors.top],[-top_radius,0,colors.top]], this.angle);
      context.restore();
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