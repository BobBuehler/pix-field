if (!pix_field) { var pix_field = {}; }

// A wind force that changes over time.
pix_field.create_wind = function() {
  return {
    min_magnitude: 50,
    max_magnitude: 100,
    max_duration: 5,
    decay_rate: 0.9, // percent velocity lost per second
    velocity: [0, 0],
    duration: 0,
    step: function(delta_time) {
      this.duration -= delta_time;
      if (this.duration < 0) {
        this.velocity[0] *= 1 - (delta_time * this.decay_rate);
        this.velocity[1] *= 1 - (delta_time * this.decay_rate);
      }
      if (this.velocity[0] < 1 && this.velocity[1] < 1) {
        var angle = Math.random() * Math.TwoPI;
        var magnitude = Math.random() * Math.random() * (this.max_magnitude - this.min_magnitude) + this.min_magnitude;
        this.velocity[0] = Math.cos(angle) * magnitude;
        this.velocity[1] = Math.sin(angle) * magnitude;
        this.duration = this.max_duration;
      }
    }
  };
};