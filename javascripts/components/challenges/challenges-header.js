"use strict";

Vue.component("challenges-header", {
  data() {
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
      newEC10: false,
    };
  },
  watch: {
    autoEC(newValue) {
      player.reality.autoEC = newValue;
    },
    showAllChallenges(newValue) {
      player.options.showAllChallenges = newValue;
    },
    newEC10(newValue) {
      player.newEC10Test = newValue;
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      const isECTabUnlocked = player.challenge.eternity.unlocked !== 0 ||
        Object.keys(player.eternityChalls).length > 0;
      this.isECTabUnlocked = isECTabUnlocked;
      const isICTabUnlocked = isECTabUnlocked ||
        player.antimatter.gte(new Decimal("1e2000")) ||
        player.postChallUnlocked > 0;
      this.isICTabUnlocked = isICTabUnlocked;
      this.isInChallenge = NormalChallenge.isRunning || InfinityChallenge.isRunning || EternityChallenge.isRunning;
      this.isShowAllVisible = PlayerProgress.realityUnlocked() && (isECTabUnlocked || isICTabUnlocked);
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
      this.newEC10 = player.newEC10Test;
    },
    exitChallenge() {
      const current = NormalChallenge.current ||
        InfinityChallenge.current ||
        EternityChallenge.current;
      if (current !== undefined) {
        current.exit();
      }
    },
    toggleShowAll() {
      this.showAllChallenges = !this.showAllChallenges;
    },
    toggleAutoEC() {
      this.autoEC = !this.autoEC;
    },
    toggleNewEC10() {
      this.newEC10 = !this.newEC10;
    },
  },
  template:
  `<div v-if="isInChallenge || isShowAllVisible" class="l-challenges-tab__header">
    <primary-button v-if="isInChallenge"
                    class="o-primary-btn--exit-challenge l-challenges-tab__exit-btn"
                    @click="exitChallenge">
      Exit Challenge
    </primary-button>
    <div>
      <div class="o-challenges-tab__header-toggle"
           @click="toggleNewEC10">
        <input :checked="newEC10" type="checkbox" class="o-big-checkbox" />
        <b>EC10 Reward Test</b>
      </div>
      <div v-if="isShowAllVisible"
           class="o-challenges-tab__header-toggle"
           @click="toggleShowAll">
        <input :checked="showAllChallenges" type="checkbox" class="o-big-checkbox" />
        <b>Show all</b>
      </div>
      <div v-if="isAutoECVisible"
           class="o-challenges-tab__header-toggle"
           @click="toggleAutoEC">
        <input :checked="autoEC" type="checkbox" class="o-big-checkbox" />
        <b>Auto EC completion</b>
      </div>
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
})
