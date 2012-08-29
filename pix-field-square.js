if (!pix_field) { var pix_field = {}; }

// A square area
pix_field.create_square = function(x, y, radius) {
  var left = x - radius,
      top = y - radius,
      right = x + radius,
      bottom = y + radius;

  return {
    x: x,
    y: y,
    radius: radius,
    diameter: radius * 2,
    left: left,
    top: top,
    right: right,
    bottom: bottom,
    rectangle: [left, top, right, bottom],
    contains: function(point) {
      return pix_field.lib.rectangle_contains_point(this.rectangle, point);
    },
    intersects_segment: function(segment) {
      return pix_field.lib.find_intersect_of_segment_and_rectangle(segment, this.rectangle) !== false;
    },
    arc_project_around_point: function(point) {
      return pix_field.lib.project_rectectangle_to_arc_around_point(this.rectangle, point);
    },
    draw : function(context, fillStyle) {
      context.fillStyle = fillStyle;
      context.fillRect(this.left, this.top, this.diameter, this.diameter);
    },
    draw_here : function(context, fillStyle) {
      context.fillStyle = fillStyle;
      context.fillRect(-this.radius, -this.radius, this.diameter, this.diameter);
    }
  };
};