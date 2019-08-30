"use strict";

Vue.component("sidebar-ep", {
  data() {
    return {
      ep: new Decimal(0),
      showEternity: false,
      gainedEP: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.ep.copyFrom(player.eternityPoints);
      this.showEternity = player.infinityPoints.gte(Player.eternityGoal);
      const gainedEP = gainedEternityPoints();
      this.gainedEP.copyFrom(gainedEP);
    },
  },
  template:
  `<div class="resource">
    <h2 class="o-sidebar-eternity-button">{{ shorten(ep, 2, 0) }}</h2>
    <div class="resource-information">
      <span class="resource-name">Eternity {{ "Point" | pluralize(ep) }}</span>
      <span class="resource-gain" v-if="showEternity">+{{shorten(gainedEP, 2, 0)}}</span>
    </div>
  </div>`
});