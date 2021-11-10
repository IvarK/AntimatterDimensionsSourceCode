import "../infinity-upgrade-button.js";

Vue.component("ip-multiplier-button", {
  data() {
    return {
      isAutobuyerActive: false,
      isAutoUnlocked: false,
      isCapped: false
    };
  },
  watch: {
    isAutobuyerActive(newValue) {
      Autobuyer.ipMult.isActive = newValue;
    }
  },
  computed: {
    upgrade() {
      return InfinityUpgrade.ipMult;
    }
  },
  methods: {
    update() {
      this.isAutoUnlocked = Autobuyer.ipMult.isUnlocked;
      this.isAutobuyerActive = Autobuyer.ipMult.isActive;
      this.isCapped = this.upgrade.isCapped;
    },
    buyMaxIPMult() {
      InfinityUpgrade.ipMult.buyMax();
    }
  },
  template: `
    <div class="l-spoon-btn-group">
      <infinity-upgrade-button
        :upgrade="upgrade"
        class="o-infinity-upgrade-btn--multiplier"
      >
        <template v-if="isCapped">
          <br>
          <span>(Capped at {{ quantify("Infinity Point", upgrade.config.costCap) }})</span>
        </template>
      </infinity-upgrade-button>
      <primary-button
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
        @click="buyMaxIPMult()"
      >
        Max Infinity Point mult
      </primary-button>
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerActive"
        text="Autobuy IP mult"
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      />
    </div>`
});
