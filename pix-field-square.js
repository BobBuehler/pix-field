pix_field_lib.create_square = function(x, y, radius) {
  return {
    x : x,
    y : y,
    radius : radius,
    get_top : function() {
      return this.y - radius;
    },
    get_right : function() {
      return this.x + radius;
    },
    get_bottom : function() {
      return this.y + radius;
    },
    get_left : function() {
      return this.x - radius;
    },
    contains : function(x, y) {
      return x > this.get_left() && x < this.get_right() && y > this.get_top() && y < this.get_bottom();
    }
  };
};