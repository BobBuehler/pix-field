if (!pix_field) { var pix_field = {}; }

// Model of a game storing state and drawing objects
pix_field.create_game = function(width, height) {
  var boundary = pix_field.create_rectangle(0, 0, width, height);
  var destination_boundary = pix_field.create_rectangle(5, 5, width - 10, height - 10);
  var random_destination_point = function() {
    return pix_field.lib.random_point_in_rect(destination_boundary);
  };
  var game = {
    boundary: boundary,
    helicopter: pix_field.create_helicopter(width / 2, height / 2),
    dust: pix_field.create_dust_field(boundary),
    wind: pix_field.create_wind(),
    hover_square: pix_field.create_hover_square([width *0.3, height * 0.6], random_destination_point),
    target_square: pix_field.create_target_square([width * 0.7, height * 0.6], random_destination_point),
    gun: pix_field.create_gun(),
    scoreboard: pix_field.create_scoreboard(),
    detect_hit : function(x, y) {
      return game.target_square.square.contains([x, y]);
    },
    step : function(delta_time, space_bar, left, right, do_regen, do_wind, do_move_squares) {
      this.helicopter.step_fly(delta_time, space_bar, left, right);
      if (do_wind) {
        this.wind.step(delta_time);
        this.dust.step(delta_time, this.wind.velocity);
        this.helicopter.step_wind(delta_time, this.wind.velocity);
      }
      this.helicopter.bound(this.boundary);
      this.helicopter.step_animation(delta_time, space_bar);
      var in_hover = this.hover_square.square.contains([this.helicopter.x, this.helicopter.y]);
      this.hover_square.step(delta_time, in_hover, do_move_squares);
      if (this.hover_square.progress === 1) {
        this.gun.create_starburst(this.hover_square.square.center[0], this.hover_square.square.center[1], 200);
        this.hover_square = pix_field.create_hover_square(random_destination_point(), random_destination_point);
      }
      this.gun.step_gun(delta_time, in_hover, this.helicopter.x, this.helicopter.y, this.helicopter.angle);
      var hits = this.gun.step_bullets(delta_time, this.detect_hit);
      hits.forEach(function(hit) {
        this.target_square.hit(hit.x, hit.y, hit.angle);
      }, this);
      this.gun.bound_bullets(this.boundary);
      this.target_square.step(delta_time, do_regen, do_move_squares);
      if(this.target_square.hp <= 0) {
        this.scoreboard.add_kill();
        this.target_square = pix_field.create_target_square(random_destination_point(), random_destination_point);
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
  return game;
};