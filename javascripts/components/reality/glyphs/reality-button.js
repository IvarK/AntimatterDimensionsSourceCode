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
      expGained: 0,
      raUnlocked: false
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
      return `${this.shorten(this.shardsGained, 2)} Relic Shards (Effarig)`;
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
        const adjusted = Decimal.divide(rm, Teresa.rmMultiplier * player.celestials.teresa.rmMult);
        if (adjusted.lte(1)) return Decimal.pow10(4000);
        return Decimal.pow10(Math.ceil(4000 * (adjusted.log10() / 3 + 1)));
      }
      this.canReality = true;
      this.machinesGained = gainedRealityMachines();
      this.realityTime = Time.thisRealityRealTime.totalMinutes;
      this.glyphLevel = gainedGlyphLevel().actualLevel;
      this.nextGlyphPercent = percentToNextGlyphLevel();
      this.nextMachineEP = EPforRM(this.machinesGained.plus(1));
      this.shardsGained = Effarig.shardsGained;
      this.expGained = Ra.gainedExp(this.glyphLevel);
      this.raUnlocked = V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]);
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
          <div>1 Perk Point</div>
          <div v-if="shardsGained !== 0">{{shardsGainedText}}</div>
          <div v-if="raUnlocked">{{ expGained }} Teresa memories (Ra)</div>
        </template>
        <template v-else>
          No resources gained
        </template>
      </div>
    </div>
  </button>
  `
});