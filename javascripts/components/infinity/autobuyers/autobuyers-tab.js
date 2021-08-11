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
      <simple-autobuyers-multi-box />
      <template v-if="hasContinuum">
        Continuum makes Antimatter Dimension and Tickspeed Autobuyers obsolete, as you now automatically have a
        <br>
        certain amount of simulated Antimatter Dimension and Tickspeed purchases based on your antimatter.
      </template>
    </div>`
});

Vue.component("simple-autobuyers-multi-box", {
  // There are two types of display: multiple and single. They must be treated differently.
  computed: {
    mutliple() {
      return Autobuyers.display[0];
    },
    singles() {
      return Autobuyers.display[1];
    }
  },
  template: `
    <span>
      <span>
        <multiple-autobuyers-box
          v-for="(type, id) in mutliple"
          :autobuyers="type"
          :key="id"
        />
      </span>
      <span>
        <single-autobuyer-box
          v-for="(type, id) in singles"
          :autobuyer="type"
          :key="id"
        />
      </span>
    </span>`
});
