import "../../../common/effect-display.js";
import "../../../common/cost-display.js";
import "../../../common/description-display.js";

Vue.component("perk-shop-upgrade", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isAvailableForPurchase: false,
      isCapped: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-teresa-shop-button": true,
        "o-teresa-shop-button--available": this.isAvailableForPurchase && !this.isCapped,
        "o-teresa-shop-button--capped": this.isCapped
      };
    }
  },
  methods: {
    update() {
      this.isAvailableForPurchase = this.upgrade.isAvailableForPurchase;
      this.isCapped = this.upgrade.isCapped;
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <button :class="classObject" @click="upgrade.purchase()">
        <description-display
          :config="upgrade.config"
          :length="70"
        />
        <br>
        <effect-display :config="upgrade.config" />
        <br>
        <cost-display
          v-if="!isCapped"
          :config="upgrade.config"
          name="Perk Point"
        />
      </button>
    </div>`
});
