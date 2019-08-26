"use strict";

Vue.component("sidebar-ep", {
  data() {
    return {
      ep: new Decimal(0),
    };
  },
  props: {
    cond: Boolean
  },
  methods: {
    update() {
      this.ep.copyFrom(player.eternityPoints);
      this.showEternity = player.infinityPoints.gte(Player.eternityGoal)
      if (player.eternities === 0) {
        this.type = EPButtonDisplayType.FIRST_TIME;
        console.log(this.type)
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
    },
    eternity() {
      if (this.showEternity) {
        eternity();
      }
    }
  },
  template:
  `<div class="resource">
    <div v-if="cond">
      <h2 class="o-sidebar-eternity-button">{{ shorten(ep, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">Eternity Points</span>
      </div>
    </div>
  </div>`
});