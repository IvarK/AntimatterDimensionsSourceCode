"use strict";

Vue.component("autobuyers-tab", {
  data: () => ({
    hasContinuum: false,
    displayADAutobuyersIndividually: false,
  }),
  methods: {
    update() {
      this.hasContinuum = Laitela.continuumActive;
      this.displayADAutobuyersIndividually = Autobuyer.antimatterDimension(1).hasUnlimitedBulk;
    }
  },
  template: `
    <div class="l-autobuyers-tab">
      <autobuyer-toggles />
      <open-modal-shortcuts />
      <reality-autobuyer-box />
      <eternity-autobuyer-box />
      <big-crunch-autobuyer-box />
      <galaxy-autobuyer-box />
      <dimboost-autobuyer-box />
      <sacrifice-autobuyer-box />
      <dimension-autobuyer-box v-if="!displayADAutobuyersIndividually" v-for="tier in 8" :key="tier" :tier="tier" />
      <tickspeed-autobuyer-box v-if="!hasContinuum" />
      <many-autobuyers />
      <template v-if="hasContinuum">
        Continuum makes Antimatter Dimension and Tickspeed Autobuyers obsolete, as you now automatically have a
        <br>
        certain amount of simulated Antimatter Dimension and Tickspeed purchases based on your antimatter.
      </template>
    </div>`
});
