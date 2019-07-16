"use strict";

Vue.component("game-header-big-crunch-button", {
  data: function() {
    return {
      isVisible: false,
      gainedIP: new Decimal(0),
      currentIPPM: new Decimal(0),
      peakIPPM: new Decimal(0),
    };
  },
  computed: {
    peakIPPMThreshold: function() {
      return new Decimal("1e100");
    },
    isPeakIPPMVisible: function() {
      return this.peakIPPM.lte(this.peakIPPMThreshold);
    }
  },
  methods: {
    update() {
      this.isVisible = player.break && player.money.gte(Decimal.MAX_NUMBER) &&
        !NormalChallenge.isRunning && !InfinityChallenge.isRunning;
      if (!this.isVisible) return;
      const gainedIP = gainedInfinityPoints();
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
      <b>Big Crunch for {{shortenDimensions(gainedIP)}} Infinity {{ "point" | pluralize(gainedIP) }}.</b>
      <template v-if="isPeakIPPMVisible">
        <br>
        {{shortenDimensions(currentIPPM)}} IP/min
        <br>
        Peaked at {{shortenDimensions(peakIPPM)}} IP/min
      </template>
    </button>`
});
