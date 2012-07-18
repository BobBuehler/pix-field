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

var Physics = function() {
    var _canvas,
        _context,
        _request_animation_frame;
    return {
        init : function(canvas) {
            _canvas = canvas;
            _context = _canvas.getContext("2d");
            _request_animation_frame = pix_field_lib.animation_frame_requester()
        },
        animate : function() {
            var buf = [];
            if (key_state(37)) buf.push("left");
            if (key_state(38)) buf.push("up");
            if (key_state(39)) buf.push("right");
            if (key_state(40)) buf.push("down");
            if (key_state(32)) buf.push("space");
            pix_field_lib.reset_context(_context);
            _context.fillStyle = "black";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            _context.font = "20pt Arial";
            _context.fillStyle = "gray";
            _context.fillText(buf.join(','), 0, 20);
            _request_animation_frame(function() {
                Physics.animate();
            });
        }
    };
}();

window.onload = function() {
    Physics.init(document.getElementById("canvas"));
    Physics.animate();
};