"use strict";

Vue.component("autobuyers-tab", {
  data: () => ({
    hasContinuum: false,
    displayADAutobuyersInOneRow: false,
  }),
  methods: {
    update() {
      this.hasContinuum = Laitela.continuumActive;
      const sameIntervalSet = new Set(Autobuyers.antimatterDimensions.map(x => x.interval));
      const sameInterval = !sameIntervalSet.has(undefined) && sameIntervalSet.size === 1;
      const sameBulk = Autobuyer.antimatterDimension(1).hasUnlimitedBulk;
      this.displayADAutobuyersInOneRow = sameInterval && sameBulk;
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
      <dimension-autobuyer-box v-if="!displayADAutobuyersInOneRow" v-for="tier in 8" :key="tier" :tier="tier" />
      <tickspeed-autobuyer-box v-if="!hasContinuum" />
      <simple-autobuyers-multi-box />
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
