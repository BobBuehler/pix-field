if (!pix_field) { var pix_field = {}; }

// A gun that owns its bullets
pix_field.create_gun = function() {
  return {
    seconds_per_shot: 0.15,
    bullet_speed: 100, // pixels / s
    bullet_color: "#bb0",
    cooldown: 0,
    bullets: [],
    create_starburst: function(x, y, bullet_count) {
      var angle_offset = Math.random() * Math.TwoPI;
      var angle_spacing = Math.TwoPI / bullet_count;
      for (var i = 0; i < bullet_count; ++i) {
        var angle = angle_offset + (i * angle_spacing);
        this.bullets.push({
          x: x,
          y: y,
          v_x: Math.cos(angle) * this.bullet_speed / 2,
          v_y: Math.sin(angle) * this.bullet_speed / 2,
          delay: Math.random() * 2
        });
      }
    },
    step_gun: function(delta_time, do_fire, x, y, angle) {
      this.cooldown = Math.max(this.cooldown - delta_time, -delta_time);
      while (do_fire && this.cooldown <= 0) {
        this.bullets.push({
          x: x,
          y: y,
          v_x: Math.cos(angle) * this.bullet_speed,
          v_y: Math.sin(angle) * this.bullet_speed,
          delay: this.cooldown + delta_time
        });
        this.cooldown += this.seconds_per_shot;
      }
    },
    step_bullets: function(delta_time, target_square) {
      for (var i = this.bullets.length - 1; i >= 0; --i) {
        var bullet = this.bullets[i];
        var live_time = delta_time - bullet.delay;
        if (live_time > 0) {
          var end_x = bullet.x + bullet.v_x * live_time;
          var end_y = bullet.y + bullet.v_y * live_time;
          if(target_square.square.intersects_segment([[bullet.x, bullet.y], [end_x, end_y]])) {
            target_square.hit();
            this.bullets.splice(i, 1);
          } else {
            bullet.x = end_x;
            bullet.y = end_y;
            bullet.delay = 0;
            bullet.alive = true;
          }
        } else {
          bullet.delay -= delta_time;
        }
      }
    },
    bound_bullets: function(bounding_rect) {
      for (var i = this.bullets.length - 1; i >= 0; --i) {
        var bullet = this.bullets[i];
        if (bullet.alive && !pix_field.lib.rectangle_contains_point(bounding_rect, [bullet.x, bullet.y])) {
          this.bullets.splice(i, 1);
        }
      }
    },
    draw_bullets: function(context) {
      context.fillStyle = this.bullet_color;
      for (var i = this.bullets.length - 1; i >= 0; --i) {
        var bullet = this.bullets[i];
        if (bullet.alive) {
          context.fillRect(bullet.x - 0.5, bullet.y - 0.5, 1, 1);
        }
      }
    }
  };
};