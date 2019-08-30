"use strict";

Vue.component("sidebar-ip", {
  data() {
    return {
      ip: new Decimal(0),
      showCrunch: false,
      gained: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.ip.copyFrom(player.infinityPoints);
      this.showCrunch = player.break && player.antimatter.gte(Decimal.MAX_NUMBER);
      if (!this.showCrunch) return;
      const gainedIP = gainedInfinityPoints();
      this.gained.copyFrom(gainedIP);
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
    <h2 class="o-sidebar-infinity-button">{{ shorten(ip, 2, 0) }}</h2>
    <div class="resource-information">
      <span class="resource-name">Infinity {{ "Point" | pluralize(ip) }}</span>
      <span class="resource-gain" v-if="showCrunch">+{{shorten(gained, 2, 0)}}</span>
    </div>
  </div>`
});