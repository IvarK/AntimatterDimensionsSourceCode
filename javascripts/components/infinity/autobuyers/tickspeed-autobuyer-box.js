"use strict";

Vue.component("tickspeed-autobuyer-box", {
  data() {
    return {
      mode: AutobuyerMode.BUY_SINGLE
    };
  },
  computed: {
    autobuyer() {
      return Autobuyer.tickspeed;
    },
    boxSetup() {
      return new AutobuyerBoxSetup("Tickspeed Autobuyer", this.autobuyer);
    },
    modeDisplay() {
      switch (this.mode) {
        case AutobuyerMode.BUY_SINGLE: return "Buys singles";
        case AutobuyerMode.BUY_MAX: return "Buys max";
      }
      throw "Unknown tickspeed autobuyer mode";
    }
  },
  methods: {
    update() {
      if (!this.autobuyer.isUnlocked) return;
      this.mode = this.autobuyer.mode;
    },
    toggleMode() {
      this.autobuyer.toggleMode();
      this.update();
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <template slot="beforeInterval">
        <autobuyer-interval-button :autobuyer="autobuyer" />
        <button class="o-autobuyer-btn" @click="toggleMode">{{modeDisplay}}</button>
      </template>
      <autobuyer-priority-selector :autobuyer="autobuyer"/>
      <br>
    </autobuyer-box>`
});