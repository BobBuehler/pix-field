if (!pix_field) { var pix_field = {}; }

// Model of a game storing state and drawing objects
pix_field.create_game = function(width, height) {
  var _helicopter = pix_field.create_helicopter(width / 2, height / 2),
      _hover_square = pix_field.create_hover_square(width / 3, height / 3),
      _progress_square = pix_field.create_progress_square();
  return {
    // Move the game state forward by a period of time
    step : function(delta_time, space_bar, left, right) {
      _helicopter.step(delta_time, space_bar, left, right);
      _helicopter.bound(0, 0, width, height);
      _hover_square.step(delta_time, _helicopter.get_x(), _helicopter.get_y());
      if (_hover_square.get_progress() === 1) {
        _hover_square = pix_field.create_hover_square(width * Math.random(), height * Math.random());
      }
    },
    // Draw the game state to the context
    draw : function(context) {
      _progress_square.draw(context, _hover_square.get_x(), _hover_square.get_y(), _hover_square.get_radius(), _hover_square.get_progress());
      _helicopter.draw(context);
    }
  };
};