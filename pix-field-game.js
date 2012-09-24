if (!pix_field) { var pix_field = {}; }

// Model of a game storing state and drawing objects
pix_field.create_game = function(width, height) {
  var boundary = pix_field.create_rectangle(0, 0, width, height);
  var destination_boundary = pix_field.create_rectangle(5, 5, width - 10, height - 10);
  return {
    boundary: boundary,
    helicopter: pix_field.create_helicopter(width / 2, height / 2),
    dust: pix_field.create_dust_field(boundary),
    wind: pix_field.create_wind(),
    hover_square: pix_field.create_hover_square([width *0.3, height * 0.6]),
    target_square: pix_field.create_target_square([width * 0.7, height * 0.6]),
    gun: pix_field.create_gun(),
    step : function(delta_time, space_bar, left, right) {
      this.wind.step(delta_time);
      this.dust.step(delta_time, this.wind.velocity);
      this.helicopter.step_fly(delta_time, this.wind.velocity, space_bar, left, right);
      this.helicopter.bound(this.boundary);
      this.helicopter.step_animation(delta_time, space_bar);
      var in_hover = this.hover_square.square.contains([this.helicopter.x, this.helicopter.y]);
      this.hover_square.step(delta_time, in_hover);
      if (this.hover_square.progress === 1) {
        this.hover_square = pix_field.create_hover_square(pix_field.lib.random_point_in_rect(destination_boundary));
      }
      if (!this.hover_square.mover.destination) {
        this.hover_square.mover.set_destination(pix_field.lib.random_point(width, height));
      }
      this.gun.step_gun(delta_time, in_hover, this.helicopter.x, this.helicopter.y, this.helicopter.angle);
      this.gun.step_bullets(delta_time, this.target_square);
      this.gun.bound_bullets(this.boundary);
      this.target_square.step(delta_time, true);
      if(this.target_square.hp <= 0) {
        this.target_square = pix_field.create_target_square(pix_field.lib.random_point(width, height));
      }
      if (!this.target_square.mover.destination) {
        this.target_square.mover.set_destination(pix_field.lib.random_point_in_rect(destination_boundary));
      }
    },
    draw : function(context) {
      this.dust.draw(context);
      this.hover_square.draw(context);
      this.target_square.draw(context);
      this.helicopter.draw(context);
      this.gun.draw_bullets(context);
    }
  };
};