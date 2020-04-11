"use strict";

Vue.component("black-hole-unlock-button", {
  data() {
    return {
      canBeUnlocked: false,
    };
  },
  computed: {
    classObject() {
      return {
        "c-reality-upgrade-btn--unavailable": !this.canBeUnlocked
      };
    },
  },
  methods: {
    update() {
      this.canBeUnlocked = BlackHoles.canBeUnlocked;
    },
    unlock() {
      BlackHoles.unlock();
    }
  },
  template: `
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn c-reality-upgrade-btn--black-hole-unlock"
      @click="unlock"
    >
      Unleash the Black Hole
      <br>
      Cost: {{formatInt(100)}} RM
    </button>
  `
});