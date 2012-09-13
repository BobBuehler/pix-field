if (!pix_field) { var pix_field = {}; }

// A gun that owns its bullets
pix_field.create_gun = function() {
  return {
    seconds_per_shot: 0.1,
    bullet_speed: 100, // pixels / s
    bullet_color: "#bb0",
    cooldown: 0,
    bullets: [],
    step_gun: function(delta_time, x, y, angle, target_square) {
      this.cooldown -= delta_time;
      if (this.cooldown < -delta_time) {
        this.cooldown = -delta_time;
      } else if (this.cooldown > 0) {
        return;
      }
      if (target_square) {
        var arc = target_square.square.arc_project_around_point([x, y]);
        if (pix_field.lib.arc_contains_angle(arc, angle)) {
          while (this.cooldown <= 0) {
            this.bullets.push({
              x: x,
              y: y,
              v_x: Math.cos(angle) * this.bullet_speed,
              v_y: Math.sin(angle) * this.bullet_speed,
              delay: this.cooldown + delta_time
            });
            this.cooldown += this.seconds_per_shot;
          }
        }
      }
    },
    step_bullets: function(delta_time, target_square) {
      for (var i = this.bullets.length - 1; i >= 0; --i) {
        var bullet = this.bullets[i];
        var end_x = bullet.x + bullet.v_x * (delta_time - bullet.delay);
        var end_y = bullet.y + bullet.v_y * (delta_time - bullet.delay);
        if(target_square.square.intersects_segment([[bullet.x, bullet.y], [end_x, end_y]])) {
          target_square.hit();
          this.bullets.splice(i, 1);
        } else {
          bullet.x = end_x;
          bullet.y = end_y;
          bullet.delay = 0;
        }
      }
    },
    bound_bullets: function(bounding_rect) {
      for (var i = this.bullets.length - 1; i >= 0; --i) {
        var bullet = this.bullets[i];
        if (!pix_field.lib.rectangle_contains_point(bounding_rect, [bullet.x, bullet.y])) {
          this.bullets.splice(i, 1);
        }
      }
    },
    draw_bullets: function(context) {
      context.fillStyle = this.bullet_color;
      for (var i = this.bullets.length - 1; i >= 0; --i) {
        var bullet = this.bullets[i];
        context.fillRect(bullet.x - 0.5, bullet.y - 0.5, 1, 1);
      }
    }
  };
};