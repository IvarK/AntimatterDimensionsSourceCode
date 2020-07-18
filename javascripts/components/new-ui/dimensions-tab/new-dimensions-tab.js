"use strict";

Vue.component("new-dimensions-tab", {
  data() {
    return {
      buyUntil10: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      disabledCondition: "",
      isQuickResetAvailable: false,
      isContinuumActive: false
    };
  },
  computed: {
    sacrificeTooltip() {
      return `Boosts 8th Antimatter Dimension by ${formatX(this.sacrificeBoost, 2, 2)}`;
    },
  },
  methods: {
    maxAll() {
      maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    toggleUntil10() {
      player.buyUntil10 = !player.buyUntil10;
    },
    getUntil10Display() {
      if (this.isContinuumActive) return "Continuum";
      return this.buyUntil10 ? "Until 10" : "Buy 1";
    },
    update() {
      this.buyUntil10 = player.buyUntil10;
      this.isContinuumActive = Laitela.continuumActive;
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      this.isQuickResetAvailable = challenge && challenge.isQuickResettable;

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;
    },
  },
  template:
  `<div class="l-antimatter-dim-tab">
    <div class="modes-container">
      <button class="o-primary-btn" @click="toggleUntil10" style="width: 100px; height: 30px; padding: 0;">
        {{ getUntil10Display() }}
      </button>
      <primary-button
          v-show="isSacrificeUnlocked"
          v-tooltip="sacrificeTooltip"
          :enabled="isSacrificeAffordable"
          class="o-primary-btn sacrifice-btn"
          @click="sacrifice"
        >
        <span v-if="isSacrificeAffordable">Dimensional Sacrifice ({{ formatX(sacrificeBoost, 2, 2) }})</span>
        <span v-else>Sacrifice Disabled ({{ disabledCondition }})</span>
      </primary-button>
      <button class="o-primary-btn" @click="maxAll" style="width: 100px; height: 30px; padding: 0;">Max All (M)</button>
    </div>
    <span v-if="isSacrificeUnlocked">Sacrifice multiplier: {{ formatX(currentSacrifice, 2, 2) }}</span>
    <new-tickspeed-row/>
    <div class="l-dimensions-container">
      <new-dimension-row
        v-for="tier in 8"
        :key="tier"
        :tier="tier"/>
    </div>
    <div class="resets-container">
      <new-dim-boost-row/>
      <primary-button
          v-if="isQuickResetAvailable"
          class="o-primary-btn--quick-reset"
          onclick="softReset(-1, true, true)"
        >Lose a reset, returning to the start of the reset</primary-button>
      <new-galaxy-row/>
    </div>
    <antimatter-dim-tab-progress-bar/>
  </div>`
});
