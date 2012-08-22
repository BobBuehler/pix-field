// An animation and game loop that maintains the game model and renders to a context
// Dependent on pix-field-lib.js, pix-field-lifter.js, pix-field-helicopter.js, and pix-field-hover-zone.js

var CANVAS = {width:1000, height:800, zoom:5};
var KEYS = {space:32, left:37, right:39};
var HOVER = {delay:3, decay:1, radius:15, background_color:"#050", progress_color:"#070"};

var pix_field_game = function(width, height) {
  var _lifter = pix_field_lib.create_lifter(width / 2, height / 2),
      _helicopter = pix_field_lib.create_helicopter_pix(),
      _hover_square = pix_field_lib.create_square(width / 3, height / 3, HOVER.radius),
      _hover_activator = pix_field_lib.create_activator(HOVER.delay, HOVER.decay,
          function(activator) {
            activator.reset();
            _hover_square.x = Math.random() * width;
            _hover_square.y = Math.random() * height;
          });
  return {
    step : function(delta_time, keyboard) {
      _lifter.step(delta_time, keyboard.get(KEYS.space), keyboard.get(KEYS.left), keyboard.get(KEYS.right));
      _lifter.bound(0, 0, width, height);
      _helicopter.step(delta_time, _lifter.get_thrust_percent());
      _hover_activator.step(delta_time, _hover_square.contains(_lifter.get_x(), _lifter.get_y()));
    },
    draw : function(context) {
      pix_field_lib.render_progress_square(context,
          _hover_square.x, _hover_square.y, _hover_square.radius,
          HOVER.background_color, HOVER.progress_color, _hover_activator.get_progress());
      _helicopter.draw(context, _lifter.get_x(), _lifter.get_y(), _lifter.get_angle());
    }
  };
};

window.onload = function() {
  var canvas = document.getElementById("canvas");
  canvas.width = CANVAS.width;
  canvas.height = CANVAS.height;
  var context = canvas.getContext("2d"),
      keyboard = pix_field_lib.key_state_tracker(),
      next_frame = pix_field_lib.animation_frame_requester(),
      game = pix_field_game(canvas.width / CANVAS.zoom, canvas.height / CANVAS.zoom),
      last_time = new Date().getTime();
  (function iterate() {
    next_frame(function() {
      iterate();
    });
    var time = new Date().getTime();
    var delta_time = (time - last_time) / 1000;
    game.step(delta_time, keyboard);
    last_time = time;
    pix_field_lib.reset_context(context, "black");
    context.scale(CANVAS.zoom, CANVAS.zoom);
    game.draw(context);
  })();
};