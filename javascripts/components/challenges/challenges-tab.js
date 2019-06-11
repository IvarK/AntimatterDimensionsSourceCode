"use strict";

Vue.component('challenges-tab', {
  data: function() {
    return {
      isICTabUnlocked: false,
      isECTabUnlocked: false,
      isInChallenge: false,
      isShowAllVisible: false,
      isAutoECVisible: false,
      showAllChallenges: false,
      autoEC: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
      tabs: [
        {
          name: "Challenges",
          id: "Challenges",
          component: "normal-challenges-tab"
        },
        {
          name: "Infinity Challenges",
          id: "Infinity Challenges",
          component: "infinity-challenges-tab",
          condition: function() { return this.isICTabUnlocked; }.bind(this)
        },
        {
          name: "Eternity Challenges",
          id: "Eternity Challenges",
          component: "eternity-challenges-tab",
          condition: function() { return this.isECTabUnlocked; }.bind(this)
        }
      ]
    };
  },
  watch: {
    autoEC(newValue) {
      player.reality.autoEC = newValue;
    },
    showAllChallenges(newValue) {
      player.options.showAllChallenges = newValue;
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      const isECTabUnlocked = player.challenge.eternity.unlocked !== 0 ||
        Object.keys(player.eternityChalls).length > 0 ||
        player.reality.autoEC;
      this.isECTabUnlocked = isECTabUnlocked;
      const isICTabUnlocked = isECTabUnlocked ||
        player.money.gte(new Decimal("1e2000")) ||
        player.postChallUnlocked > 0;
      this.isICTabUnlocked = isICTabUnlocked;
      this.isInChallenge = NormalChallenge.isRunning || InfinityChallenge.isRunning || EternityChallenge.isRunning;
      this.isShowAllVisible = PlayerProgress.realityUnlocked && (isECTabUnlocked || isICTabUnlocked);
      this.isAutoECVisible = Perk.autocompleteEC1.isBought;
      this.autoEC = player.reality.autoEC;
      const remainingTiers = EternityChallenge.remainingTiers();
      this.remainingECTiers = remainingTiers;
      if (remainingTiers !== 0) {
        const autoECPeriod = EternityChallenge.currentAutoCompleteThreshold();
        const untilNextEC = Math.max(autoECPeriod - player.reality.lastAutoEC, 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC + (autoECPeriod * (remainingTiers - 1)));
      }
    },
    exitChallenge() {
      const current = NormalChallenge.current ||
        InfinityChallenge.current ||
        EternityChallenge.current;
      if (current !== undefined) {
        current.exit();
      }
    }
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.challenges.subtab"
      :tabs="tabs"
      class="l-challenges-tab"
    >
      <div v-if="isInChallenge || isShowAllVisible" slot="before-content" class="l-challenges-tab__header">
        <primary-button
          v-if="isInChallenge"
          class="o-primary-btn--exit-challenge l-challenges-tab__exit-btn"
          @click="exitChallenge"
        >Exit Challenge</primary-button>
        <template v-if="isShowAllVisible">
          <b>Show all:</b>
          <input
            v-model="showAllChallenges"
            type="checkbox"
            class="o-big-checkbox"
          />
        </template>
        <template v-if="isAutoECVisible">
          <b>Auto EC completion:</b>
          <input
            v-model="autoEC"
            type="checkbox"
            class="o-big-checkbox"
          >
        </template>
        <div
          v-if="autoEC && isAutoECVisible && remainingECTiers > 0"
          class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info"
        >
          <span>Until</span>
          <div class="l-challenges-tab__auto-ec-timers">
            <span v-if="remainingECTiers > 1">next auto EC completion: {{untilNextEC.toString()}}</span>
            <span>all auto EC completions: {{untilAllEC.toString()}}</span>
          </div>
        </div>
      </div>
    </game-tab-with-subtabs>`
});
