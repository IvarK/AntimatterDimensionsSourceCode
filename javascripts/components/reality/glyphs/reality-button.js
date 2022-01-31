Vue.component("reality-button", {
  data() {
    return {
      canReality: false,
      hasRealityStudy: false,
      machinesGained: new Decimal(0),
      projectedRM: new Decimal(0),
      newIMCap: 0,
      realityTime: 0,
      glyphLevel: 0,
      nextGlyphPercent: 0,
      nextMachineEP: 0,
      shardsGained: 0,
      currentShardsRate: 0,
      celestialRunText: ["", "", "", "", ""]
    };
  },
  computed: {
    formatMachinesGained() {
      if (this.machinesGained.gt(0)) return `Machines gained: ${format(this.machinesGained, 2, 0)}`;
      return "No Machines gained";
    },
    formatMachineStats() {
      if (!PlayerProgress.realityUnlocked() && this.nextMachineEP.gt("1e8000")) {
        return `RM this Reality is capped!`;
      }
      if (this.machinesGained.gt(0) && this.machinesGained.lt(100)) {
        return `Next at ${format(this.nextMachineEP, 2)} EP`;
      }
      if (this.machinesGained.eq(0) && this.newIMCap === 0) {
        return `Projected: ${format(this.projectedRM, 2)} RM`;
      }
      if (this.newIMCap !== 0) {
        return `iM Cap: ${format(this.newIMCap, 2, 2)}i`;
      }
      if (this.machinesGained.lt(Number.MAX_VALUE)) {
        return `${format(this.machinesGained.divide(this.realityTime), 2, 2)} RM/min`;
      }
      return "";
    },
    formatGlyphLevel() {
      if (this.glyphLevel >= 10000) return `Glyph level: ${formatInt(this.glyphLevel)}`;
      return `Glyph level: ${formatInt(this.glyphLevel)}  (${this.nextGlyphPercent})`;
    },
    showShardsRate() {
      return this.currentShardsRate;
    },
    shardsGainedText() {
      return quantify("Relic Shard", this.shardsGained, 2);
    }
  },
  methods: {
    percentToNextGlyphLevelText() {
      const glyphState = getGlyphLevelInputs();
      let level = glyphState.actualLevel;
      if (!isFinite(level)) level = 0;
      const decimalPoints = this.glyphLevel > 1000 ? 0 : 1;
      return glyphState.capped
        ? "Capped"
        : `${formatPercents(Math.min(((level - Math.floor(level))), 0.999), decimalPoints)}`;
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
      this.projectedRM = MachineHandler.gainedRealityMachines.times(multiplier);
      this.newIMCap = MachineHandler.projectedIMCap;
      this.machinesGained = this.projectedRM.clampMax(MachineHandler.distanceToRMCap);
      this.realityTime = Time.thisRealityRealTime.totalMinutes;
      this.glyphLevel = gainedGlyphLevel().actualLevel;
      this.nextGlyphPercent = this.percentToNextGlyphLevelText();
      this.nextMachineEP = EPforRM(this.machinesGained.plus(1));
      this.ppGained = multiplier;
      this.shardsGained = Effarig.shardsGained * multiplier;
      this.currentShardsRate = (this.shardsGained / Time.thisRealityRealTime.totalSeconds);

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
      if (this.canReality) {
        requestManualReality();
      }
    },
    formatScalingMultiplierText(resource, before, after) {
      return `${resource} ${formatX(before, 2, 2)} ➜ ${formatX(after, 2, 2)}`;
    },
    formatThresholdText(condition, threshold, resourceName) {
      if (condition) return "";
      return `(${format(threshold, 2, 2)} ${resourceName} to improve)`;
    },
    // Make the button have a visual animation if Realitying will give a reward
    hasSpecialReward() {
      if (Teresa.isRunning && Teresa.rewardMultiplier(Currency.antimatter.value) > Teresa.runRewardMultiplier) {
        return true;
      }
      if (Effarig.isRunning && !EffarigUnlock.reality.isUnlocked && Currency.eternityPoints.value.exponent > 4000) {
        return true;
      }
      if (Enslaved.isRunning && !Enslaved.isCompleted && Currency.eternityPoints.value.exponent > 4000) return true;
      return false;
    },
    classObject() {
      return {
        "c-reality-button--unlocked": this.canReality,
        "c-reality-button--locked": !this.canReality,
        "c-reality-button--special": this.hasSpecialReward(),
      };
    }
  },
  template: `
    <div class="l-reality-button l-reality-button-group-half">
      <button
        class="c-reality-button infotooltip"
        :class="classObject()"
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
            <div>{{ quantifyInt("Perk Point", ppGained) }}</div>
            <div v-if="shardsGained !== 0">{{ shardsGainedText }} ({{ format(currentShardsRate, 2) }}/s)</div>
            <div v-for="celestialInfo in celestialRunText">
              <span v-if="celestialInfo[0]">
                {{ celestialInfo[1] }}
                <br>
                {{ celestialInfo[2] }}
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>`
});
