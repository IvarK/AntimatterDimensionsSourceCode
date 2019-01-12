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
    tooltipText() {
      if (!this.canReality) {
        return "No rewards";
      } else {
        let otherResourceText = "Other resources gained:<br><br>1 Perk Point";
        if (this.shardsGained != 0) {
          otherResourceText += "<br>" + shorten(this.shardsGained, 2) + " Relic Shards (Teresa)"
        }
        return otherResourceText
      }
    }
  },
  methods: {
    update() {
      if (player.dilation.studies.length < 6) {
        this.canReality = false;
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
        {{tooltipText}}
      </div>
    </div>
  </button>
  `
});