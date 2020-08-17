"use strict";

Vue.component("challenges-header", {
  data() {
    return {
      isInChallenge: false,
      isShowAllVisible: false,
      isAutoECVisible: false,
      showAllChallenges: false,
      autoEC: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
    };
  },
  watch: {
    autoEC(newValue) {
      player.reality.autoEC = newValue;
    },
    showAllChallenges(newValue) {
      player.options.showAllChallenges = newValue;
    },
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.isInChallenge = NormalChallenge.isRunning || InfinityChallenge.isRunning || EternityChallenge.isRunning;
      this.isShowAllVisible = PlayerProgress.eternityUnlocked();
      this.isAutoECVisible = Perk.autocompleteEC1.isBought;
      this.autoEC = player.reality.autoEC;
      const remainingCompletions = EternityChallenges.remainingCompletions;
      this.remainingECTiers = remainingCompletions;
      if (remainingCompletions !== 0) {
        const autoECInterval = EternityChallenges.autoComplete.interval;
        const untilNextEC = Math.max(autoECInterval - player.reality.lastAutoEC, 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC + (autoECInterval * (remainingCompletions - 1)));
      }
    },
    restartChallenge() {
      const current = NormalChallenge.current ||
        InfinityChallenge.current ||
        EternityChallenge.current;
      if (current !== undefined) {
        current.exit();
        current.start();
      }
    },
    exitChallenge() {
      const current = NormalChallenge.current ||
        InfinityChallenge.current ||
        EternityChallenge.current;
      if (current !== undefined) {
        current.exit();
      }
    },
  },
  template: `
  <div class="l-challenges-tab__header">
    <div class="c-subtab-option-container" v-if="isShowAllVisible || isAutoECVisible || isInChallenge">
      <primary-button-on-off v-if="isShowAllVisible"
        v-model="showAllChallenges"
        class="o-primary-btn--subtab-option"
        text="Show all known challenges:"
      />
      <primary-button-on-off v-if="isAutoECVisible"
        v-model="autoEC"
        class="o-primary-btn--subtab-option"
        text="Auto EC:"
      />
      <primary-button v-if="isInChallenge"
        class="o-primary-btn--subtab-option"
        @click="restartChallenge"
      >
        Restart Challenge
      </primary-button>
      <primary-button v-if="isInChallenge"
        class="o-primary-btn--subtab-option"
        @click="exitChallenge"
      >
        Exit Challenge
      </primary-button>
    </div>
    <div v-if="autoEC && isAutoECVisible && remainingECTiers > 0"
         class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info">
      <div class="l-challenges-tab__auto-ec-timers">
        <span v-if="remainingECTiers > 1">next auto EC completion: {{untilNextEC}}</span>
        <span>all auto EC completions: {{untilAllEC}}</span>
      </div>
    </div>
  </div>
  `
});
