"use strict";

Vue.component("reality-button", {
  data() {
    return {
      canReality: false,
      hasRealityStudy: false,
      machinesGained: new Decimal(0),
      realityTime: 0,
      glyphLevel: 0,
      nextGlyphPercent: 0,
      nextMachineEP: 0,
      shardsGained: 0,
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
      if (this.machinesGained.lt(Number.MAX_VALUE)) {
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

      const teresaReward = this.formatScalingMultiplierText(
        "Glyph sacrifice",
        Teresa.runRewardMultiplier,
        Math.max(Teresa.runRewardMultiplier, Teresa.rewardMultiplier(player.antimatter)));
      const teresaThreshold = this.formatThresholdText(
        Teresa.rewardMultiplier(player.antimatter) > Teresa.runRewardMultiplier,
        player.celestials.teresa.bestRunAM,
        "antimatter");
      const laitelaReward = this.formatScalingMultiplierText(
        "Matter dimensions",
        Laitela.realityReward,
        Math.max(Laitela.realityReward, Laitela.rewardMultiplier(player.antimatter)));
      const laitelaThreshold = this.formatThresholdText(
        Laitela.rewardMultiplier(player.antimatter) > Laitela.realityReward,
        player.celestials.laitela.maxAmGained.clampMin(1),
        "antimatter");
      this.celestialRunText = [
        [Teresa.isRunning, teresaReward, teresaThreshold],
        [Laitela.isRunning, laitelaReward, laitelaThreshold]];
    },
    handleClick() {
      if (!TimeStudy.reality.isBought || player.eternityPoints.lt("1e4000")) {
        if (player.realities === 0) return;
        startRealityOver();
      } else {
        requestManualReality();
      }
    },
    formatScalingMultiplierText(resource, before, after) {
      return `${resource} ${formatX(before, 2, 2)} ➜ ${formatX(after, 2, 2)}`;
    },
    formatThresholdText(condition, threshold, resourceName) {
      if (condition) return "";
      return `(${format(threshold, 2, 2)} ${resourceName} to improve)`;
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
          <div v-for="celestialInfo in celestialRunText">
            <span v-if="celestialInfo[0]">
              {{ celestialInfo[1] }}
              <br>
              {{ celestialInfo[2] }}
            </span>
          </div>
        </template>
        <template v-else>
          No resources gained
        </template>
      </div>
    </div>
  </button>
  `
});
