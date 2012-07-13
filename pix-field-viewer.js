
var Viewer = function() {
    // private variables
    var _canvas = {},
        _context = {},
        _width = 800,
        _height = 800;
    
    var _reset = function() {
        _context.setTransform(1, 0, 0, 1, 0, 0);
        _context.clearRect(0, 0, _width, _height);
    };

    return {
        data : {},
        
        current : "",
        
        transform : {
            zoom : 10,
            rotate : 0
        },
        
        init : function(canvas) {            
            _canvas = canvas;    
            canvas.width = _width;
            canvas.height = _height; 
            _context = _canvas.getContext("2d");
            _reset();
        },
        
        draw : function() {
            _reset();
            _context.fillStyle = "black";
            _context.fillRect(0, 0, _width, _height);
            _context.translate(_width / 2, _height / 2);
            _context.scale(this.transform.zoom, this.transform.zoom);
            
            render_pix_field(_context, this.data[this.current].pix, this.transform.rotate * Math.PI / 180);            
        }
    };
}();

function refresh() {
    Viewer.transform.zoom = document.getElementById("zoom").value;
    Viewer.transform.rotate = document.getElementById("rotate").value;
    Viewer.current = document.getElementById("pix-field-select").value;
    Viewer.draw();
}

function read(path, callback) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", path, true);
    txtFile.onreadystatechange = function() {
        callback(txtFile.responseText); 
    };
    txtFile.send(null);
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

window.onload = function() {
    Viewer.init(document.getElementById("canvas"));
    read("data.json", function(text) {
        var select = document.getElementById("pix-field-select");
        if (text && text.length > 0 && select && select.options.length === 0) {
            var data = JSON.parse(text);
            Viewer.data = data;
            for (var prop in data) {
                if (data[prop].pix) {
                    select.options[select.options.length] = new Option(prop, prop);
                }
            }
            select.options[0].selected = true;
            refresh();
        }
    });
};
