"use strict";

Vue.component("normal-dim-tab-header", {
  data() {
    return {
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0)
    };
  },
  computed: {
    sacrificeTooltip() {
      return `Boosts 8th Dimension by ${formatX(this.sacrificeBoost, 2, 2)}`;
    },
  },
  methods: {
    update() {
      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    maxAll() {
      maxAll();
    }
  },
  template:
    `<div class="l-normal-dim-tab__header">
      Sacrifice multiplier: {{ formatX(currentSacrifice, 2, 2) }}
      <primary-button
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable"
        class="o-primary-btn--sacrifice"
        @click="sacrifice"
      >Dimensional Sacrifice ({{ formatX(sacrificeBoost, 2, 2) }})</primary-button>
      <primary-button
        class="o-primary-btn--buy-max"
        @click="maxAll"
      >Max all (M)</primary-button>
    </div>`
});
