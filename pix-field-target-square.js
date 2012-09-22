if (!pix_field) { var pix_field = {}; }

// A square area that loses hp when hit
pix_field.create_target_square = function(point) {
  return {
    square: pix_field.create_square(point, 15),
    move_rate : 10, // pixels / s
    destination: false, // [x,y] | false
    velocity: [0, 0], // [dx, dy]
    regen_rate: 0.5, // hp / second
    max_hp: 10,
    hp: 10,
    outer_square_color: '#500',
    inner_square_color: '#700',
    set_destination: function(point) {
      this.destination = point;
      if (this.destination) {
        this.velocity = pix_field.lib.get_unit_vector(this.square.center, this.destination);
      } else {
        this.velocity = [0, 0];
      }
    },
    hit: function() {
      this.hp--;
    },
    step: function(delta_time, do_regen) {
      if (do_regen === true) {
        this.hp = Math.min(this.hp + delta_time * this.regen_rate, this.max_hp);
      }
      if (this.destination) {
        var start = [this.square.center[0], this.square.center[1]];
        var delta_rate = delta_time * this.move_rate;
        this.square.move_by([this.velocity[0] * delta_rate, this.velocity[1] * delta_rate]);
        if ((start[0] < this.destination[0]) != (this.square.center[0] < this.destination[0]) ||
            (start[1] < this.destination[1]) != (this.square.center[1] < this.destination[1])) {
          this.square.move_to(this.destination);
          this.set_destination(false);
        }
      }
    },
    draw: function(context) {
      context.save();
      context.translate(this.square.center[0], this.square.center[1]);
      this.square.draw_here(context, this.outer_square_color);
      var scale = this.hp / this.max_hp;
      context.scale(scale, scale);
      this.square.draw_here(context, this.inner_square_color);
      context.restore();
    }
  };
};