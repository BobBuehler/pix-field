if (!pix_field) { var pix_field = {}; }

// A square area
pix_field.create_square = function(x, y, radius) {
  var _x = x,
      _y = y,
      _radius = radius,
      _left = _x - _radius,
      _right = _x + _radius,
      _top = _y - _radius,
      _bottom = _y + _radius,
      _diameter = _radius * 2;
  function containsX(x) {
    return x >= _left && x <= _right;
  }
  function containsY(y) {
    return y >= _top && y <= _bottom;
  }
  function contains(x, y) {
      return containsX(x) && containsY(y);
  }
  return {
    contains : function(x, y) {
      return contains(x, y);
    },
    // Returns [0,1] indicating where on the x0y0-x1y1 line it hit.
    // -1 if no hit.
    find_hit : function(x0, y0, x1, y1) {
      // If the line segmet starts within the square, it's awlays 0
      if (contains(x0, y0)) {
        return 0;
      }
      var percent;
      if (x0 <= _left && x1 > _left) {
        percent = (_left - x0) / (x1 - x0);
        if (percent >= 0 && percent <= 1 && containsY(y0 + (y1 - y0) * percent)) {
          return percent;
        }
      }
      if (x0 >= _right && x1 < _right) {
        percent = (_right - x0) / (x1 - x0);
        if (percent >= 0 && percent <= 1 && containsY(y0 + (y1 - y0) * percent)) {
          return percent;
        }
      }
      if (y0 <= _top && y1 > _top) {
        percent = (_top - y0) / (y1 - y0);
        if (percent >= 0 && percent <= 1 && containsX(x0 + (x1 - x0) * percent)) {
          return percent;
        }
      }
      if (y0 >= _bottom && y1 < _bottom) {
        percent = (_bottom - y0) / (y1 - y0);
        if (percent >= 0 && percent <= 1 && containsX(x0 + (x1 - x0) * percent)) {
          return percent;
        }
      }
      return -1;
    },
    draw : function(context, fillStyle) {
      context.fillStyle = fillStyle;
      context.fillRect(_left, _top, _diameter, _diameter);
    },
    draw_here : function(context, fillStyle) {
      context.fillStyle = fillStyle;
      context.fillRect(-_radius, -_radius, _diameter, _diameter);
    }
  };
};