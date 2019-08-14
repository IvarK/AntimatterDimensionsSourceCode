Vue.component('normal-dim-tab', {
  data: function() {
    return {
      isChallengePowerVisible: false,
      challengePower: String.empty,
      isQuickResetAvailable: false
    };
  },
  methods: {
    update() {
      const isC2Running = Challenge(2).isRunning;
      const isC3Running = Challenge(3).isRunning;
      const isChallengePowerVisible = isC2Running || isC3Running;
      this.isChallengePowerVisible = isChallengePowerVisible;
      if (isChallengePowerVisible) {
        const c2Power = `${(player.chall2Pow * 100).toFixed(2)}%`;
        const c3Power = `${this.shortenRateOfChange(player.chall3Pow.times(100))}%`;
        if (isC2Running && isC3Running) {
          this.challengePower = `Production: ${c2Power}, First dimension: ${c3Power}`;
        }
        else if (isC2Running) {
          this.challengePower = `Production: ${c2Power}`;
        }
        else if (isC3Running) {
          this.challengePower = `First dimension: ${c3Power}`;
        }
      }
      const challenge = Challenge.current();
      const infinityChallenge = InfinityChallenge.current();
      this.isQuickResetAvailable = challenge !== undefined && challenge.isQuickResettable ||
        infinityChallenge !== undefined && infinityChallenge.isQuickResettable;
    },
    quickReset: function() {
      quickReset();
    }
  },
  template:
    `<div class="l-normal-dim-tab">
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
      <normal-dim-tab-progress-bar class="l-normal-dim-tab__progress_bar" />
    </div>`
});