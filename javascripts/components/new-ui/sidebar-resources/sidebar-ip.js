"use strict";

Vue.component("sidebar-ip", {
  data() {
    return {
      ip: new Decimal(0),
      gained: new Decimal(0),
      showCrunch: false
    };
  },
  props: {
    cond: Boolean
  },
  methods: {
    update() {
      this.ip.copyFrom(player.infinityPoints);
      this.gained.copyFrom(gainedInfinityPoints());
      this.showCrunch = player.money.gte(Number.MAX_VALUE) && player.break;
    },
    infinity() {
      if (this.showCrunch) {
        bigCrunchResetRequest();
      }
    }
  },
  template:
  `<div class="resource" @click="infinity" :class=" { 'resource-infinity-canreset': showCrunch }">
    <div v-if="cond">
      <h2 id="ip">{{ shorten(ip, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">{{ showCrunch ? "Infinity now for" : "Infinity Points" }}</span>
        <span v-if="showCrunch" class="resource-per-second"> +{{ shorten(gained) }} IP</span>
      </div>
    </div>
  </div>`
});