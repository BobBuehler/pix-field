if (!pix_field) { var pix_field = {}; }
if (!pix_field.lib) { pix_field.lib = {}; }

Math.TwoPI = Math.PI * 2;
Math.PIOverTwo = Math.PI / 2;

// Returns the value a percent of the way from a to b.
// returns a when percent == 0
// returns b when percent == 1
// percent can be outside the range [0,1]
pix_field.lib.at_percent_between = function(a, b, percent) {
  return a + (b - a) * percent;
};

// Returns the percent of the way that value is along the range [a, b].
// returns 0 when value == a
// returns 1 when value == b
pix_field.lib.get_percent_between = function(a, b, value) {
  return (value - a) / (b - a);
};

// Returns a point at a uniform random location within the rectangle at 0,0 -> width,height.
// return = [x,y]
pix_field.lib.random_point = function(width, height) {
  return [Math.random() * width, Math.random() * height];
};

// Returns a point at a uniform random location with the rectangle.
// rectangle = [left,top,right,bottom]
// return = [x,y]
pix_field.lib.random_point_in_rect = function(rectangle) {
  return [
      pix_field.lib.at_percent_between(rectangle.left, rectangle.right, Math.random()),
      pix_field.lib.at_percent_between(rectangle.top, rectangle.bottom, Math.random()),
    ];
};
