if (!pix_field) { var pix_field = {}; }

// A square area that loses hp when hit
pix_field.create_target_square = function(point) {
  var square = pix_field.create_square(point, 15);
  return {
    square: square,
    mover: pix_field.create_rectangle_mover(square),
    regen_rate: 1, // hp / second
    max_hp: 10,
    hp: 10,
    outer_square_color: '#500',
    inner_square_color: '#700',
    hit: function() {
      this.hp--;
    },
    step: function(delta_time, do_regen) {
      if (do_regen === true) {
        this.hp = Math.min(this.hp + delta_time * this.regen_rate, this.max_hp);
      }
      this.mover.step(delta_time);
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