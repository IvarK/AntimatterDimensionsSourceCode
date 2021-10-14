"use strict";

Vue.component("reality-reminder", {
  data() {
    return {
      isVisible: false,
      ecCount: 0,
      missingAchievements: 0,
      unpurchasedDilationUpgrades: 0,
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
        arr.push(`Purchase more Time Studies (${formatInt(this.purchasableTS)} available)`);
      }
      if (this.missingAchievements > 0) {
        arr.push(`Complete the rest of your Achievements (${formatInt(this.missingAchievements)} left)`);
      }
      if (this.unpurchasedDilationUpgrades > 0) {
        arr.push(`Purchase the remaining Dilation Upgrades (${formatInt(this.unpurchasedDilationUpgrades)} left)`);
      }
      if (this.currLog10EP > 1.1 * this.cheapestLog10TD) {
        arr.push(`Purchase more TDs (cheapest: ${format(Decimal.pow10(this.cheapestLog10TD))} EP)`);
      }
      if (this.currLog10EP > 1.1 * this.multEPLog10Cost) {
        arr.push(`Purchase more ${formatX(5)} EP (cost: ${format(Decimal.pow10(this.multEPLog10Cost))} EP)`);
      }
      if (this.ecCount < 60) {
        arr.push(`Finish the rest of your ECs (Done: ${formatInt(this.ecCount)}/${formatInt(60)})`);
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
      // TODO: replace the true with "this.suggestions.length !== 0" after making it so this does not flicker the rest of the glyph tab sidebar
      this.isVisible = TimeStudy.reality.isBought && !isInCelestialReality() && true;
      this.ecCount = EternityChallenges.completions;
      this.missingAchievements = Achievements.preReality.countWhere(a => !a.isUnlocked);
      // Repeatable dilation upgrades don't have isBought, but do have boughtAmount
      this.unpurchasedDilationUpgrades = Object.values(DilationUpgrade)
        .countWhere(u => (u.isBought === undefined ? u.boughtAmount === 0 : !u.isBought));
      this.currLog10EP = player.eternityPoints.log10();
      this.cheapestLog10TD = Math.min(...TimeDimensions.all.map(x => x.cost.log10()));
      this.multEPLog10Cost = EternityUpgrade.epMult.cost.log10();
      this.purchasableTS = NormalTimeStudyState.studies.countWhere(s => s && s.canBeBought && !s.isBought) +
        TriadStudyState.studies.countWhere(s => s && s.canBeBought && !s.isBought);
      this.hasDilated = player.dilation.lastEP.gt(0);
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
