if (!pix_field) { var pix_field = {}; }
if (!pix_field.lib) { pix_field.lib = {}; }

// return is equivalent to angle and in the range (-PI,PI]
pix_field.lib.bound_angle = function(angle) {
  while (angle > Math.PI) {
    angle -= Math.TwoPI;
  }
  while (angle <= -Math.PI) {
    angle += Math.TwoPI;
  }
  return angle;
};

// arc = [start,end]
//   end is clockwise of start
// return = true|false
pix_field.lib.arc_contains_angle = function(arc, angle) {
  var start = pix_field.lib.bound_angle(arc[0]);
  var end = pix_field.lib.bound_angle(arc[1]);
  angle = pix_field.lib.bound_angle(angle);

  if (start < end) {
    return start <= angle && angle <= end;
  } else {
    return start <= angle || angle <= end;
  }
};

// rectangle = [left,top,right,bottom]
// point = [x, y]
pix_field.lib.rectangle_contains_point = function(rectangle, point) {
  return rectangle[0] <= point[0] && point[0] <= rectangle[2] && rectangle[1] <= point[1] && point[1] <= rectangle[3];
};

// rectangle = [left,top,right,bottom]
// point = [x, y]
// return = [start,end]
//   end is clockwise of start
pix_field.lib.project_rectectangle_to_arc_around_point = function(rectangle, point) {
  var x = point[0];
  var y = point[1];
  var left = rectangle[0];
  var top = rectangle[1];
  var right = rectangle[2];
  var bottom = rectangle[3];

  if (x < left) { // left
    if (y < top) { // top
      return [Math.atan2(top - y, right - x), Math.atan2(bottom - y, left - x)];
    } else if (y > bottom) { // bottom
      return [Math.atan2(top - y, left - x), Math.atan2(bottom - y, right - x)];
    } else { // center
      return [Math.atan2(top - y, left - x), Math.atan2(bottom - y, left - x)];
    }
  } else if (x > right) { // right
    if (y < top) { // top
      return [Math.atan2(bottom - y, right - x), Math.atan2(top - y, left - x)];
    } else if (y > bottom) { // bottom
      return [Math.atan2(bottom - y, left - x), Math.atan2(top - y, right - x)];
    } else { // center
      return [Math.atan2(bottom - y, right - x), Math.atan2(top - y, right - x)];
    }
  } else { // center
    if (y < top) { // top
      return [Math.atan2(top - y, right - x), Math.atan2(top - y, left - x)];
    } else if (y > bottom) { // bottom
      return [Math.atan2(bottom - y, left - x), Math.atan2(bottom - y, right - x)];
    } else { // center
      return [-Math.PI, Math.PI];
    }
  }
};

// segment = [[x0,y0],[x1,y1]]
// x = 0 if undefined
// return [x,y] | false
pix_field.lib.find_x_intersect_of_segment = function(segment, x) {
  if (!x) {
    x = 0;
  }
  if (segment[0][0] == x) {
    return segment[0];
  } else if (segment[1][0] == x) {
    return segment[1];
  } else {
    var percent = pix_field.lib.get_percent_between(segment[0][0], segment[1][0], x);
    if (percent > 0 && percent < 1) {
      var y = pix_field.lib.at_percent_between(segment[0][1], segment[1][1], percent);
      return [x, y];
    } else {
      return false;
    }
  }
};

// segment = [[x0,y0],[x1,y1]]
// y = 0 if undefined
// return [x,y] | false
pix_field.lib.find_y_intersect_of_segment = function(segment, y) {
  if (!y) {
    y = 0;
  }
  if (segment[0][1] == y) {
    return segment[0];
  } else if (segment[1][1] == y) {
    return segment[1];
  } else {
    var percent = pix_field.lib.get_percent_between(segment[0][1], segment[1][1], y);
    if (percent > 0 && percent < 1) {
      var x = pix_field.lib.at_percent_between(segment[0][0], segment[1][0], percent);
      return [x, y];
    } else {
      return false;
    }
  }
};

// segment = [[x0,y0],[x1,y1]]
// rectangle = [left,top,right,bottom]
// return [x,y] | false
//   [x,y] is the position along the line segment that it intersects with the rectangle.
//   false if the segment does not intersect.
pix_field.lib.find_intersect_of_segment_and_rectangle = function(segment, rectangle) {
  if (pix_field.lib.rectangle_contains_point(rectangle, segment[0])) {
    return segment[0];
  }

  var x0 = segment[0][0];
  var y0 = segment[0][1];
  var x1 = segment[1][0];
  var y1 = segment[1][1];
  var left = rectangle[0];
  var top = rectangle[1];
  var right = rectangle[2];
  var bottom = rectangle[3];

  var intersect = false;
  if (x0 <= left && x1 > left) {
    intersect = pix_field.lib.find_x_intersect_of_segment(segment, left);
  } else if (y0 <= top && y1 > top) {
    intersect = pix_field.lib.find_y_intersect_of_segment(segment, top);
  } else if (x0 >= right && x1 < right) {
    intersect = pix_field.lib.find_x_intersect_of_segment(segment, right);
  } else if (y0 >= bottom && y1 < bottom) {
    intersect = pix_field.lib.find_x_intersect_of_segment(segment, bottom);
  }
  if (intersect !== false && pix_field.lib.rectangle_contains_point(rectangle, intersect)) {
    return intersect;
  }
  return false;
};
