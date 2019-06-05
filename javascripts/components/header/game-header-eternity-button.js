"use strict";

Vue.component("game-header-eternity-button", {
  data: function() {
    return {
      isVisible: false,
      type: EPButtonDisplayType.FIRST_TIME,
      gainedEP: new Decimal(0),
      currentEPPM: new Decimal(0),
      peakEPPM: new Decimal(0),
      gainedTachyons: new Decimal(0),
      challengeCompletions: 0,
      gainedCompletions: 0,
      fullyCompleted: false,
      failedCondition: undefined,
      hasMoreCompletions: false,
      nextGoalAt: new Decimal(0)
    };
  },
  computed: {
    isGainedEPAmountSmall: function() {
      return this.gainedEP.lt(1e6);
    }
  },
  methods: {
    update() {
      this.isVisible = player.infinityPoints.gte(Player.eternityGoal) && InfinityDimension(8).isUnlocked;
      if (!this.isVisible) return;
      if (player.eternities === 0) {
        this.type = EPButtonDisplayType.FIRST_TIME;
        return;
      }

      if (EternityChallenge.current !== undefined) {
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
        this.type = hasNewContent ?
          EPButtonDisplayType.DILATION_EXPLORE_NEW_CONTENT :
          EPButtonDisplayType.DILATION;
        this.gainedTachyons.copyFrom(getTachyonGain());
        return;
      }

      this.type = hasNewContent ?
        EPButtonDisplayType.NORMAL_EXPLORE_NEW_CONTENT :
        EPButtonDisplayType.NORMAL;
      this.currentEPPM.copyFrom(gainedEP.dividedBy(Time.thisEternity.totalMinutes));
      this.peakEPPM.copyFrom(EPminpeak);
    },
    updateChallengeWithRUPG() {
      const currentEC = EternityChallenge.current;
      const currentCompletions = currentEC.completions;
      this.fullyCompleted = currentCompletions === 5;
      if (this.fullyCompleted) return;
      let gainedCompletions = 1;
      while (
        player.infinityPoints.gte(currentEC.goalAtCompletions(currentCompletions + gainedCompletions)) &&
        gainedCompletions < 5 - currentCompletions
      ) {
        gainedCompletions++;
      }
      const totalCompletions = currentCompletions + gainedCompletions;
      let maxEC4Valid = 0;
      if(player.infinitied.lte(16)) maxEC4Valid = 5 - Math.ceil(player.infinitied.toNumber() / 4);
      if (EternityChallenge(4).isRunning && totalCompletions >= maxEC4Valid && gainedCompletions > 1) {
        this.gainedCompletions = Math.min(totalCompletions, maxEC4Valid) - currentCompletions;
        this.failedCondition = "(Too many infinities for more)";
        return;
      }

      const maxEC12Valid = 5 - Math.floor(player.thisEternity / 200);
      if (EternityChallenge(12).isRunning && totalCompletions >= maxEC12Valid && gainedCompletions > 1) {
        this.gainedCompletions = Math.min(totalCompletions, maxEC12Valid) - currentCompletions;
        this.failedCondition = "(Too slow for more)";
        return;
      }

      this.gainedCompletions = gainedCompletions;
      this.failedCondition = undefined;
      this.hasMoreCompletions = totalCompletions < 5;
      this.nextGoalAt.copyFrom(currentEC.goalAtCompletions(totalCompletions));
    }
  },
  template:
    `<button
      v-if="isVisible"
      class="o-prestige-btn o-prestige-btn--eternity l-game-header__eternity-btn"
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
        Gain <b>{{shortenDimensions(gainedEP)}}</b> Eternity {{ "point" | pluralize(gainedEP) }}.
        <br>
        {{shortenDimensions(currentEPPM)}} EP/min
        <br>
        Peaked at {{shortenDimensions(peakEPPM)}} EP/min
      </template>
      
      <!-- Challenge -->
      <template v-else-if="type === 2">
        Other challenges await... I need to become Eternal
      </template>
      
      <!-- Dilation -->
      <template v-else-if="type === 3">
        Gain <b>{{shortenDimensions(gainedEP)}}</b> Eternity {{ "point" | pluralize(gainedEP) }}.
        <br>
        +{{shortenMoney(gainedTachyons)}} Tachyon {{ "particle" | pluralize(gainedTachyons) }}.
      </template>
      
      <!-- New content available -->
      <template v-else-if="type === 4 || type === 5">
        <template v-if="type === 4">
          Gain <b>{{shortenDimensions(gainedEP)}}</b> EP
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
          <template v-if="failedCondition">
            <br>
            {{failedCondition}}
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
