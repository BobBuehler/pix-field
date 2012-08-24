// A game model that renders to a context
// Dependent on pix-field-lib.js, pix-field-lifter.js, pix-field-helicopter.js, and pix-field-hover-zone.js
if (!pix_field) { var pix_field = {}; }

pix_field.create_game = function(width, height) {
  var _lifter = pix_field.create_lifter(width / 2, height / 2),
      _helicopter = pix_field.create_helicopter(),
      _hover_square = pix_field.create_hover_square(width / 3, height / 3),
      _progress_square = pix_field.create_progress_square();
  return {
    step : function(delta_time, space_bar, left, right) {
      _lifter.step(delta_time, space_bar, left, right);
      _lifter.bound(0, 0, width, height);
      _helicopter.step(delta_time, space_bar);
      _hover_square.step(delta_time, _lifter.get_x(), _lifter.get_y());
      if (_hover_square.get_progress() === 1) {
        _hover_square = pix_field.create_hover_square(width * Math.random(), height * Math.random());
      }
    },
    draw : function(context) {
      _progress_square.draw(context, _hover_square.get_x(), _hover_square.get_y(), _hover_square.get_radius(), _hover_square.get_progress());
      _helicopter.draw(context, _lifter.get_x(), _lifter.get_y(), _lifter.get_angle());
    }
  };
};