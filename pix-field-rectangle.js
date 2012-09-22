if (!pix_field) { var pix_field = {}; }

// A drawable rectangle that stores many calculated properties.
pix_field.create_rectangle = function(left, top, right, bottom) {
  return {
    0: left,
    1: top,
    2: right,
    3: bottom,
    left: left,
    top: top,
    right: right,
    bottom: bottom,
    center: [(left + right) / 2, (top + bottom) / 2],
    width: right - left,
    height: bottom - top,
    move_to: function(point) {
      this.move_by([point[0] - this.center[0], point[1] - this.center[1]]);
    },
    move_by: function(delta) {
      this[0] += delta[0];
      this[1] += delta[1];
      this[2] += delta[0];
      this[3] += delta[1];
      this.left += delta[0];
      this.top += delta[1];
      this.right += delta[0];
      this.bottom += delta[1];
      this.center[0] += delta[0];
      this.center[1] += delta[1];
    },
    contains: function(point) {
      return pix_field.lib.rectangle_contains_point(this, point);
    },
    intersects_segment: function(segment) {
      return pix_field.lib.find_intersect_of_segment_and_rectangle(segment, this) !== false;
    },
    arc_project_around_point: function(point) {
      return pix_field.lib.project_rectangle_to_arc_around_point(this, point);
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
pix_field.create_square = function(center, radius) {
  var square = pix_field.create_rectangle(center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius);
  return square;
};
