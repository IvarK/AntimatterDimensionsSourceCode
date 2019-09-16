"use strict";

Vue.component("normal-dim-tab", {
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
      const isChallengePowerVisible = isC2Running || isC3Running;
      this.isChallengePowerVisible = isChallengePowerVisible;
      if (isChallengePowerVisible) {
        const c2Power = `${(player.chall2Pow * 100).toFixed(2)}%`;
        const c3Power = `${this.shortenRateOfChange(player.chall3Pow.times(100))}%`;
        if (isC2Running && isC3Running) {
          this.challengePower = `Production: ${c2Power}, First dimension: ${c3Power}`;
        } else if (isC2Running) {
          this.challengePower = `Production: ${c2Power}`;
        } else if (isC3Running) {
          this.challengePower = `First dimension: ${c3Power}`;
        }
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
    `<div class="l-old-ui-normal-dim-tab">
      <span v-if="isSacrificeUnlocked">Sacrifice multiplier: {{ formatX(currentSacrifice, 2, 2) }}</span>
      <normal-dim-tab-header />
      <span v-if="isChallengePowerVisible">{{challengePower}}</span>
      <div class="l-normal-dim-tab__row-container l-normal-dim-row-container">
        <normal-dim-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :floatingText="$viewModel.tabs.dimensions.normal.floatingText[tier]"
        />
        <normal-dim-shift-row />
        <normal-dim-galaxy-row />
      </div>
      <primary-button
        v-if="isQuickResetAvailable"
        class="o-primary-btn--quick-reset"
        @click="quickReset"
      >Lose a reset, returning to the start of the reset</primary-button>
      <div style="flex: 1 0" />
      <normal-dim-tab-progress-bar class="l-normal-dim-tab__progress_bar" />
    </div>`
});
