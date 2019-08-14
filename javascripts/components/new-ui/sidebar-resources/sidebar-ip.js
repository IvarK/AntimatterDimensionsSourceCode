"use strict";

Vue.component("sidebar-ip", {
  data() {
    return {
      ip: new Decimal(0),
      gained: new Decimal(0),
      showCrunch: false,
      peakIPPM: new Decimal(0),
      currentIPPM: new Decimal(0)
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
      if (!this.showCrunch) return
      const gainedIP = gainedInfinityPoints();
      this.gained.copyFrom(gainedIP);
      this.peakIPPM.copyFrom(IPminpeak);
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
      return `${shorten(this.currentIPPM, 2, 0)} IP/min<br>Peaked at ${shorten(this.peakIPPM, 2, 0)} IP/min`
    },
  },
  template:
  `<div 
    class="resource" 
    @click="infinity"
    :class=" { 'resource-infinity-canreset': showCrunch }"
    v-tooltip="crunchPeaks">
    <div v-if="cond || showCrunch">
      <h2 id="ip">{{ shorten(ip, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">{{ showCrunch ? "Infinity now for" : "Infinity Points" }}</span>
        <span v-if="showCrunch" class="resource-per-second"> +{{ shorten(gained, 2, 0) }} IP</span>
      </div>
    </div>
  </div>`
});