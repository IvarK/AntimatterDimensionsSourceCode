Vue.component("new-reality-button", {
  data: function () {
    return {
      canReality: false,
      machinesGained: 0,
      realityTime: 0,
      glyphLevel: 0,
      nextGlyphPercent: 0,
      nextMachineEP: 0,
      shardsGained: 0,
    };
  },
  computed: {
    buttonHeader() {
      return this.canReality ? "Make a new reality" : "Start reality over";
    },
    formatMachinesGained() {
      return "Machines gained: " + this.shortenDimensions(this.machinesGained);
    },
    formatMachineStats() {
      if (this.machinesGained < 100) {
        return "Next at 1e" + this.nextMachineEP + " EP";
      } else {
        return shortenRateOfChange(this.machinesGained/this.realityTime) + " RM/min"
      }
    },
    formatGlyphLevel() {
      return "Glyph level: " + this.glyphLevel + " (" + this.nextGlyphPercent + "%)"
    },
    shardsGainedText() {
        return this.shorten(this.shardsGained, 2) + " Relic Shards (Teresa)"
    }
  },
  methods: {
    update() {
      if (player.dilation.studies.length < 6) {
        this.canReality = false;
        this.shardsGained = 0;
      } else {
        this.canReality = true;
        this.machinesGained = gainedRealityMachines();
        this.realityTime = Time.thisRealityRealTime.totalMinutes;
        this.glyphLevel = gainedGlyphLevel();
        this.nextGlyphPercent = percentToNextGlyphLevel();
        this.nextMachineEP = logEPforRM(this.machinesGained.plus(1));
        this.shardsGained = Teresa.shardsGained;
      }
    },
    handleClick() {
      if (player.dilation.studies.length < 6) {
        startRealityOver();
      } else {
        reality();
      }
    },
  },
  template: `
  <button :class="['l-new-reality-button', 'c-new-reality-button', 'infotooltip',
                   canReality ? 'c-new-reality-button--good' : 'c-new-reality-button--bad']"
          @click="handleClick">
    <div class="l-new-reality-button__contents">
      <div class="c-new-reality-button__header">{{buttonHeader}}</div>
      <template v-if="canReality">
        <div>{{formatMachinesGained}}</div>
        <div>{{formatMachineStats}}</div>
        <div>{{formatGlyphLevel}}</div>
      </template><template v-else>
        <div>Purchase the study in the eternity tab to unlock a new reality</div>
      </template>
      <div class="infotooltiptext">
        <template v-if="canReality">
        <div>Other resources gained:</div>
        <div>1 Perk Point</div>
        <div v-if="shardsGained !== 0">{{shardsGainedText}}</div>
        </template>
        <template v-else>
        No resources gained
        </template>
      </div>
    </div>
  </button>
  `
});