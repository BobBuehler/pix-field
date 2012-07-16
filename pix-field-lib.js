var pix_field_lib = function() {
    return {
        // Grab json, parse, and call me back. No callback on error.
        read_json : function(path, callback) {
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
        },
        
        // Resets a context to the standard transform and clears it.
        reset_context : function(context) {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        },
        
        // parses a comma separated list of arrays
        parse : function(pix_text) {
            return JSON.parse('{"pix":[' + pix_text + ']}').pix;
        },
        
        to_string : function(pix) {
            var buf = [];
            pix.forEach(function(p) {
                buf[buf.length] = '[' + p[0] + ',' + p[1] + ',"' + p[2] + '"]';
            });
            return buf.join(',\n');
        },
        
        // Draws a pix field at the current position of the context, rotated.
        render : function(context, pix, angle) {
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
    };
}();
