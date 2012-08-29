if (!pix_field) { var pix_field = {}; }

// Model of a game storing state and drawing objects
pix_field.create_game = function(width, height) {
  var _hover_square = pix_field.create_hover_square(width / 3, height / 3),
      _target_square = pix_field.create_target_square(width * 0.75, height * 0.75),
      _helicopter = pix_field.create_helicopter(width / 2, height / 2);
  return {
    // Move the game state forward by a period of time
    step : function(delta_time, space_bar, left, right) {
      _helicopter.step_fly(delta_time, space_bar, left, right);
      _helicopter.bound(0, 0, width, height);
      _helicopter.step_animate(delta_time, space_bar, left, right);
      _helicopter.step_attack(delta_time, _target_square);
      _hover_square.step(delta_time, _helicopter.get_x(), _helicopter.get_y());
      if (_hover_square.get_progress() === 1) {
        _hover_square = pix_field.create_hover_square(width * Math.random(), height * Math.random());
      }
    },
    // Draw the game state to the context
    draw : function(context) {
      _hover_square.draw(context);
      _target_square.draw(context);
      _helicopter.draw(context);
    }
  };
};