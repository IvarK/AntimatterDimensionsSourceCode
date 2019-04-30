"use strict";

Vue.component("autobuyer-interval-button", {
  props: {
    autobuyer: Object
  },
  data() {
    return {
      cost: 0,
      isMaxed: false
    };
  },
  methods: {
    update() {
      this.cost = this.autobuyer.cost;
      this.isMaxed = this.autobuyer.hasMaxedInterval;
    },
    upgradeInterval() {
      this.autobuyer.upgradeInterval();
    }
  },
  template:
    `<button
      v-if="!isMaxed"
      class="o-autobuyer-btn l-autobuyer-box__button"
      @click="upgradeInterval"
    >40% smaller interval<br>Cost: {{shortenDimensions(cost)}} IP</button>`
});