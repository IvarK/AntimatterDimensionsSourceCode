"use strict";

Vue.component("game-header-eternity-button", {
  data() {
    return {
      isVisible: false,
      type: EP_BUTTON_DISPLAY_TYPE.FIRST_TIME,
      gainedEP: new Decimal(0),
      minIP: new Decimal(0),
      currentEP: new Decimal(0),
      currentEPPM: new Decimal(0),
      peakEPPM: new Decimal(0),
      currentTachyons: new Decimal(0),
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
    isGainedEPAmountZero() {
      return this.gainedEP.eq(0);
    },
    peakEPPMThreshold: () => new Decimal("1e100"),
    isPeakEPPMVisible() {
      return this.currentEPPM.lte(this.peakEPPMThreshold);
    },
    buttonTypeClass() {
      return this.isDilation
        ? "o-prestige-btn--dilation"
        : "o-prestige-btn--eternity";
    },
    isDilation() {
      return this.type === EP_BUTTON_DISPLAY_TYPE.DILATION ||
        this.type === EP_BUTTON_DISPLAY_TYPE.DILATION_EXPLORE_NEW_CONTENT;
    },
    amountStyle() {
      if (this.currentEP.lt(1e50)) return { color: "var(--color-eternity)" };
      const ratio = this.gainedEP.log10() / this.currentEP.log10();

      const rgb = [
        Math.round(255 - (ratio - 1) * 10 * 255),
        Math.round(255 - (1 - ratio) * 10 * 255),
        ratio > 1 ? Math.round(255 - (ratio - 1) * 10 * 255)
        : Math.round(255 - (1 - ratio) * 10 * 255)
      ];
      return { color: `rgb(${rgb.join(",")})` };
    },
    tachyonAmountStyle() {
      // Note that Infinity and 0 can show up here. We have a special case for
      // this.currentTachyons being 0 because dividing a Decimal by 0 returns 0.
      let ratio;
      if (this.currentTachyons.eq(0)) {
        // In this case, make it always red or green.
        // (Is it possible to gain 0 tachyons? Probably somehow it is.)
        ratio = this.gainedTachyons.eq(0) ? 0 : Infinity;
      } else {
        ratio = this.gainedTachyons.div(this.currentTachyons).toNumber();
      }

      const rgb = [
        Math.round(Math.clampMax(1 / ratio, 1) * 255),
        Math.round(Math.clampMax(ratio, 1) * 255),
        Math.round(Math.clampMax(ratio, 1 / ratio) * 255),
      ];
      return { color: `rgb(${rgb.join(",")})` };
    }
  },
  methods: {
    update() {
      this.isVisible = player.infinityPoints.gte(Player.eternityGoal);
      if (!this.isVisible) return;
      if (!PlayerProgress.eternityUnlocked()) {
        this.type = EP_BUTTON_DISPLAY_TYPE.FIRST_TIME;
        return;
      }

      if (EternityChallenge.isRunning) {
        if (!Perk.studyECBulk.isBought) {
          this.type = EP_BUTTON_DISPLAY_TYPE.CHALLENGE;
          return;
        }
        this.type = EP_BUTTON_DISPLAY_TYPE.CHALLENGE_RUPG;
        this.updateChallengeWithRUPG();
        return;
      }

      const gainedEP = gainedEternityPoints();
      if (this.gainedEP.eq(0)) this.minIP = requiredIPForEP();
      this.currentEP.copyFrom(player.eternityPoints);
      this.gainedEP.copyFrom(gainedEP);
      const hasNewContent = player.realities === 0 &&
        player.eternityPoints.exponent >= 4000 &&
        player.timestudy.theorem.gt(5e9) &&
        player.replicanti.amount.exponent > 20000;

      if (player.dilation.active) {
        this.type = hasNewContent
          ? EP_BUTTON_DISPLAY_TYPE.DILATION_EXPLORE_NEW_CONTENT
          : EP_BUTTON_DISPLAY_TYPE.DILATION;
        this.currentTachyons.copyFrom(player.dilation.tachyonParticles);
        this.gainedTachyons.copyFrom(getTachyonGain());
        return;
      }

      this.type = hasNewContent
        ? EP_BUTTON_DISPLAY_TYPE.NORMAL_EXPLORE_NEW_CONTENT
        : EP_BUTTON_DISPLAY_TYPE.NORMAL;
      this.currentEPPM.copyFrom(gainedEP.dividedBy(
        TimeSpan.fromMilliseconds(player.thisEternityRealTime).totalMinutes)
      );
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
      :class="buttonTypeClass"
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
          I need to become Eternal.
          <br>
        </template>
        Gain <span :style="amountStyle">{{format(gainedEP, 2, 0)}}</span> Eternity {{ "Point" | pluralize(gainedEP) }}.
        <br>
        <template v-if="isGainedEPAmountZero">
          Reach {{ format(minIP) }} IP to
          <br>
          gain Eternity Points.
        </template>
        <template v-else-if="isPeakEPPMVisible">
          {{format(currentEPPM, 2, 2)}} EP/min
          <br>
          Peaked at {{format(peakEPPM, 2, 2)}} EP/min
        </template>
      </template>

      <!-- Challenge -->
      <template v-else-if="type === 2">
        Other challenges await... I need to become Eternal
      </template>

      <!-- Dilation -->
      <template v-else-if="type === 3">
        Gain {{format(gainedEP, 2, 2)}} Eternity {{ "Point" | pluralize(gainedEP) }}.
        <br>
        +<span :style="tachyonAmountStyle">{{format(gainedTachyons, 2, 1)}}</span>
        Tachyon {{ "Particle" | pluralize(gainedTachyons) }}.
      </template>

      <!-- New content available -->
      <template v-else-if="type === 4 || type === 5">
        <template v-if="type === 4">
          Gain <span :style="amountStyle">{{format(gainedEP, 2, 2)}}</span> EP
        </template>
        <template v-else>
          Gain {{format(gainedTachyons, 2, 1)}} Tachyon {{ "Particle" | pluralize(gainedTachyons) }}
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
            Next goal at {{format(nextGoalAt, 0, 0)}} IP
          </template>
        </template>
      </template>
    </button>`
});

const EP_BUTTON_DISPLAY_TYPE = {
  FIRST_TIME: 0,
  NORMAL: 1,
  CHALLENGE: 2,
  DILATION: 3,
  NORMAL_EXPLORE_NEW_CONTENT: 4,
  DILATION_EXPLORE_NEW_CONTENT: 5,
  CHALLENGE_RUPG: 6
};
