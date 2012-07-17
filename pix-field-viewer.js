var Viewer = function() {
    var _canvas,
        _context,
        _data,
        _pix_name,
        _zoom = 10,
        _zoom_min = 1,
        _zoom_max = 100,
        _rotate = 0,
        _rotate_min = -180,
        _rotate_max = 180,
        _mouse_last_position;

    return {
        init : function(canvas, data) {
            _canvas = canvas;    
            _data = data;
            _context = _canvas.getContext("2d");
        },
        
        pix_name_change : function(name) {
            _pix_name = name;
        },
        
        pix_to_string : function() {
            return pix_field_lib.stringify_pix_array(_data[_pix_name].pix);
        },
        
        pix_data_change : function(data) {
            _data[_pix_name].pix = data;
        },
        
        mouse_move : function(position, bnt1_down) {
            if (bnt1_down) {
                if (_mouse_last_position) {
                    _zoom -= position.y - _mouse_last_position.y;
                    _zoom = Math.max(Math.min(_zoom, _zoom_max), _zoom_min);
                    _rotate += position.x - _mouse_last_position.x;
                    _rotate = Math.max(Math.min(_rotate, _rotate_max), _rotate_min);
                    _mouse_last_position = position;
                }
                _mouse_last_position = position;
            } else {
                _mouse_last_position = undefined;
            }
        },
        
        draw : function() {
            pix_field_lib.reset_context(_context);
            _context.fillStyle = "black";
            _context.fillRect(0, 0, _canvas.width, _canvas.height);
            _context.translate(_canvas.width / 2, _canvas.height / 2);
            _context.scale(_zoom, _zoom);
            pix_field_lib.render_pix_array(_context, _data[_pix_name].pix, _rotate * Math.PI / 180);            
        }
    };
}();

function change_select() {
    Viewer.pix_name_change(document.getElementById("select").value);
    Viewer.draw();
    document.getElementById("pix").value = Viewer.pix_to_string();
}

function change_text() {
    Viewer.pix_data_change(pix_field_lib.parse_pix_array(document.getElementById("pix").value));
    Viewer.draw();
}

function on_mouse_move(ev) {
    Viewer.mouse_move({x : ev.offsetX, y : ev.offsetY}, ev.which === 1);
    Viewer.draw();
}

window.onload = function() {
    var canvas = document.getElementById("canvas");     
    pix_field_lib.read_json("data.json", function(data) {
        Viewer.init(canvas, data);
        var select = document.getElementById("select");
        for (var prop in data) {
            if (data[prop].pix) {
                select.options[select.options.length] = new Option(prop, prop);
            }
        }
        select.options[0].selected = true;
        change_select();
    });
    canvas.onmousemove = on_mouse_move;
};
