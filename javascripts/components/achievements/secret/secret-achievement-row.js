"use strict";

Vue.component("secret-achievement-row", {
  props: {
    /** @type SecretAchievementState[] */
    row: {
      type: Array,
      required: true
    }
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
  methods: {
    update() {
      this.isCompleted = this.row.every(a => a.isUnlocked);
    }
  },
  template: `
    <div :class="classObject">
      <secret-achievement
        v-for="(achievement, i) in row"
        :key="i"
        :achievement="achievement"
        class="l-achievement-grid__cell"
      />
    </div>`
});
