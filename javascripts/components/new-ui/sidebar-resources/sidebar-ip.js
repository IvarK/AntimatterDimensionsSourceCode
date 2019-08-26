"use strict";

Vue.component("sidebar-ip", {
  data() {
    return {
      ip: new Decimal(0),
    };
  },
  props: {
    cond: Boolean
  },
  methods: {
    update() {
      this.ip.copyFrom(player.infinityPoints);
      this.showCrunch = player.break && player.antimatter.gte(Decimal.MAX_NUMBER) &&
      !NormalChallenge.isRunning && !InfinityChallenge.isRunning;
      if (!this.showCrunch) return;
      const gainedIP = gainedInfinityPoints();
      this.gained.copyFrom(gainedIP);
      this.peakIPPM.copyFrom(player.bestIPminThisInfinity);
      this.currentIPPM.copyFrom(gainedIP.dividedBy(Time.thisInfinity.totalMinutes));
    },
    infinity() {
      if (this.showCrunch) {
        bigCrunchResetRequest();
      }
    },
  },
  computed: {
    crunchPeaks() {
      return `${shorten(this.currentIPPM, 2, 0)} IP/min<br>Peaked at ${shorten(this.peakIPPM, 2, 0)} IP/min`;
    },
  },
  template:
  `<div class="resource">
    <div v-if="cond">
      <h2 class="o-sidebar-infinity-button">{{ shorten(ip, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">Infinity Points</span>
      </div>
    </div>
  </div>`
});