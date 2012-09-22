if (!pix_field) { var pix_field = {}; }

// A controller that moves a rectangle towards a destination.
pix_field.create_rectangle_mover = function(rectangle) {
  return {
    rectangle: rectangle,
    move_rate: 10,
    destination: null,
    velocity: [0, 0],
    set_destination: function(point) {
      this.destination = point;
      if (this.destination) {
        this.velocity = pix_field.lib.get_unit_vector(this.rectangle.center, this.destination);
      } else {
        this.velocity = [0, 0];
      }
    },
    step: function(delta_time) {
      if (this.destination) {
        var start = [this.rectangle.center[0], this.rectangle.center[1]];
        var delta_rate = delta_time * this.move_rate;
        this.rectangle.move_by([this.velocity[0] * delta_rate, this.velocity[1] * delta_rate]);
        if ((start[0] < this.destination[0]) != (this.rectangle.center[0] < this.destination[0]) ||
            (start[1] < this.destination[1]) != (this.rectangle.center[1] < this.destination[1])) {
          this.rectangle.move_to(this.destination);
          this.set_destination(null);
        }
      }
    }
  };
};