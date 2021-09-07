"use strict";

Vue.component("new-dimensions-tab", {
  data() {
    return {
      hasDimensionBoosts: false,
      buyUntil10: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      buy10Mult: new Decimal(0),
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      multiplierText: "",
      disabledCondition: "",
      isQuickResetAvailable: false,
      hasContinuum: false,
      isContinuumActive: false,
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
    // Toggle single/10 without Continuum, otherwise cycle through all 3 if it's unlocked
    changeBuyMode() {
      if (!this.hasContinuum) {
        player.buyUntil10 = !player.buyUntil10;
        return;
      }
      // "Continuum" => "Until 10" => "Buy 1" => "Continuum"
      if (this.isContinuumActive) {
        player.auto.disableContinuum = true;
        player.buyUntil10 = true;
      } else if (player.buyUntil10) {
        player.buyUntil10 = false;
      } else {
        player.auto.disableContinuum = false;
      }
    },
    getUntil10Display() {
      if (this.isContinuumActive) return "Continuum";
      return this.buyUntil10 ? "Until 10" : "Buy 1";
    },
    update() {
      this.hasDimensionBoosts = player.dimensionBoosts > 0;
      this.buyUntil10 = player.buyUntil10;
      this.hasContinuum = Laitela.continuumUnlocked;
      this.isContinuumActive = Laitela.continuumActive;
      this.isQuickResetAvailable = Player.isInAntimatterChallenge && Player.antimatterChallenge.isQuickResettable;

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.buy10Mult.copyFrom(AntimatterDimensions.buyTenMultiplier);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;

      this.multiplierText = `Buy 10 Dimension purchase multiplier: ${formatX(this.buy10Mult, 2, 1)}`;
      if (this.isSacrificeUnlocked) this.multiplierText +=
        ` | Dimensional Sacrifice multiplier: ${formatX(this.currentSacrifice, 2, 2)}`;
    },
  },
  template: `
    <div class="l-antimatter-dim-tab">
      <div class="modes-container">
        <button class="o-primary-btn" @click="changeBuyMode" style="width: 100px; height: 30px; padding: 0;">
          {{ getUntil10Display() }}
        </button>
        <primary-button
          v-show="isSacrificeUnlocked"
          v-tooltip="sacrificeTooltip"
          :enabled="isSacrificeAffordable"
          class="o-primary-btn--sacrifice"
          @click="sacrifice"
        >
          <span v-if="isSacrificeAffordable">Dimensional Sacrifice ({{ formatX(sacrificeBoost, 2, 2) }})</span>
          <span v-else>Dimensional Sacrifice Disabled ({{ disabledCondition }})</span>
        </primary-button>
        <button class="o-primary-btn" @click="maxAll" style="width: 100px; height: 30px; padding: 0;">
          Max All (M)
        </button>
      </div>
      <span>{{ multiplierText }}</span>
      <new-tickspeed-row />
      <div class="l-dimensions-container">
        <new-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
        />
      </div>
      <div class="resets-container">
        <new-dim-boost-row />
        <primary-button
          v-if="isQuickResetAvailable"
          class="o-primary-btn--quick-reset"
          onclick="softReset(-1, true, true)"
        >
          Perform a Dimension Boost reset
          <span v-if="hasDimensionBoosts"> but lose a Dimension Boost</span>
          <span v-else> for no gain</span>
        </primary-button>
        <new-galaxy-row />
      </div>
      <antimatter-dim-tab-progress-bar />
    </div>`
});
