"use strict";

Vue.component("tickspeed-autobuyer-box", {
  data() {
    return {
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isUnlocked: false
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
      this.isUnlocked = this.autobuyer.isUnlocked;
    },
    toggleMode() {
      this.autobuyer.toggleMode();
      this.update();
    }
  },
  template: `
    <autobuyer-box :autobuyer="autobuyer" name="Tickspeed Autobuyer" showInterval>
      <autobuyer-interval-button :autobuyer="autobuyer" slot="intervalSlot" />
      <template slot="toggleSlot">
        <button class="o-autobuyer-btn" @click="toggleMode" v-if="isUnlocked">{{ modeDisplay }}</button>
        <button class="o-autobuyer-btn" v-else>Complete the challenge to change mode</button>
      </template>
    </autobuyer-box>`
});
