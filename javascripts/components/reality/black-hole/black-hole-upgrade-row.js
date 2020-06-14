"use strict";

Vue.component("black-hole-upgrade-row", {
  props: {
    blackHole: Object
  },
  data() {
    return {
      isUnlocked: false,
      isPermanent: false
    };
  },
  computed: {
    blackHoleDescription() {
      return this.blackHole.description(false);
    },
    intervalConfig() {
      return {
        upgrade: this.blackHole.intervalUpgrade,
        description: () => `Reduce ${this.blackHoleDescription}'s inactive time by ${formatPercents(0.2)}`,
        effectTitle: "Current interval",
        formatEffect: value => `${TimeSpan.fromSeconds(value).toStringShort(false)}`
      };
    },
    powerConfig() {
      return {
        upgrade: this.blackHole.powerUpgrade,
        description: () => `Make ${this.blackHoleDescription} ${formatPercents(0.35)} stronger`,
        effectTitle: "Current power",
        formatEffect: value => `${formatX(value, 2, 2)}`
      };
    },
    durationConfig() {
      return {
        upgrade: this.blackHole.durationUpgrade,
        description: () => `Extend ${this.blackHoleDescription}'s duration by ${formatPercents(0.3)}`,
        effectTitle: "Current duration",
        formatEffect: value => `${TimeSpan.fromSeconds(value).toStringShort(false)}`
      };
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.blackHole.isUnlocked;
      this.isPermanent = this.blackHole.isPermanent;
    }
  },
  template: `
    <div v-if="isUnlocked" class="l-black-hole-upgrade-grid__row">
      <black-hole-upgrade-button v-if="!isPermanent" :config="intervalConfig" />
      <black-hole-upgrade-button :config="powerConfig" />
      <black-hole-upgrade-button v-if="!isPermanent" :config="durationConfig" />
    </div>
  `
});