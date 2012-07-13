// All viewer state needed to draw

var Viewer = function() {
    var _canvas = {},
        _context = {};

    return {
        data : {},
        
        current : "",
        
        transform : {
            zoom : 10,
            rotate : 0
        },
        
        init : function(canvas, size) {            
            _canvas = canvas;    
            _canvas.width = size;
            _canvas.height = size; 
            _context = _canvas.getContext("2d");
        },
        
        draw : function() {
            // Clear to black, move to center, and zoom
            reset_context(_context);
            _context.fillStyle = "black";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            _context.translate(_canvas.width / 2, _canvas.height / 2);
            _context.scale(this.transform.zoom, this.transform.zoom);
            
            render_pix_field(_context, this.data[this.current].pix, this.transform.rotate * Math.PI / 180);            
        }
    };
}();

// Reusable JS methods

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

function reset_context(context) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

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

function refresh() {
    Viewer.transform.zoom = document.getElementById("zoom").value;
    Viewer.transform.rotate = document.getElementById("rotate").value;
    Viewer.current = document.getElementById("pix-field-select").value;
    Viewer.draw();
}

window.onload = function() {
    Viewer.init(document.getElementById("canvas"), 800);
    
    read_json("data.json", function(data) {
        Viewer.data = data;
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
