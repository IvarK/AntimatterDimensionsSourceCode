"use strict";

Vue.component("reality-reminder", {
  data() {
    return {
      isVisible: false,
      ecCount: 0,
      currLog10EP: 0,
      cheapestLog10TD: 0,
      multEPLog10Cost: 0,
      purchasableTS: 0,
      hasDilated: 0,
      availableCharges: 0,
    };
  },
  computed: {
    suggestions() {
      const arr = [];
      if (this.purchasableTS > 0) {
        arr.push(`Purchase more studies (${formatInt(this.purchasableTS)} available)`);
      }
      if (this.currLog10EP > 1.1 * this.cheapestLog10TD) {
        arr.push(`Purchase more TDs (cheapest: ${format(Decimal.pow10(this.cheapestLog10TD))} EP)`);
      }
      if (this.currLog10EP > 1.1 * this.multEPLog10Cost) {
        arr.push(`Purchase more ${formatX(5)} EP (cost: ${format(Decimal.pow10(this.multEPLog10Cost))} EP)`);
      }
      if (this.ecCount < 60) {
        arr.push(`Finish the rest of your ECs (${formatInt(this.ecCount)}/${formatInt(60)})`);
      }
      if (!this.hasDilated) {
        arr.push("Perform a Dilated Eternity");
      }
      if (this.availableCharges > 0) {
        arr.push(`Charge more Infinity Upgrades (${formatInt(this.availableCharges)} available)`);
      }
      return arr;
    }
  },
  methods: {
    update() {
      this.isVisible = TimeStudy.reality.isBought && this.suggestions.length !== 0;
      this.ecCount = EternityChallenges.completions;
      this.currLog10EP = player.eternityPoints.log10();
      this.cheapestLog10TD = Math.min(...Array.dimensionTiers.map(x => TimeDimension(x).cost.log10()));
      this.multEPLog10Cost = EternityUpgrade.epMult.cost.log10();
      this.purchasableTS = NormalTimeStudyState.studies.countWhere(s => s && s.canBeBought && !s.isBought) +
        TriadStudyState.studies.countWhere(s => s && s.canBeBought && !s.isBought);
      // This assumes that TP was only ever retroactively multiplied by the perks
      this.hasDilated = player.dilation.tachyonParticles.pLog10() - 1 > DilationUpgrade.tachyonGain.effectValue.log10();
      this.availableCharges = Ra.chargesLeft;
    },
  },
  template: `
    <div
      v-if="isVisible"
      class="c-reality-reminder"
    >
      You may want to do the following before Reality:
      <br>
      <br>
      <div v-for="suggestion in suggestions">
        {{ suggestion }}
      </div>
    </div>`
});
