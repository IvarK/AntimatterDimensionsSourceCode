"use strict";

Vue.component("reality-button", {
  data() {
    return {
      canReality: false,
      hasRealityStudy: false,
      inTeresaReality: false,
      inLaitelaReality: false,
      machinesGained: new Decimal(0),
      realityTime: 0,
      glyphLevel: 0,
      nextGlyphPercent: 0,
      nextMachineEP: 0,
      shardsGained: 0,
      expGained: [0, 0, 0, 0],
      raUnlocks: [false, false, false, false],
      raExpBoosts: [false, false, false, false],
      celestialRunText: ["", "", "", "", ""]
    };
  },
  computed: {
    buttonHeader() {
      return this.canReality ? "Make a new reality" : "Start reality over";
    },
    formatMachinesGained() {
      return `Machines gained: ${format(this.machinesGained, 2, 0)}`;
    },
    formatMachineStats() {
      if (this.machinesGained.lt(100)) {
        return `Next at ${format(this.nextMachineEP, 2)} EP`;
      }
      if (this.machinesGained.lt(1e100)) {
        return `${format(this.machinesGained.divide(this.realityTime), 2, 2)} RM/min`;
      }
      return "";
    },
    formatGlyphLevel() {
      return `Glyph level: ${formatInt(this.glyphLevel)}  (${this.nextGlyphPercent})`;
    },
    shardsGainedText() {
      return `${format(this.shardsGained, 2)} Relic ${pluralize("Shard", this.shardsGained)}`;
    }
  },
  methods: {
    percentToNextGlyphLevelText() {
      const glyphState = getGlyphLevelInputs();
      let level = glyphState.actualLevel;
      if (!isFinite(level)) level = 0;
      return glyphState.capped
        ? "Capped"
        : `${Math.min(((level - Math.floor(level)) * 100), 99.9).toFixed(1)}%`;
    },
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
        if (adjusted.lte(10)) return Decimal.pow10(4000 / 27 * (adjusted.toNumber() + 26));
        return Decimal.pow10(4000 * (adjusted.log10() / 3 + 1));
      }
      this.canReality = true;
      const multiplier = simulatedRealityCount(false) + 1;
      this.machinesGained = gainedRealityMachines().times(multiplier);
      this.realityTime = Time.thisRealityRealTime.totalMinutes;
      this.glyphLevel = gainedGlyphLevel().actualLevel;
      this.nextGlyphPercent = this.percentToNextGlyphLevelText();
      this.nextMachineEP = EPforRM(this.machinesGained.plus(1));
      this.ppGained = multiplier;
      this.shardsGained = Effarig.shardsGained * multiplier;
      this.expGained = Ra.pets.all.map(p => p.gainedExp * multiplier);
      this.raUnlocks = [V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[3]),
        Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK),
        Ra.has(RA_UNLOCKS.ENSLAVED_UNLOCK),
        Ra.has(RA_UNLOCKS.V_UNLOCK)];
      this.inTeresaReality = Teresa.isRunning;
      this.inLaitelaReality = Laitela.isRunning;
      this.raExpBoosts = [Ra.isRunning && Ra.has(RA_UNLOCKS.TERESA_XP),
        Ra.isRunning && Ra.has(RA_UNLOCKS.EFFARIG_XP),
        Ra.isRunning && Ra.has(RA_UNLOCKS.ENSLAVED_XP),
        Ra.isRunning && Ra.has(RA_UNLOCKS.V_XP)];
      const teresaReward = this.formatScalingMultiplier("Glyph sacrifice",
        Teresa.runRewardMultiplier,
        Math.max(Teresa.runRewardMultiplier, Teresa.rewardMultiplier(player.antimatter)));
      const laitelaReward = this.formatScalingMultiplier("Matter dimensions",
        Laitela.realityReward,
        Math.max(Laitela.realityReward, Laitela.rewardMultiplier(player.antimatter)));
      this.celestialRunText = [teresaReward,
        this.formatPetMemories(Ra.pets.teresa),
        this.formatPetMemories(Ra.pets.effarig),
        this.formatPetMemories(Ra.pets.enslaved),
        this.formatPetMemories(Ra.pets.v),
        laitelaReward
      ];
    },
    handleClick() {
      if (!TimeStudy.reality.isBought || player.eternityPoints.lt("1e4000")) {
        if (player.realities === 0) return;
        startRealityOver();
      } else {
        requestManualReality();
      }
    },
    formatPetMemories(pet) {
      return this.formatScalingMultiplier(`${pet.name} memories`, pet.expBoost, pet.nextExpBoost);
    },
    formatScalingMultiplier(resource, before, after) {
      return `${resource} ${formatX(before, 2, 2)} ➜ ${formatX(after, 2, 2)}`;
    }
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
        <div>Get {{format("1e4000", 0, 0)}} EP to unlock a new reality</div>
      </template>
      <template v-else>
        <div>Purchase the study in the eternity tab to unlock a new reality</div>
      </template>
      <div class="infotooltiptext">
        <template v-if="canReality">
          <div>Other resources gained:</div>
          <div>{{ppGained}} Perk {{ "point" | pluralize(ppGained) }}</div>
          <div v-if="shardsGained !== 0">{{shardsGainedText}}</div>
          <div v-if="raUnlocks[0]">
            {{ format(expGained[0], 2, 2) }} Teresa {{ "memory" | pluralize(expGained[0], "memories") }}
          </div>
          <div v-if="raUnlocks[1]">
            {{ format(expGained[1], 2, 2) }} Effarig {{ "memory" | pluralize(expGained[1], "memories") }}
          </div>
          <div v-if="raUnlocks[2]">
            {{ format(expGained[2], 2, 2) }} Enslaved {{ "memory" | pluralize(expGained[2], "memories") }}
          </div>
          <div v-if="raUnlocks[3]">
            {{ format(expGained[3], 2, 2) }} V {{ "memory" | pluralize(expGained[3], "memories") }}
          </div>
          <div v-if="inTeresaReality">{{ celestialRunText[0] }}</div>
          <div v-if="raExpBoosts[0]">{{ celestialRunText[1] }}</div>
          <div v-if="raExpBoosts[1]">{{ celestialRunText[2] }}</div>
          <div v-if="raExpBoosts[2]">{{ celestialRunText[3] }}</div>
          <div v-if="raExpBoosts[3]">{{ celestialRunText[4] }}</div>
          <div v-if="inLaitelaReality">{{ celestialRunText[5] }}</div>
        </template>
        <template v-else>
          No resources gained
        </template>
      </div>
    </div>
  </button>
  `
});
