"use strict";

Vue.component("break-infinity-button", {
  data() {
    return {
      isBroken: false,
      isUnlocked: false,
      isEnslaved: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--color-2": true,
        "o-infinity-upgrade-btn--available": this.isUnlocked,
        "o-infinity-upgrade-btn--unavailable": !this.isUnlocked,
      };
    },
    tooltip() {
      if (this.isEnslaved) return "...eons stacked on eons stacked on eons stacked on eons stacked on ...";
      return this.isUnlocked
        ? "Cost multipliers post-infinity will begin increasing faster, but so will the Infinity Point gain"
        : undefined;
    },
    text() {
      if (this.isEnslaved) return "FEEL ETERNITY";
      return this.isBroken ? "FIX INFINITY" : "BREAK INFINITY"
    }
  },
  methods: {
    update() {
      this.isBroken = player.break;
      this.isUnlocked = Autobuyer.bigCrunch.hasMaxedInterval;
      this.isEnslaved = Enslaved.isRunning;
    },
    clicked() {
      if (this.isEnslaved) Enslaved.feelEternity();
      else breakInfinity();
    }
  },
  template:
    `<button
      v-tooltip="tooltip"
      :class="classObject"
      @click="clicked"
    >{{text}}</button>`
});
