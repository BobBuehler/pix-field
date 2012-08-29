if (!pix_field) { var pix_field = {}; }

// A square area
pix_field.create_square = function(x, y, radius) {
  return {
    x: x,
    y: y,
    radius: radius,
    diameter: radius * 2,
    left: x - radius,
    top: y - radius,
    right: x + radius,
    bottom: y + radius,
    to_rectangle: function() {
      return [this.left, this.top, this.right, this.bottom];
    },
    contains: function(point) {
      return pix_field.lib.rectangle_contains_point(this.to_rectangle(), point);
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