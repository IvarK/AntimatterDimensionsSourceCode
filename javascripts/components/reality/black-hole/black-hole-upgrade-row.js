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
    blackHoleDescription() {
      if (RealityUpgrade(20).isBought) {
        return `Black Hole ${this.blackHole.id}`;
      }
      return "the Black Hole";
    },
    intervalConfig() {
      return {
        upgrade: this.blackHole.intervalUpgrade,
        description: () => `Reduce ${this.blackHoleDescription} inactive time by 20%`,
        effectTitle: "Current interval",
        formatEffect: value => `${TimeSpan.fromSeconds(value).toStringShort(false)}`
      };
    },
    powerConfig() {
      return {
        upgrade: this.blackHole.powerUpgrade,
        description: () => `Make ${this.blackHoleDescription} 35% stronger`,
        effectTitle: "Current power",
        formatEffect: value => `${formatX(value, 2, 2)}`
      };
    },
    durationConfig() {
      return {
        upgrade: this.blackHole.durationUpgrade,
        description: () => `Extend ${this.blackHoleDescription} duration by 30%`,
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