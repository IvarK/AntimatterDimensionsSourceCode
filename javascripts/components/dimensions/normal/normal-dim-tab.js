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
      const isC2Running = player.currentChallenge === "challenge2";
      const isC3Running = player.currentChallenge === "challenge3";
      const isIC1Running = player.currentChallenge === "postc1";
      const isChallengePowerVisible = isC2Running || isC3Running || isIC1Running;
      this.isChallengePowerVisible = isChallengePowerVisible;
      if (isChallengePowerVisible) {
        const c2Power = `${(player.chall2Pow * 100).toFixed(2)}%`;
        const c3Power = `${this.shorten(player.chall3Pow * 100)}%`;
        if (isIC1Running) {
          this.challengePower = `Production: ${c2Power}, First dimension: ${c3Power}`;
        }
        if (isC2Running) {
          this.challengePower = `Production: ${c2Power}`;
        }
        if (isC3Running) {
          this.challengePower = `First dimension: ${c3Power}`;
        }
      }
      this.isQuickResetAvailable = isQuickResettable(player.currentChallenge);
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