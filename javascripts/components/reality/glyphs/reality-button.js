"use strict";

Vue.component("reality-button", {
  data() {
    return {
      canReality: false,
      hasRealityStudy: false,
      machinesGained: new Decimal(0),
      imaginaryMachinesGained: new Decimal(0),
      realityTime: 0,
      glyphLevel: 0,
      nextGlyphPercent: 0,
      nextMachineEP: 0,
      shardsGained: 0,
      celestialRunText: ["", "", "", "", ""]
    };
  },
  computed: {
    formatMachinesGained() {
      const parts = [];
      if (this.machinesGained.gt(0)) parts.push(`${format(this.machinesGained, 2, 0)}`);
      if (this.imaginaryMachinesGained.gt(0)) parts.push(`${format(this.imaginaryMachinesGained, 2, 0)}i`);

      if (parts.length === 0) return "No Machines gained";
      return `Machines gained: ${parts.join(" + ")}`;
    },
    formatMachineStats() {
      if (!PlayerProgress.realityUnlocked() && this.nextMachineEP.gt("1e8000")) {
        return `RM this Reality is capped!`;
      }
      if (this.machinesGained.gt(0) && this.machinesGained.lt(100) && this.imaginaryMachinesGained.eq(0)) {
        return `Next at ${format(this.nextMachineEP, 2)} EP`;
      }
      if (this.machinesGained.lt(Number.MAX_VALUE) && this.imaginaryMachinesGained.eq(0)) {
        return `${format(this.machinesGained.divide(this.realityTime), 2, 2)} RM/min`;
      }
      return "";
    },
    formatGlyphLevel() {
      if (this.glyphLevel >= 10000) return `Glyph level: ${formatInt(this.glyphLevel)}`;
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
        : `${formatPercents(Math.min(((level - Math.floor(level))), 0.999), 1)}`;
    },
    update() {
      this.hasRealityStudy = TimeStudy.reality.isBought;
      this.canReality = isRealityAvailable();
      if (!this.canReality) {
        this.shardsGained = 0;
        return;
      }
      function EPforRM(rm) {
        const adjusted = Decimal.divide(rm, MachineHandler.realityMachineMultiplier);
        if (adjusted.lte(1)) return Decimal.pow10(4000);
        if (adjusted.lte(10)) return Decimal.pow10(4000 / 27 * (adjusted.toNumber() + 26));
        let result = Decimal.pow10(4000 * (adjusted.log10() / 3 + 1));
        if (!PlayerProgress.realityUnlocked() && result.gte("1e6000")) {
          result = result.div("1e6000").pow(4).times("1e6000");
        }
        return result;
      }
      const multiplier = simulatedRealityCount(false) + 1;
      const availableRM = MachineHandler.hardcapRM.minus(Currency.realityMachines.value);
      this.machinesGained = MachineHandler.gainedRealityMachines.times(multiplier).clampMax(availableRM);
      this.imaginaryMachinesGained = MachineHandler.gainedImaginaryMachines.times(multiplier);
      this.realityTime = Time.thisRealityRealTime.totalMinutes;
      this.glyphLevel = gainedGlyphLevel().actualLevel;
      this.nextGlyphPercent = this.percentToNextGlyphLevelText();
      this.nextMachineEP = EPforRM(this.machinesGained.plus(1));
      this.ppGained = multiplier;
      this.shardsGained = Effarig.shardsGained * multiplier;

      const teresaReward = this.formatScalingMultiplierText(
        "Glyph Sacrifice",
        Teresa.runRewardMultiplier,
        Math.max(Teresa.runRewardMultiplier, Teresa.rewardMultiplier(Currency.antimatter.value)));
      const teresaThreshold = this.formatThresholdText(
        Teresa.rewardMultiplier(Currency.antimatter.value) > Teresa.runRewardMultiplier,
        player.celestials.teresa.bestRunAM,
        "antimatter");
      this.celestialRunText = [
        [Teresa.isRunning, teresaReward, teresaThreshold]];
    },
    handleClick() {
      if (TimeStudy.reality.isBought && Currency.eternityPoints.exponent >= 4000) {
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
    <button
      :class="['l-reality-button', 'c-reality-button', 'infotooltip',
        canReality ? 'c-reality-button--unlocked' : 'c-reality-button--locked']"
      @click="handleClick"
    >
      <div class="l-reality-button__contents">
        <template v-if="canReality">
          <div class="c-reality-button__header">Make a new Reality</div>
          <div>{{ formatMachinesGained }}</div>
          <div>{{ formatMachineStats }}</div>
          <div>{{ formatGlyphLevel }}</div>
        </template>
        <template v-else-if="hasRealityStudy">
          <div>Get {{ format("1e4000") }} Eternity Points to unlock a new Reality</div>
        </template>
        <template v-else>
          <div>Purchase the study in the Eternity tab to unlock a new Reality</div>
        </template>
        <div class="infotooltiptext" v-if="canReality">
          <div>Other resources gained:</div>
          <div>{{ ppGained }} Perk {{ "Point" | pluralize(ppGained) }}</div>
          <div v-if="shardsGained !== 0">{{ shardsGainedText }}</div>
          <div v-for="celestialInfo in celestialRunText">
            <span v-if="celestialInfo[0]">
              {{ celestialInfo[1] }}
              <br>
              {{ celestialInfo[2] }}
            </span>
          </div>
        </div>
      </div>
    </button>`
});
