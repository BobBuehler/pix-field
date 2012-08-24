if (!pix_field) { var pix_field = {}; }

pix_field.create_progress_square = function() {
  var constants = {
    min_inner_radius : 0.3, // percent of outer radius
    outer_square_color : "#050",
    inner_square_color : "#070"
  };
  return {
    draw : function(context, x, y, radius, progress) {
      var diameter = radius * 2;
      context.fillStyle = constants.outer_square_color;
      context.fillRect(x - radius, y - radius, diameter, diameter);
      var inner_radius = radius * pix_field_lib.percent_between(constants.min_inner_radius, 1, progress);
      var inner_diameter = inner_radius * 2;
      context.fillStyle = constants.inner_square_color;
      context.fillRect(x - inner_radius, y - inner_radius, inner_diameter, inner_diameter);
    }
  };
};