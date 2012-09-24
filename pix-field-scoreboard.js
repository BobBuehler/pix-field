if (!pix_field) { var pix_field = {}; }

// A score board with numerical value and message.
pix_field.create_scoreboard = function() {
  var target_desciptors = [
    "targets",
    "boxes",
    "squares",
    "objectives",
    "thingies"
  ];
  var action_descriptors = [
    "completed",
    "shot",
    "killed",
    "sent to hell",
    "removed",
    "done"
  ];
  return {
    value: 0,
    text: "",
    add_kill: function() {
      this.value += 1;
      if (this.value === 1) {
        this.text = "1 target complete.";
      } else {
        this.text = "" + this.value +
            " " + target_desciptors[Math.floor(Math.random() * target_desciptors.length)] +
            " " + action_descriptors[Math.floor(Math.random() * action_descriptors.length)] + ".";
      }
    }
  };
};