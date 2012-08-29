if (!pix_field) { var pix_field = {}; }
if (!pix_field.lib) { pix_field.lib = {}; }

// Draws an array of pix to the context at the given angle.
// A pix is an array of three elements [x, y, fillstyle].
// Each pix is rendered as a square of size 1 centered at the given x and y.
pix_field.lib.render_pix_array = function(context, pix_array, angle) {
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
};
