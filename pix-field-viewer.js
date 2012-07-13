var Viewer = function() {
    var _canvas = {},
        _context = {},
        _data = {};

    return {
        // Store the values that only the Viewer should modify
        init : function(canvas, data, size) {
            _canvas = canvas;    
            _data = data;
            _context = _canvas.getContext("2d");
            _canvas.width = size;
            _canvas.height = size; 
        },
        
        // Clear to black, move to center, zoom, and draw
        draw : function(name, zoom, rotate) {
            reset_context(_context);
            _context.fillStyle = "black";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            _context.translate(_canvas.width / 2, _canvas.height / 2);
            _context.scale(zoom, zoom);
            render_pix_field(_context, _data[name].pix, rotate * Math.PI / 180);            
        }
    };
}();

// Reusable JS methods

// Grab json, parse, and call me back. No callback on error.
function read_json(path, callback) {
    var first = true; // only invoke callback on first response
    var READY = 4;
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", path, true);
    txtFile.onreadystatechange = function() {
        if (first && txtFile.readyState == READY) {
            first = false;
            callback(JSON.parse(txtFile.responseText));
        }
    };
    txtFile.send(null);
}

// Resets a context to the standard transform and clears it.
function reset_context(context) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

// Draws a pix field at the current position of the context rotated.
function render_pix_field(context, pix, angle) {
    context.rotate(angle);
    pix.forEach(function(p) {
        context.save();
        context.translate(p[0], p[1]);
        context.rotate(-angle);
        context.fillStyle = p[2];
        context.fillRect(-0.5, -0.5, 1, 1);
        context.restore();
    });
}

// UI entry points

// Pulls values from the UI and redraws
function refresh() {
    Viewer.draw(
        document.getElementById("pix-field-select").value,
        document.getElementById("zoom").value,
        document.getElementById("rotate").value);
}

window.onload = function() {
    read_json("data.json", function(data) {
        Viewer.init(document.getElementById("canvas"), data, 800);
        var select = document.getElementById("pix-field-select");
        for (var prop in data) {
            if (data[prop].pix) {
                select.options[select.options.length] = new Option(prop, prop);
            }
        }
        select.options[0].selected = true;
        refresh();
    });
};
