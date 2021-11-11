"use strict";

Vue.component("antimatter-dim-tab", {
  data() {
    return {
      isInMatterChallenge: false,
      matter: new Decimal(0),
      hasDimensionBoosts: false,
      isChallengePowerVisible: false,
      challengePower: "",
      isQuickResetAvailable: false,
      isSacrificeUnlocked: false,
      buy10Mult: new Decimal(0),
      currentSacrifice: new Decimal(0),
      multiplierText: "",
    };
  },
  methods: {
    update() {
      this.isInMatterChallenge = Player.isInMatterChallenge;
      if (this.isInMatterChallenge) {
        this.matter.copyFrom(Currency.matter.value);
      }
      this.hasDimensionBoosts = player.dimensionBoosts > 0;
      const isC2Running = NormalChallenge(2).isRunning;
      const isC3Running = NormalChallenge(3).isRunning;
      const isIC6Running = InfinityChallenge(6).isRunning;
      const isIC8Running = InfinityChallenge(8).isRunning;
      const isChallengePowerVisible = isC2Running || isC3Running || isIC6Running || isIC8Running;
      this.isChallengePowerVisible = isChallengePowerVisible;
      if (isChallengePowerVisible) {
        const powerArray = [];
        if (isC2Running) powerArray.push(`Production: ${formatPercents(player.chall2Pow, 2, 2)}`);
        if (isC3Running) powerArray.push(`First dimension: ${formatX(player.chall3Pow, 3, 4)}`);
        if (isIC6Running) powerArray.push(`Matter: /
          ${format(new Decimal(1).timesEffectOf(InfinityChallenge(6)), 2, 2)}`);
        if (isIC8Running) powerArray.push(`Production: /
          ${format(new Decimal(1).timesEffectOf(InfinityChallenge(8)).reciprocal(), 2, 2)}`);
        this.challengePower = powerArray.join(", ");
      }
      this.isQuickResetAvailable = Player.isInAntimatterChallenge && Player.antimatterChallenge.isQuickResettable;
      this.isSacrificeUnlocked = Sacrifice.isVisible;
      this.buy10Mult.copyFrom(AntimatterDimensions.buyTenMultiplier);
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);

      this.multiplierText = `Buy 10 Dimension purchase multiplier: ${formatX(this.buy10Mult, 2, 1)}`;
      if (this.isSacrificeUnlocked) this.multiplierText +=
        ` | Dimensional Sacrifice multiplier: ${formatX(this.currentSacrifice, 2, 2)}`;
    },
    quickReset() {
      softReset(-1, true, true);
    }
  },
  template: `
    <div class="l-old-ui-antimatter-dim-tab">
      <span>{{ multiplierText }}</span>
      <antimatter-dim-tab-header />
      <span v-if="isInMatterChallenge">There is {{ format(matter, 2, 1) }} matter.</span>
      <span v-if="isChallengePowerVisible">{{ challengePower }}</span>
      <div class="l-dimensions-container">
        <antimatter-dim-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
        />
        <antimatter-dim-boost-row />
        <antimatter-dim-galaxy-row />
      </div>
      <primary-button
        v-if="isQuickResetAvailable"
        class="o-primary-btn--quick-reset"
        @click="quickReset"
      >
        Perform a Dimension Boost reset
        <span v-if="hasDimensionBoosts"> but lose a Dimension Boost</span>
        <span v-else> for no gain</span>
      </primary-button>
      <div style="flex: 1 0" />
      <antimatter-dim-tab-progress-bar class="l-antimatter-dim-tab__progress_bar" />
    </div>`
});
