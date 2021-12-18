import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

Vue.component("perk-shop-upgrade", {
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
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
        <DescriptionDisplay
          :config="upgrade.config"
          :length="70"
        />
        <br>
        <EffectDisplay :config="upgrade.config" />
        <br>
        <CostDisplay
          v-if="!isCapped"
          :config="upgrade.config"
          name="Perk Point"
        />
      </button>
    </div>`
});
