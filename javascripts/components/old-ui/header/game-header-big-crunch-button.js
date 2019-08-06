"use strict";

Vue.component("game-header-big-crunch-button", {
  data() {
    return {
      isVisible: false,
      gainedIP: new Decimal(0),
      currentIPPM: new Decimal(0),
      peakIPPM: new Decimal(0),
      currentIP: new Decimal(0),
    };
  },
  computed: {
    peakIPPMThreshold: () => new Decimal("1e100"),
    isPeakIPPMVisible() { 
      return this.peakIPPM.lte(this.peakIPPMThreshold);
    },
    amountStyles() {
      const ratio = this.gainedIP.log10() / this.currentIP.log10();
      const rgb = [(1 - ratio) * 10 * 255, 0, (ratio - 1) * 10 * 255];
      return { color: `rbg(${rgb.join(",")})` };
    }
  },
  methods: {
    update() {
      this.isVisible = player.break && player.antimatter.gte(Decimal.MAX_NUMBER) &&
        !NormalChallenge.isRunning && !InfinityChallenge.isRunning;
      if (!this.isVisible) return;
      const gainedIP = gainedInfinityPoints();
      this.currentIP.copyFrom(player.infinityPoints);
      this.gainedIP.copyFrom(gainedIP);
      this.peakIPPM.copyFrom(IPminpeak);
      if (this.isPeakIPPMVisible) {
        this.currentIPPM.copyFrom(gainedIP.dividedBy(Time.thisInfinity.totalMinutes));
      }
    }
  },
  template:
    `<button
      v-if="isVisible"
      class="o-prestige-btn o-prestige-btn--big-crunch l-game-header__big-crunch-btn"
      onclick="bigCrunchResetRequest()"
    >
      <b>Big Crunch for 
      <span :style="amountStyles">{{shortenDimensions(gainedIP)}}</span> 
      Infinity {{ "point" | pluralize(gainedIP) }}.</b>
      <template v-if="isPeakIPPMVisible">
        <br>
        {{shortenDimensions(currentIPPM)}} IP/min
        <br>
        Peaked at {{shortenDimensions(peakIPPM)}} IP/min
      </template>
    </button>`
});
