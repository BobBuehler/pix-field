if (!pix_field) { var pix_field = {}; }

// A square area that loses hp when hit
pix_field.create_target_square = function(point) {
  return {
    square: pix_field.create_square(point, 15),
    max_hp: 20,
    hp: 20,
    outer_square_color: '#500',
    inner_square_color: '#700',
    hit: function() {
      this.hp--;
      if (this.hp < 0) {
        this.hp = 0;
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