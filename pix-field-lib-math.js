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
