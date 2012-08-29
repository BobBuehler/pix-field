if (!pix_field) { var pix_field = {}; }

// A square area that progresses while hovered over
pix_field.create_hover_square = function(x, y) {
  return {
    square : pix_field.create_square(x, y, 15),
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
    },
    draw : function(context) {
      context.save();
      context.translate(x, y);
      this.square.draw_here(context, this.outer_square_color);
      var scale = this.inner_radius +  this.progress * (1 - this.inner_radius);
      context.scale(scale, scale);
      this.square.draw_here(context, this.inner_square_color);
      context.restore();
    }
  };
};