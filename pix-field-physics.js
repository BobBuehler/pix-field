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
        radius : 2, // pixels
        gravity : 1, // pixels / s
        thrust_max : 2, // pixels / s
        thrust_delay : .1, // seconds
        spin_max : 2 * Math.PI, // radians / s
        spin_delay : .2, //seconds
        drag : 0.01, // pixels / s
        blade_spin_min : 1 * Math.PI, // radians / s at no thrust
        blade_spin_thrust : 5 * Math.PI, // radians / s added at full thrust
        blade_radius : 6, // pixels
        prop_spin : 2 * Math.PI // radians / s
    };
    var state = {
        position : { x:0, y:0 },
        angle : 0,
        velocity : { x:0, y:0 },
        spin : 0,
        thrust : 0,
        blades : [[0,0,"#aaa"],[0,0,"#aaa"]],
        blade_angle : 0,
        prop_angle : 0
    };

    return {
        reset : function(x, y) {
            state.position.x = x;
            state.position.y = y;
            state.angle = 0;
            state.velocity.x = 0;
            state.velocity.y = 0;
        },
        step : function(delta_time, do_thrust, do_spin_left, do_spin_right) {
            if(do_thrust) {
                state.thrust += constants.thrust_max * (delta_time / constants.thrust_delay);
                state.thrust = Math.min(state.thrust, constants.thrust_max);
                state.velocity.x += state.thrust * Math.sin(state.angle) * delta_time;
                state.velocity.y += state.thrust * -Math.cos(state.angle) * delta_time;
            } else {
                state.thrust = 0;
            }
            if (do_spin_left && !do_spin_right) {
                state.spin = Math.min(state.spin, 0);
                state.spin -= constants.spin_max * (delta_time / constants.spin_delay);
                state.spin = Math.max(state.spin, -constants.spin_max);
                state.angle += state.spin * delta_time;
            } else if (do_spin_right && !do_spin_left) {
                state.spin = Math.max(state.spin, 0);
                state.spin += constants.spin_max * (delta_time / constants.spin_delay);
                state.spin = Math.min(state.spin, constants.spin_max);
                state.angle += state.spin * delta_time;
            } else {
                state.spin = 0;
            }
            state.velocity.y += constants.gravity * delta_time;
            state.velocity.x *= 1 - (constants.drag * delta_time);
            state.velocity.y *= 1 - (constants.drag * delta_time);
            state.position.x += state.velocity.x;
            state.position.y += state.velocity.y;
            state.blade_angle += delta_time * (constants.blade_spin_min + state.thrust / constants.thrust_max * constants.blade_spin_thrust);
            while (state.blade_angle > Math.TwoPI) {
              state.blade_angle -= Math.TwoPI;
            }
            state.blades[0][0] = Math.sin(state.blade_angle) * constants.blade_radius;
            state.blades[1][0] = Math.sin(-state.blade_angle) * constants.blade_radius;
            state.prop_angle += constants.prop_spin * delta_time;
            while (state.prop_angle > Math.TwoPI) {
              state.prop_angle -= Math.TwoPI;
            }
        },
        bound : function(min_x, min_y, max_x, max_y) {
            var x = state.position.x;
            if (x < min_x + constants.radius) {
                x = min_x + constants.radius;
                state.velocity.x = 0;
            } else if (x > max_x - constants.radius) {
                x = max_x - constants.radius;
                state.velocity.x = 0;
            }
            state.position.x = x;

            var y = state.position.y;
            if (y < min_y + constants.radius) {
                y = min_y + constants.radius;
                state.velocity.y = 0;
            } else if (y > max_y - constants.radius) {
                y = max_y - constants.radius;
                state.velocity.y = 0;
            }
            state.position.y = y;
        },
        draw : function(context) {
            context.save();
            context.translate(state.position.x, state.position.y);
            pix_field_lib.render_pix_array(context, Data.ship.pix, state.angle);
            context.save();
            context.rotate(state.angle);
            context.translate(-8,0);
            context.rotate(-state.angle);
            pix_field_lib.render_pix_array(context, Data.rear_prop.pix, state.prop_angle);// + state.angle);
            context.restore();
            context.rotate(state.angle);
            context.translate(0,-2.9);
            context.rotate(-state.angle);
            pix_field_lib.render_pix_array(context, state.blades, state.angle);
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
            Helicopter.step(delta_time, key_state(32), key_state(37), key_state(39));
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