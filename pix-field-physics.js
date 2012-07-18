var key_state = function() {
    var _state = {};
    document.onkeydown = function(ev) {
        _state[ev.which] = true;
    }
    document.onkeyup = function(ev) {
        _state[ev.which] = false;
    }
    return function(key) {
        return _state[key];
    };
}();

var Data = {};

var Helicopter = function() {
    var constants = {
        gravity : 15, // pixels / s
        thrust : 40, // pixels / s
        spin : 1.5 * Math.PI, // radians / s
        drag : 0.1
    };
    var state = {
        position : { x:0, y:0 },
        angle : 0,
        velocity : { x:0, y:0 }
    };
    
    return {
        reset : function(x, y) {
            state.position.x = x;
            state.position.y = y;
            state.angle = 0;
            state.velocity.x = 0;
            state.velocity.y = 0;
        },
        thrust : function(delta_time) {
            state.velocity.x += constants.thrust * Math.sin(state.angle) * delta_time;
            state.velocity.y += constants.thrust * -Math.cos(state.angle) * delta_time;
        },
        spin : function(delta_time) {
            state.angle += constants.spin * delta_time;
        },
        step : function(delta_time) {
            state.velocity.y += constants.gravity * delta_time;
            state.velocity.x *= 1 - (constants.drag * delta_time);
            state.velocity.y *= 1 - (constants.drag * delta_time);
            state.position.x += state.velocity.x * delta_time;
            state.position.y += state.velocity.y * delta_time;
        },
        bound : function(min_x, min_y, max_x, max_y) {
            var x = state.position.x;
            if (x < min_x) {
                x = min_x;
                state.velocity.x = 0;
            } else if (x > max_x) {
                x = max_x;
                state.velocity.x = 0;
            }
            state.position.x = x;
            
            var y = state.position.y;
            if (y < min_y) {
                y = min_y;
                state.velocity.y = 0;
            } else if (y > max_y) {
                y = max_y;
                state.velocity.y = 0;
            }
            state.position.y = y;
        },
        draw : function(context) {
            context.save();
            context.translate(state.position.x, state.position.y);
            pix_field_lib.render_pix_array(context, Data.ship.pix, state.angle);
            context.restore();
        }
    };
}();

var Loop = function() {
    var _canvas,
        _context,
        _request_animation_frame,
        _zoom = 5,
        _last_time;
    return {
        init : function(canvas) {
            _canvas = canvas;
            _context = _canvas.getContext("2d");
            _request_animation_frame = pix_field_lib.animation_frame_requester();
            Helicopter.reset(_canvas.width / 2 / _zoom, _canvas.height / 2 / _zoom);
            _last_time = new Date().getTime();
        },
        animate : function() {
            var time = new Date().getTime();
            var delta_time = (time - _last_time) / 1000;
            _last_time = time;
            if (key_state(37)) // left
                Helicopter.spin(-delta_time);
            if (key_state(39)) // right
                Helicopter.spin(delta_time);
            if (key_state(32)) // space
                Helicopter.thrust(delta_time);
            Helicopter.step(delta_time);
            Helicopter.bound(0, 0, _canvas.width / _zoom, _canvas.height / _zoom);  
            pix_field_lib.reset_context(_context);
            _context.fillStyle = "black";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            _context.scale(_zoom, _zoom);
            Helicopter.draw(_context);
            _request_animation_frame(function() {
                Loop.animate();
            });
        }
    };
}();

window.onload = function() {
    Loop.init(document.getElementById("canvas"));
    pix_field_lib.read_json("data.json", function(data) {
        Data = data;
        Loop.animate();
    });
};