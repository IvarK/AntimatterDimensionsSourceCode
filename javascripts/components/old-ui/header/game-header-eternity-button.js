"use strict";

Vue.component("game-header-eternity-button", {
  data() {
    return {
      isVisible: false,
      type: EPButtonDisplayType.FIRST_TIME,
      isDilation: false,
      gainedEP: new Decimal(0),
      currentEPPM: new Decimal(0),
      peakEPPM: new Decimal(0),
      gainedTachyons: new Decimal(0),
      challengeCompletions: 0,
      gainedCompletions: 0,
      fullyCompleted: false,
      failedRestriction: undefined,
      hasMoreCompletions: false,
      nextGoalAt: new Decimal(0)
    };
  },
  computed: {
    isGainedEPAmountSmall() {
      return this.gainedEP.lt(1e6);
    },
    peakEPPMThreshold: () => new Decimal("1e100"),
    isPeakEPPMVisible() {
      return this.currentEPPM.lte(this.peakEPPMThreshold);
    },
    classObject() {
      return {
        "o-prestige-btn--eternity": !this.isDilation,
        "o-prestige-btn--dilation": this.isDilation,
      };
    }
  },
  methods: {
    update() {
      this.isVisible = player.infinityPoints.gte(Player.eternityGoal) && InfinityDimension(8).isUnlocked;
      this.isDilation = this.type === EPButtonDisplayType.DILATION ||
        this.type === EPButtonDisplayType.DILATION_EXPLORE_NEW_CONTENT;
      if (!this.isVisible) return;
      if (!PlayerProgress.eternityUnlocked()) {
        this.type = EPButtonDisplayType.FIRST_TIME;
        return;
      }

      if (EternityChallenge.isRunning) {
        if (!Perk.studyECBulk.isBought) {
          this.type = EPButtonDisplayType.CHALLENGE;
          return;
        }
        this.type = EPButtonDisplayType.CHALLENGE_RUPG;
        this.updateChallengeWithRUPG();
        return;
      }

      const gainedEP = gainedEternityPoints();
      this.gainedEP.copyFrom(gainedEP);
      const hasNewContent = player.realities === 0 &&
        player.eternityPoints.exponent >= 4000 &&
        player.timestudy.theorem.gt(5e9) &&
        player.replicanti.amount.exponent > 20000;

      if (player.dilation.active) {
        this.type = hasNewContent
          ? EPButtonDisplayType.DILATION_EXPLORE_NEW_CONTENT
          : EPButtonDisplayType.DILATION;
        this.gainedTachyons.copyFrom(getTachyonGain());
        return;
      }

      this.type = hasNewContent
        ? EPButtonDisplayType.NORMAL_EXPLORE_NEW_CONTENT
        : EPButtonDisplayType.NORMAL;
      this.currentEPPM.copyFrom(gainedEP.dividedBy(Time.thisEternity.totalMinutes));
      this.peakEPPM.copyFrom(player.bestEPminThisEternity);
    },
    updateChallengeWithRUPG() {
      const ec = EternityChallenge.current;
      this.fullyCompleted = ec.isFullyCompleted;
      if (this.fullyCompleted) return;
      const status = ec.gainedCompletionStatus;
      this.gainedCompletions = status.gainedCompletions;
      this.failedRestriction = status.failedRestriction;
      this.hasMoreCompletions = status.hasMoreCompletions;
      this.nextGoalAt.copyFrom(status.nextGoalAt);
    }
  },
  template:
    `<button
      v-if="isVisible"
      :class="classObject"
      class="o-prestige-btn l-game-header__eternity-btn"
      onclick="eternity()"
    >
      <!-- First time -->
      <template v-if="type === 0">
        Other times await... I need to become Eternal
      </template>
      
      <!-- Normal -->
      <template v-else-if="type === 1">
        <template v-if="isGainedEPAmountSmall">
          <b>I need to become Eternal.</b>
          <br>
        </template>
        Gain <b>{{shorten(gainedEP, 2, 0)}}</b> Eternity {{ "point" | pluralize(gainedEP) }}.
        <br>
        <template v-if="isPeakEPPMVisible">
          {{shorten(currentEPPM, 2, 2)}} EP/min
          <br>
          Peaked at {{shorten(peakEPPM, 2, 2)}} EP/min
        </template>
      </template>
      
      <!-- Challenge -->
      <template v-else-if="type === 2">
        Other challenges await... I need to become Eternal
      </template>
      
      <!-- Dilation -->
      <template v-else-if="type === 3">
        Gain <b>{{shorten(gainedEP, 2, 2)}}</b> Eternity {{ "point" | pluralize(gainedEP) }}.
        <br>
        +{{shortenMoney(gainedTachyons)}} Tachyon {{ "particle" | pluralize(gainedTachyons) }}.
      </template>
      
      <!-- New content available -->
      <template v-else-if="type === 4 || type === 5">
        <template v-if="type === 4">
          Gain <b>{{shorten(gainedEP, 2, 2)}}</b> EP
        </template>
        <template v-else>
          Gain <b>{{shortenMoney(gainedTachyons)}}</b> Tachyon {{ "particle" | pluralize(gainedTachyons) }}
        </template>
        <br>
        You should explore a bit and look at new content before clicking me!
      </template>
      
      <!-- Challenge with multiple completions -->
      <template v-else-if="type === 6">
        Other challenges await...
        <template v-if="fullyCompleted">
          <br>
          (This challenge is already fully completed)
        </template>
        <template v-else>
          <br>
          {{gainedCompletions}} {{ "completion" | pluralize(gainedCompletions) }} on Eternity
          <template v-if="failedRestriction">
            <br>
            {{failedRestriction}}
          </template>
          <template v-else-if="hasMoreCompletions">
            <br>
            Next goal at {{shortenCosts(nextGoalAt)}} IP
          </template>
        </template>
      </template>
    </button>`
});

const EPButtonDisplayType = {
  FIRST_TIME: 0,
  NORMAL: 1,
  CHALLENGE: 2,
  DILATION: 3,
  NORMAL_EXPLORE_NEW_CONTENT: 4,
  DILATION_EXPLORE_NEW_CONTENT: 5,
  CHALLENGE_RUPG: 6
};
