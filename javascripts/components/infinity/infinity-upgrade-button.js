Vue.component("infinity-upgrade-button", {
  props: {
    upgrade: Object
  },
  data: function() {
    return {
      isAvailable: false,
      isBought: false,
      effectValue: new Decimal(0),
      effectDisplay: String.empty
    };
  },
  computed: {
    classObject: function() {
      const isAvailable = this.isAvailable;
      const isBought = this.isBought;
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--bought": isBought,
        "o-infinity-upgrade-btn--available": !isBought && isAvailable,
        "o-infinity-upgrade-btn--unavailable": !isBought && !isAvailable
      };
    },
    hasDynamicEffectDisplay: function() {
      return this.upgrade.hasDynamicEffectDisplay;
    },
    dynamicEffectDisplay: function() {
      const upgrade = this.upgrade;
      if (upgrade.hasComplexEffect) {
        return this.effectDisplay;
      }
      return upgrade.formatEffectValue(this.effectValue, this.formatter);
    },
    hasStaticEffectDisplay: function() {
      return this.upgrade.hasStaticEffectDisplay;
    },
    staticEffectDisplay: function() {
      return this.upgrade.staticEffect;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought;
      this.isAvailable = upgrade.isAvailable;
      if (upgrade.hasComplexEffect) {
        this.effectDisplay = upgrade.formatComplexEffect(this.formatter);
      }
      else if (this.hasDynamicEffectDisplay) {
        this.effectValue.copyFrom(new Decimal(upgrade.effectValue));
      }
    },
    purchase() {
      this.upgrade.purchase();
      this.update();
    }
  },
  template:
    `<button :class="classObject" @click="purchase">
      {{upgrade.description}}
      <br v-if="hasDynamicEffectDisplay || hasStaticEffectDisplay">
      <span v-if="hasDynamicEffectDisplay">Currently: {{dynamicEffectDisplay}}</span>
      <span v-else-if="hasStaticEffectDisplay">{{staticEffectDisplay}}</span>
      <br>
      <span>Cost {{upgrade.cost}} IP</span>
    </button>`
});