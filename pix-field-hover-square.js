if (!pix_field) { var pix_field = {}; }

// A square area that progresses while hovered over
pix_field.create_hover_square = function(point) {
  var square = pix_field.create_square(point, 15);
  return {
    square : square,
    mover: pix_field.create_rectangle_mover(square),
    outer_square_color : '#050',
    inner_square_color : '#070',
    inner_radius : 0.3, // percent of outer radius at 0 progress
    progress_rate : 0.33, // progress / s
    decay_rate : 1, // progress lost / s
    progress : 0, // percent
    step : function(delta_time, do_progress) {
      if (do_progress) {
        this.progress += delta_time * this.progress_rate;
        if (this.progress > 1) {
          this.progress = 1;
        }
      } else {
        this.progress -= delta_time * this.decay_rate;
        if (this.progress < 0) {
          this.progress = 0;
        }
      }
      this.mover.step(delta_time);
    },
    draw : function(context) {
      context.save();
      context.translate(this.square.center[0], this.square.center[1]);
      this.square.draw_here(context, this.outer_square_color);
      var scale = this.inner_radius +  this.progress * (1 - this.inner_radius);
      context.scale(scale, scale);
      this.square.draw_here(context, this.inner_square_color);
      context.restore();
    }
  };
};