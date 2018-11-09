Vue.component("challenge-box", {
  props: {
    name: String,
    isUnlocked: false,
    isRunning: false,
    isCompleted: false
  },
  computed: {
    buttonClassObject: function() {
      const classObject = {
        "o-challenge-btn": true
      };
      if (this.isRunning) {
        classObject["o-challenge-btn--running"] = true;
      }
      else if (this.isCompleted) {
        classObject["o-challenge-btn--completed"] = true;
      }
      else if (this.isUnlocked) {
        classObject["o-challenge-btn--unlocked"] = true;
      }
      else {
        classObject["o-challenge-btn--locked"] = true;
      }
      return classObject;
    },
    buttonText: function() {
      if (this.isRunning) return "Running";
      if (this.isCompleted) return "Completed";
      if (this.isUnlocked) return "Start";
      return "Locked";
    }
  },
  template:
    `<div class="c-challenge-box l-challenge-box">
      <hint-text>{{name}}</hint-text>
      <slot name="top" />
      <div class="l-challenge-box__fill" />
      <button
        :class="buttonClassObject"
        @click="$emit('start')"
      >{{buttonText}}</button>
      <slot name="bottom" />
    </div>`
});