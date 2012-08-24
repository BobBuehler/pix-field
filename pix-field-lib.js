// A collection of common utility methods.
// No dependencies on other scripts

var pix_field_lib = {
  // Return the angle in the range (-PI,PI]
  bound_angle : function(angle) {
    while (angle > Math.PI) {
      angle -= Math.TwoPI;
    }
    while (angle <= -Math.PI) {
      angle += Math.TwoPI;
    }
    return angle;
  },

  // Returns the value a percent of the way inbetween a and b.
  // percent = 0 returns a; 1 returns b.
  percent_between : function(a, b, percent) {
    return a + (b - a) * percent;
  },

  // Returns a function(callback) for chaining animation frames.
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  animation_frame_requester : function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  },

  // Hooks into the document's onkeydown and onkeyup events.
  // Returns an object get(keycode) returns true if the key is pressed and falsy otherwise.
  key_state_tracker : function() {
    var _state = {};
    document.onkeydown = function(ev) {
      _state[ev.which] = true;
    };
    document.onkeyup = function(ev) {
      _state[ev.which] = false;
    };
    return {
      get : function(key) {
        return _state[key];
      }
    };
  },

  // Resets a context to the standard transform and clears it.
  reset_context : function(context, fillStyle) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    if (fillStyle) {
      context.fillStyle = fillStyle;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    } else {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
  },

  // Draws an array of pix to the context at the given angle.
  // A pix is an array of three elements [x, y, fillstyle].
  // Each pix is rendered as a square of size 1 centered at the given x and y.
  render_pix_array : function(context, pix_array, angle) {
    context.save();
    context.rotate(angle);
    pix_array.forEach(function(p) {
      context.save();
      context.translate(p[0], p[1]);
      context.rotate(-angle);
      context.fillStyle = p[2];
      context.fillRect(-0.5, -0.5, 1, 1);
      context.restore();
    });
    context.restore();
  },

  do_canvas_game_loop : function(canvas, zoom, game_step, game_draw) {
    var context = canvas.getContext("2d"),
        next_frame = pix_field_lib.animation_frame_requester(),
        last_time = new Date().getTime();
    (function iterate() {
      next_frame(function() {
        iterate();
      });
      var time = new Date().getTime();
      var delta_time = (time - last_time) / 1000;
      game_step(delta_time);
      last_time = time;
      pix_field_lib.reset_context(context, "black");
      context.scale(zoom, zoom);
      game_draw(context);
    })();
  }
};

Math.TwoPI = Math.PI * 2;
Math.PIOverTwo = Math.PI / 2;
