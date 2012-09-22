if (!pix_field) { var pix_field = {}; }

// A square area that progresses while hovered over
pix_field.create_hover_square = function(point) {
  return {
    square : pix_field.create_square(point, 15),
    move_rate : 10, // pixels / s
    destination: false, // [x,y] | false
    velocity: [0, 0], // [dx, dy]
    outer_square_color : '#050',
    inner_square_color : '#070',
    inner_radius : 0.3, // percent of outer radius at 0 progress
    progress_rate : 0.33, // progress / s
    decay_rate : 1, // progress lost / s
    progress : 0, // percent
    set_destination: function(point) {
      this.destination = point;
      if (this.destination) {
        this.velocity = pix_field.lib.get_unit_vector(this.square.center, this.destination);
      } else {
        this.velocity = [0, 0];
      }
    },
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