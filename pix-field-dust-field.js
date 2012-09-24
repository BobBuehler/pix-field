if (!pix_field) { var pix_field = {}; }

// A field of dust that is weakly affected by gravity and
// strongly affected by wind.
pix_field.create_dust_field = function(rectangle) {
  var horizontal_count = 10; // number of particles per row
  var horizontal_spacing = rectangle.width / horizontal_count;
  var vertical_count = Math.floor(horizontal_count / rectangle.width * rectangle.height);
  var vertical_spacing = rectangle.height / vertical_count;
  var dust = [];
  for (var v = 0; v < vertical_count; v++) {
    for (var h = 0; h < horizontal_count; h++) {

      dust.push([
        (h + Math.random()) * horizontal_spacing,
        (v + Math.random()) * vertical_spacing,
        "#321"]);
    }
  }
  return {
    dust: dust,
    gravity: 0.5, // pixels / second
    step: function(delta_time, wind_velocity) {
      var gravity = this.gravity;
      dust.forEach(function(pix) {
        pix[0] += wind_velocity[0] * delta_time;
        pix[1] += (wind_velocity[1] + gravity) * delta_time;
        if (pix[0] < 0) {
          pix[0] += rectangle.width;
        } else if (pix[0] > rectangle.width) {
          pix[0] -= rectangle.width;
        }
        if (pix[1] < 0) {
          pix[1] += rectangle.height;
        } else if (pix[1] > rectangle.height) {
          pix[1] -= rectangle.height;
        }
      });
    },
    draw: function(context) {
      pix_field.lib.render_pix_array(context, this.dust, 0);
    }
  };
};