if (!pix_field) { var pix_field = {}; }

// Model of a game storing state and drawing objects
pix_field.create_game = function(width, height) {
  return {
    boundary: pix_field.create_rectangle(0, 0, width, height),
    hover_square: pix_field.create_hover_square([width *0.3, height * 0.6]),
    target_square: pix_field.create_target_square([width * 0.7, height * 0.6]),
    helicopter: pix_field.create_helicopter(width / 2, height / 2),
    gun: pix_field.create_gun(),
    step : function(delta_time, space_bar, left, right) {
      this.helicopter.step_fly(delta_time, space_bar, left, right);
      this.helicopter.bound(this.boundary);
      this.helicopter.step_animation(delta_time, space_bar);
      var in_hover = this.hover_square.square.contains([this.helicopter.x, this.helicopter.y]);
      this.hover_square.step(delta_time, in_hover);
      this.gun.step_gun(delta_time, in_hover, this.helicopter.x, this.helicopter.y, this.helicopter.angle);
      if (this.hover_square.progress === 1) {
        this.hover_square = pix_field.create_hover_square(pix_field.lib.random_point(width, height));
      }
      this.gun.step_bullets(delta_time, this.target_square);
      this.gun.bound_bullets(this.boundary);
      if(this.target_square.hp === 0) {
        this.target_square = pix_field.create_target_square(pix_field.lib.random_point(width, height));
      }
    },
    draw : function(context) {
      this.hover_square.draw(context);
      this.target_square.draw(context);
      this.helicopter.draw(context);
      this.gun.draw_bullets(context);
    }
  };
};