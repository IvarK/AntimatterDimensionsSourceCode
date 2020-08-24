"use strict";

Vue.component("antimatter-dim-tab", {
  data() {
    return {
      isChallengePowerVisible: false,
      challengePower: "",
      isQuickResetAvailable: false,
      isSacrificeUnlocked: false,
      currentSacrifice: new Decimal(0),
    };
  },
  methods: {
    update() {
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
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      this.isQuickResetAvailable = challenge && challenge.isQuickResettable;
      this.isSacrificeUnlocked = Sacrifice.isVisible;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
    },
    quickReset() {
      softReset(-1, true, true);
    }
  },
  template:
    `<div class="l-old-ui-antimatter-dim-tab">
      <span v-if="isSacrificeUnlocked">Sacrifice multiplier: {{ formatX(currentSacrifice, 2, 2) }}</span>
      <antimatter-dim-tab-header />
      <span v-if="isChallengePowerVisible">{{challengePower}}</span>
      <div class="l-dimensions-container">
        <antimatter-dim-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :floatingText="$viewModel.tabs.dimensions.antimatter.floatingText[tier]"
        />
        <antimatter-dim-boost-row />
        <antimatter-dim-galaxy-row />
      </div>
      <primary-button
        v-if="isQuickResetAvailable"
        class="o-primary-btn--quick-reset"
        @click="quickReset"
      >Lose a reset, returning to the start of the reset</primary-button>
      <div style="flex: 1 0" />
      <antimatter-dim-tab-progress-bar class="l-antimatter-dim-tab__progress_bar" />
    </div>`
});
