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
      player.auto.infMultBuyer = newValue;
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
      this.isAutobuyerOn = player.auto.infMultBuyer;
      this.isCapped = this.upgrade.isCapped;
    },
    buyMaxIPMult() {
      InfinityUpgrade.ipMult.autobuyerTick();
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
          <span>(Capped at {{format(upgrade.config.costCap, 0, 0)}} Infinity Points)</span>
        </template>
      </infinity-upgrade-button>
      <primary-button
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
        @click="buyMaxIPMult()"
      >Max Infinity Point mult</primary-button>
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Autobuy IP mult"
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      />
    </div>`
});
