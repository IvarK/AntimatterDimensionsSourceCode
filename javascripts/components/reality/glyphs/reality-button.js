"use strict";

Vue.component("reality-button", {
  data() {
    return {
      canReality: false,
      hasRealityStudy: false,
      inCelestialRunWithScalingReward: false,
      machinesGained: new Decimal(0),
      realityTime: 0,
      glyphLevel: 0,
      nextGlyphPercent: 0,
      nextMachineEP: 0,
      shardsGained: 0,
      expGained: [0, 0, 0, 0],
      raUnlocks: [false, false, false, false]
    };
  },
  computed: {
    buttonHeader() {
      return this.canReality ? "Make a new reality" : "Start reality over";
    },
    formatEPRequirement() {
      return this.shorten("1e4000", 0, 0);
    },
    formatMachinesGained() {
      return `Machines gained: ${this.shorten(this.machinesGained, 2, 0)}`;
    },
    formatMachineStats() {
      if (this.machinesGained.lt(100)) {
        return `Next at ${shorten(this.nextMachineEP, 0)} EP`;
      } 
        return `${shorten(this.machinesGained.divide(this.realityTime), 2, 2)} RM/min`;
      
    },
    formatGlyphLevel() {
      return `Glyph level: ${this.glyphLevel}  (${this.nextGlyphPercent}%)`;
    },
    shardsGainedText() {
      return `${this.shorten(this.shardsGained, 2)} Relic ${pluralize("Shard", this.shardsGained)}`;
    },
    celestialRunText() {
      if (Teresa.isRunning) {
        return `Glyph sacrifice ${shorten(Teresa.runRewardMultiplier, 2)}x` +
          ` ➜ ${shorten(Math.max(Teresa.runRewardMultiplier, Teresa.rewardMultiplier(player.money)), 2)}x`;
      }
      if (Ra.isRunning) {
        const boostList = [`Teresa memories ${shortenRateOfChange(Ra.teresaExpBoost)}x ` +
          `➜ ${shortenRateOfChange(Ra.teresaExpFormula(player.eternityPoints))}x`];
        if (Ra.has(RA_UNLOCKS.EFFARIG_XP)) {
          boostList.push(`Effarig memories ${shortenRateOfChange(Ra.effarigExpBoost)}x ` +
            `➜ ${shortenRateOfChange(Ra.effarigExpFormula(Glyphs.activeList.length))}x`);
        }
        if (Ra.has(RA_UNLOCKS.ENSLAVED_XP)) {
          boostList.push(`Enslaved memories ${shortenRateOfChange(Ra.enslavedExpBoost)}x ` +
            `➜ ${shortenRateOfChange(Ra.enslavedExpFormula(player.thisReality))}x`);
        }
        if (Ra.has(RA_UNLOCKS.V_XP)) {
          boostList.push(`V memories ${shortenRateOfChange(Ra.vExpBoost)}x ` +
            `➜ ${shortenRateOfChange(Ra.vExpFormula(TimeTheorems.totalPurchased()), 2)}x`);
        }
        return boostList.filter(str => str !== "").join("<br>");
      }
      return `Invalid celestial reward`;
    }
  },
  methods: {
    update() {
      this.hasRealityStudy = TimeStudy.reality.isBought;
      if (!this.hasRealityStudy || player.eternityPoints.lt("1e4000")) {
        this.canReality = false;
        this.shardsGained = 0;
        return;
      }
      function EPforRM(rm) {
        const adjusted = Decimal.divide(rm.minusEffectOf(Perk.realityMachineGain), getRealityMachineMultiplier());
        if (adjusted.lte(1)) return Decimal.pow10(4000);
        return Decimal.pow10(Math.ceil(4000 * (adjusted.log10() / 3 + 1)));
      }
      this.canReality = true;
      function boostedGain(x) {
        if (Enslaved.boostReality && Enslaved.realityBoostRatio > 1) {
          return Decimal.times(x, Enslaved.realityBoostRatio + 1);
        }
        return x;
      }
      this.machinesGained = boostedGain(gainedRealityMachines());
      if (Enslaved.boostReality) {
        this.machinesGained = this.machinesGained.times(Enslaved.realityBoostRatio);
      }
      this.realityTime = Time.thisRealityRealTime.totalMinutes;
      this.glyphLevel = gainedGlyphLevel().actualLevel;
      this.nextGlyphPercent = percentToNextGlyphLevel();
      this.nextMachineEP = EPforRM(this.machinesGained.plus(1));
      this.ppGained = boostedGain(1);
      this.shardsGained = Ra.has(RA_UNLOCKS.SHARD_LEVEL_BOOST)
        ? 0
        : boostedGain(Effarig.shardsGained);
      this.expGained = [boostedGain(Ra.gainedTeresaExp),
        boostedGain(Ra.gainedEffarigExp),
        boostedGain(Ra.gainedEnslavedExp),
        boostedGain(Ra.gainedVExp)];
      this.raUnlocks = [V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]),
        Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK),
        Ra.has(RA_UNLOCKS.ENSLAVED_UNLOCK),
        Ra.has(RA_UNLOCKS.V_UNLOCK)];
      this.inCelestialRunWithScalingReward = Teresa.isRunning || Ra.isRunning;
    },
    handleClick() {
      if (!TimeStudy.reality.isBought || player.eternityPoints.lt("1e4000")) {
        startRealityOver();
      } else {
        requestManualReality();
      }
    },
  },
  template: `
  <button :class="['l-reality-button', 'c-reality-button', 'infotooltip',
                   canReality ? 'c-reality-button--good' : 'c-reality-button--bad']"
          @click="handleClick">
    <div class="l-reality-button__contents">
      <div class="c-reality-button__header">{{buttonHeader}}</div>
      <template v-if="canReality">
        <div>{{formatMachinesGained}}</div>
        <div>{{formatMachineStats}}</div>
        <div>{{formatGlyphLevel}}</div>
      </template>
      <template v-else-if="hasRealityStudy">
        <div>Get {{formatEPRequirement}} EP to unlock a new reality</div>
      </template>
      <template v-else>
        <div>Purchase the study in the eternity tab to unlock a new reality</div>
      </template>
      <div class="infotooltiptext">
        <template v-if="canReality">
          <div>Other resources gained:</div>
          <div>{{ppGained}} Perk {{ "point" | pluralize(ppGained) }}</div>
          <div v-if="shardsGained !== 0">{{shardsGainedText}}</div>
          <div v-if="raUnlocks[0]">{{ expGained[0] }} Teresa {{ "memory" | pluralize(expGained[0], "memories") }}</div>
          <div v-if="raUnlocks[1]">{{ expGained[1] }} Effarig {{ "memory" | pluralize(expGained[1], "memories") }}</div>
          <div v-if="raUnlocks[2]">{{ expGained[2] }} Enslaved {{ "memory" | pluralize(expGained[2], "memories") }}</div>
          <div v-if="raUnlocks[3]">{{ expGained[3] }} V {{ "memory" | pluralize(expGained[3], "memories") }}</div>
          <div v-if="inCelestialRunWithScalingReward">{{ celestialRunText }}</div>
        </template>
        <template v-else>
          No resources gained
        </template>
      </div>
    </div>
  </button>
  `
});