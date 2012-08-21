var pix_field_lib = {
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

  // Returns a function(callback) for chaining animation frames.
  animation_frame_requester : function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  },

  key_state_tracker : function(element, key_down_event_name, key_up_event_name) {
    var _state = {};
    element[key_down_event_name] = function(ev) {
      _state[ev.which] = true;
    };
    element[key_up_event_name] = function(ev) {
      _state[ev.which] = false;
    };
    return {
      SPACE : 32,
      LEFT : 37,
      RIGHT : 39,
      DOWN : 40,
      get : function(key) {
        return _state[key];
      }
    };
  },

  // Capture mouse wheel
  mouse_wheel_event_handler : function(element, handler) {
    function handler_wrapper(e) {
      var evt = window.event || e;
      handler((evt.detail ? evt.detail : evt.wheelDelta) < 0 ? -1 : +1);
    }
    var mousewheelevt = (/firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    if (element.attachEvent) {
      element.attachEvent("on"+mousewheelevt, handler_wrapper);
    } else if (element.addEventListener) {
      element.addEventListener(mousewheelevt, handler_wrapper, false);
    }
  },

  // Return the angle in the range (-PI,PI]
  bound_angle : function(angle) {
    while (angle > Math.PI) {
      angle -= Math.TwoPI;
    }
    while (angle <= -Math.PI) {
      angle += Math.TwoPI;
    }
    return angle;
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

  // parses a comma separated list of arrays
  parse_pix_array : function(pix_text) {
    return JSON.parse('{"pix":[' + pix_text + ']}').pix;
  },

  // returns repeating [x,y,"color"],
  stringify_pix_array : function(pix) {
    var buf = [];
    pix.forEach(function(p) {
      buf[buf.length] = '[' + p[0] + ',' + p[1] + ',"' + p[2] + '"]';
    });
    return buf.join(',\n');
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

Math.TwoPI = Math.PI * 2;
Math.PIOverTwo = Math.PI / 2;
Math.square = function(x) { return x * x; };
