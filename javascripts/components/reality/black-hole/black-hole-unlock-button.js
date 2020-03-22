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
    tooltip: () => "The black hole makes the game run significantly faster " +
      "for a short period of time. Starts at 180x faster for 10 seconds, once per hour."
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
      :ach-tooltip="tooltip"
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn c-reality-upgrade-btn--black-hole-unlock"
      @click="unlock"
    >
      Unleash the Black Hole
      <br>
      Cost: {{formatInt(50)}} RM
    </button>
  `
});