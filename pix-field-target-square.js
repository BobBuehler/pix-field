if (!pix_field) { var pix_field = {}; }

// A square area that progresses while hovered over
pix_field.create_target_square = function(x, y) {
  var constants = {
    square : pix_field.create_square(x, y, 15),
    max_hp : 10,
    outer_square_color : '#500',
    inner_square_color : '#700'
  };
  var state = {
    hp : constants.max_hp - 1
  };
  return {
    get_square : function() {
      return constants.square;
    },
    get_hp : function() {
      return state.hp;
    },
    damage : function() {
      state.hp--;
      if (state.hp < 0) {
        state.hp = 0;
      }
    },
    draw : function(context) {
      context.save();
      context.translate(x, y);
      constants.square.draw_here(context, constants.outer_square_color);
      var scale = state.hp / constants.max_hp;
      context.scale(scale, scale);
      constants.square.draw_here(context, constants.inner_square_color);
      context.restore();
    }
  };
};