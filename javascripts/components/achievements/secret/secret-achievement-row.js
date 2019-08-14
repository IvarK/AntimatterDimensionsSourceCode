"use strict";

Vue.component("secret-achievement-row", {
  props: {
    row: Number
  },
  data() {
    return {
      isCompleted: false
    };
  },
  computed: {
    classObject() {
      return {
        "l-achievement-grid__row": true,
        "c-achievement-grid__row--completed": this.isCompleted
      };
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.updateState();
  },
  methods: {
    updateState() {
      const unlockState = Array.range(1, 8).map(i => SecretAchievement(this.row * 10 + i).isUnlocked);
      this.isCompleted = !unlockState.includes(false);
    }
  },
  template:
    `<div :class="classObject">
      <secret-achievement
        v-for="column in 8"
        :key="column"
        :row="row"
        :column="column"
        class="l-achievement-grid__cell"
      />
    </div>`
});
