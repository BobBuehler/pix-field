var Viewer = function() {
  var constants = {
    canvas : {},
    context : {}
  };
  var state = {
    data : {},
    pix_name : "",
    translate : {x:0, y:0},
    mouse_last_position : undefined,
    zoom : 50
  };

  function render(context, pix_field, level, angle) {
    context.save();
    context.rotate(angle);
    pix_field.pix.forEach(function(p) {
      context.save();
      context.translate(p[0], p[1]);
      context.rotate(-angle);
      if (level > 0 && pix_field[p[2]]) {
        context.scale(pix_field.scale, pix_field.scale);
        render(context, pix_field[p[2]], level - 1, angle);
      } else {
        context.fillStyle = p[2];
        context.fillRect(-0.5, -0.5, 1, 1);
      }
      context.restore();
    });
    context.restore();
  }

  return {
    init : function(canvas, data) {
      constants.canvas = canvas;
      constants.context = constants.canvas.getContext("2d");
      state.data = data;
      state.translate.x = constants.canvas.width / 2;
      state.translate.y = constants.canvas.height / 2
    },

    pix_name_change : function(name) {
      state.pix_name = name;
    },

    pix_to_string : function() {
      return JSON.stringify(state.data[state.pix_name]).split('],[').join('],\n[');
    },

    string_to_pix : function(text) {
      state.data[state.pix_name] = JSON.parse(text);
    },

    mouse_move : function(position, bnt1_down) {
      if (bnt1_down) {
        if (state.mouse_last_position) {
          state.translate.x += position.x - state.mouse_last_position.x;
          state.translate.y += position.y - state.mouse_last_position.y;
          state.mouse_last_position = position;
        }
        state.mouse_last_position = position;
      } else {
        state.mouse_last_position = undefined;
      }
    },

    draw : function() {
      pix_field_lib.reset_context(constants.context);
      constants.context.fillStyle = "black";
      constants.context.fillRect(0, 0, constants.canvas.width, constants.canvas.height);
      constants.context.translate(state.translate.x, state.translate.y);
      constants.context.scale(state.zoom, state.zoom);
      render(constants.context, state.data[state.pix_name], 1, 0);
    }
  };
}();

function change_select() {
  Viewer.pix_name_change(document.getElementById("select").value);
  document.getElementById("pix").value = Viewer.pix_to_string();
  Viewer.draw();
}

function change_text() {
  Viewer.string_to_pix(document.getElementById("pix").value);
  Viewer.draw();
}

function on_mouse_move(ev) {
  Viewer.mouse_move({x : ev.offsetX, y : ev.offsetY}, ev.which === 1);
  Viewer.draw();
}

window.onload = function() {
  pix_field_lib.read_json("level1.json", function(data) {
    var canvas = document.getElementById("canvas");
    Viewer.init(canvas, data);
    var select = document.getElementById("select");
    for (var prop in data) {
      if (data[prop].pix) {
        select.options[select.options.length] = new Option(prop, prop);
      }
    }
    select.options[0].selected = true;
    change_select();
    canvas.onmousemove = on_mouse_move;
  });
};
