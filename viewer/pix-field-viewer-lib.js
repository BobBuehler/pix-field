var pix_field_viewer_lib = {
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
  reset_context : function(context, fillStyle) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    if (fillStyle) {
      context.fillStyle = fillStyle;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    } else {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
  },

  render_pix_array : function(context, pix_array, angle) {
    context.save();
    context.rotate(angle);
    pix_array.forEach(function(p) {
      context.save();
      context.translate(p[0], p[1]);
      context.rotate(-angle);
      context.fillStyle = p[2];
      context.fillRect(-0.5, -0.5, 1, 1);
      context.restore();
    });
    context.restore();
  }
};