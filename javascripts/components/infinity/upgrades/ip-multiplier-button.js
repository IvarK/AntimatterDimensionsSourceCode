"use strict";

Vue.component("ip-multiplier-button", {
  data() {
    return {
      isAutobuyerOn: false,
      isAutoUnlocked: false,
      isCapped: false
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      player.infMultBuyer = newValue;
    }
  },
  computed: {
    upgrade() {
      return InfinityUpgrade.ipMult;
    }
  },
  methods: {
    update() {
      this.isAutoUnlocked = EternityMilestone.autobuyerIPMult.isReached;
      this.isAutobuyerOn = player.infMultBuyer;
      this.isCapped = this.upgrade.isCapped;
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <infinity-upgrade-button
        :upgrade="upgrade"
        class="o-infinity-upgrade-btn--multiplier"
      >
        <template v-if="isCapped">
          <br>
          <span>(Capped at {{shorten(upgrade.config.costCap, 0, 0)}} IP)</span>
        </template>
      </infinity-upgrade-button>
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Autobuy IP mult"
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      />
    </div>`
});