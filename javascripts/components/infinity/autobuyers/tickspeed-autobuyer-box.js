"use strict";

Vue.component("tickspeed-autobuyer-box", {
  data() {
    return {
      mode: AUTOBUYER_MODE.BUY_SINGLE
    };
  },
  computed: {
    autobuyer: () => Autobuyer.tickspeed,
    modeDisplay() {
      switch (this.mode) {
        case AUTOBUYER_MODE.BUY_SINGLE: return "Buys singles";
        case AUTOBUYER_MODE.BUY_MAX: return "Buys max";
      }
      throw "Unknown tickspeed autobuyer mode";
    }
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
    },
    toggleMode() {
      this.autobuyer.toggleMode();
      this.update();
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" name="Tickspeed Autobuyer" showInterval>
      <template slot="beforeInterval">
        <autobuyer-interval-button :autobuyer="autobuyer" />
        <button class="o-autobuyer-btn" @click="toggleMode">{{modeDisplay}}</button>
      </template>
      <div class="l-autobuyer-box__fill" />
      <autobuyer-priority-selector :autobuyer="autobuyer" class="l-autobuyer-box__priority-selector" />
    </autobuyer-box>`
});
