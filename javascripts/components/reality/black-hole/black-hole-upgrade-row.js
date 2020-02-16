"use strict";

Vue.component("black-hole-upgrade-row", {
  props: {
    blackHole: Object
  },
  data() {
    return {
      isUnlocked: false
    };
  },
  computed: {
    intervalConfig() {
      return {
        upgrade: this.blackHole.intervalUpgrade,
        description: "Reduce the black hole inactive time by 20%",
        effectTitle: "Current interval",
        formatEffect: value => `${TimeSpan.fromSeconds(value).toStringShort(false)}`
      };
    },
    powerConfig() {
      return {
        upgrade: this.blackHole.powerUpgrade,
        description: "Make the black hole 35% stronger",
        effectTitle: "Current power",
        formatEffect: value => `${formatX(value, 2, 2)}`
      };
    },
    durationConfig() {
      return {
        upgrade: this.blackHole.durationUpgrade,
        description: "Extend the black hole duration by 30%",
        effectTitle: "Current duration",
        formatEffect: value => `${TimeSpan.fromSeconds(value).toStringShort(false)}`
      };
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.blackHole.isUnlocked;
    }
  },
  template: `
    <div v-if="isUnlocked" class="l-black-hole-upgrade-grid__row">
      <black-hole-upgrade-button :config="intervalConfig" />
      <black-hole-upgrade-button :config="powerConfig" />
      <black-hole-upgrade-button :config="durationConfig" />
    </div>
  `
});