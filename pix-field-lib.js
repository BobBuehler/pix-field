var pix_field_lib = {
  // Return the angle in the range (-PI,PI]
  bound_angle : function(angle) {
    while (angle > Math.PI) {
      angle -= Math.TwoPI;
    }
    while (angle <= -Math.PI) {
      angle += Math.TwoPI;
    }
    return angle;
  },

  // Returns the value a percent of the way inbetween a and b.
  // percent = 0 returns a; 1 returns b.
  percent_between : function(a, b, percent) {
    return a + (b - a) * percent;
  },

  // Draws an array of pix to the context at the given angle.
  // A pix is an array of three elements [x, y, fillstyle].
  // Each pix is rendered as a square of size 1 centered at the given x and y.
  render_pix_array : function(context, pix_array, angle) {
    context.save();
    context.rotate(angle);
    pix_array.forEach(function(p) {
      context.save();
      context.translate(p[0], p[1]);
      context.rotate(-angle);
      context.fillStyle = p[2];
      context.fillRect(-0.5, -0.5, 1, 1);
      context.restore();
    });
    context.restore();
  }
};

Math.TwoPI = Math.PI * 2;
Math.PIOverTwo = Math.PI / 2;
