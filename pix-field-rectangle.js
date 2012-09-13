if (!pix_field) { var pix_field = {}; }

// A drawable rectangle that stores many calculated properties.
pix_field.create_rectangle = function(left, top, right, bottom) {
  return {
    left: left,
    top: top,
    right: right,
    bottom: bottom,
    center: [(left + right) / 2, (top + bottom) / 2],
    width: right - left,
    height: bottom - top,
    array: [left, top, right, bottom],
    contains: function(point) {
      return pix_field.lib.rectangle_contains_point(this.array, point);
    },
    intersects_segment: function(segment) {
      return pix_field.lib.find_intersect_of_segment_and_rectangle(segment, this.array) !== false;
    },
    arc_project_around_point: function(point) {
      return pix_field.lib.project_rectangle_to_arc_around_point(this.array, point);
    },
    draw : function(context, fillStyle) {
      context.fillStyle = fillStyle;
      context.fillRect(this.left, this.top, this.width, this.height);
    },
    draw_here : function(context, fillStyle) {
      context.fillStyle = fillStyle;
      context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
  };
};

// Returns a rectangle with x and y properties defining the center.
pix_field.create_square = function(x, y, radius) {
  var square = pix_field.create_rectangle(x - radius, y - radius, x + radius, y + radius);
  square.x = x;
  square.y = y;
  return square;
};
