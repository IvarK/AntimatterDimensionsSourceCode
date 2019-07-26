"use strict";

Vue.component("sidebar-ep", {
  data() {
    return {
      ep: new Decimal(0),
      type: EPButtonDisplayType.FIRST_TIME,
      showEternity: false,
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
  props: {
    cond: Boolean
  },
  methods: {
    update() {
      this.ep.copyFrom(player.eternityPoints);
      this.showEternity = player.infinityPoints.gte(Player.eternityGoal)
      if (!this.showEternity) return;
      if (player.eternities === 0) {
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
      this.peakEPPM.copyFrom(EPminpeak);
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
    },
    eternity() {
      if (this.showEternity) {
        eternity();
      }
    }
  },
  computed: {
    eternityPeaks() {
      return `${shorten(this.currentEPPM, 2, 0)} EP/min<br>Peaked at ${shorten(this.peakEPPM, 2, 0)} EP/min`
    },
  },
  template:
  `<div
    class="resource"
    @click="eternity"
    :class=" { 'resource-eternity-canreset': showEternity }"
    v-tooltip="eternityPeaks">
    <div v-if="cond">
      <h2 id="ep">{{ shorten(ep, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">Eternity Points</span>
        <span v-if="showEternity" class="resource-per-second"> +{{ shorten(gainedEP, 2, 0) }}</span>
      </div>
    </div>
  </div>`
});