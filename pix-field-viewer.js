var Viewer = function() {
    var _canvas = {},
        _context = {},
        _data = {};

    return {
        // Store the values that only the Viewer should modify
        init : function(canvas, data) {
            _canvas = canvas;    
            _data = data;
            _context = _canvas.getContext("2d");
        },
        
        // Clear to black, move to center, zoom, and draw
        draw : function(name, zoom, rotate) {
            pix_field_lib.reset_context(_context);
            _context.fillStyle = "black";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            _context.translate(_canvas.width / 2, _canvas.height / 2);
            _context.scale(zoom, zoom);
            pix_field_lib.render(_context, _data[name].pix, rotate * Math.PI / 180);            
        },
        
        pix_string : function(name) {
            return pix_field_lib.to_string(_data[name].pix);
        },
        
        pix_parse : function(name, text) {
            _data[name].pix = pix_field_lib.parse(text);
        }
    };
}();

// Pulls values from the UI and redraws
function refresh() {
    Viewer.draw(
        document.getElementById("select").value,
        document.getElementById("zoom").value,
        document.getElementById("rotate").value);
}

function change_select() {
    var name = document.getElementById("select").value;
    document.getElementById("pix").value = Viewer.pix_string(name);
    refresh();
}

function change_text() {
    try {
        Viewer.pix_parse(
            document.getElementById("select").value,
            document.getElementById("pix").value);
        refresh();
    } catch (err) {
    }
}

window.onload = function() {
    pix_field_lib.read_json("data.json", function(data) {
        Viewer.init(document.getElementById("canvas"), data);
        var select = document.getElementById("select");
        for (var prop in data) {
            if (data[prop].pix) {
                select.options[select.options.length] = new Option(prop, prop);
            }
        }
        select.options[0].selected = true;
        change_select();
    });
};
