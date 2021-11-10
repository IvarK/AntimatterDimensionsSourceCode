import "../../common/cost-display.js";
import "../../common/effect-display.js";
import "../../common/description-display.js";

Vue.component("black-hole-upgrade-button", {
  props: {
    config: Object
  },
  data() {
    return {
      isAffordable: false,
      isCapped: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.blackHolePower(this.config.upgrade.id).isActive = newValue;
    }
  },
  computed: {
    effectConfig() {
      const { config } = this;
      return {
        effect: () => config.upgrade.value,
        formatEffect: value => config.formatEffect(value)
      };
    },
    costConfig() {
      const { config } = this;
      return {
        cost: () => config.upgrade.cost,
        formatCost: value => format(value, 2, 0)
      };
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--unavailable": !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      this.isCapped = this.config.upgrade.value === 0;
      this.isAffordable = this.config.upgrade.isAffordable && !this.isCapped;
      const hasAutobuyer = this.config.upgrade.hasAutobuyer;
      this.isAutoUnlocked = hasAutobuyer && Ra.has(RA_UNLOCKS.AUTO_BLACK_HOLE_POWER);
      this.isAutobuyerOn = hasAutobuyer && Autobuyer.blackHolePower(this.config.upgrade.id).isActive;
    }
  },
  template: `
    <div class="l-spoon-btn-group">
      <button
        :class="classObject"
        class="l-reality-upgrade-btn c-reality-upgrade-btn"
        @click="config.upgrade.purchase()"
      >
        <description-display :config="config" />
        <effect-display :config="effectConfig" :title="config.effectTitle" />
        <cost-display
          v-if="!isCapped"
          :config="costConfig"
          name="Reality Machine"
        />
      </button>
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Auto:"
        class="l--spoon-btn-group__little-spoon-reality-btn o-primary-btn--reality-upgrade-toggle"
      />
    </div>`
});
