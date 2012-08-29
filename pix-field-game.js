if (!pix_field) { var pix_field = {}; }

// Model of a game storing state and drawing objects
pix_field.create_game = function(width, height) {
  var _world_rectangle = [0, 0, width, height],
      _hover_square = pix_field.create_hover_square(width *0.3, height * 0.6),
      _target_square = pix_field.create_target_square(width * 0.7, height * 0.6),
      _helicopter = pix_field.create_helicopter(width / 2, height / 2),
      _gun = pix_field.create_gun();
  return {
    // Move the game state forward by a period of time
    step : function(delta_time, space_bar, left, right) {
      _helicopter.step_fly(delta_time, space_bar, left, right);
      _helicopter.bound(_world_rectangle);
      _helicopter.step_animation(delta_time, space_bar, left, right);
      if (_hover_square.square.contains([_helicopter.get_x(), _helicopter.get_y()])) {
        _hover_square.step(delta_time, true);
        _gun.step_gun(delta_time, _helicopter.get_x(), _helicopter.get_y(), _helicopter.get_angle(), _target_square);
        if (_hover_square.progress === 1) {
          _hover_square = pix_field.create_hover_square(width * Math.random(), height * Math.random());
        }
      } else {
        _hover_square.step(delta_time, false);
        _gun.step_gun(delta_time, _helicopter.get_x(), _helicopter.get_y(), _helicopter.get_angle());
      }
      _gun.step_bullets(delta_time, _target_square);
      _gun.bound_bullets(_world_rectangle);
      if(_target_square.hp === 0) {
        _target_square = pix_field.create_target_square(width * Math.random(), height * Math.random());
      }
    },
    // Draw the game state to the context
    draw : function(context) {
      _hover_square.draw(context);
      _target_square.draw(context);
      _helicopter.draw(context);
      _gun.draw_bullets(context);
    }
  };
};