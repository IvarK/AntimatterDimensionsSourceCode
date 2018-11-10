Vue.component("infinity-upgrade-button", {
  props: {
    upgrade: Object
  },
  data: function() {
    return {
      cost: 0,
      isAvailable: false,
      isBought: false,
      effectValue: new Decimal(0),
      effectDisplay: String.empty,
      isCapped: false
    };
  },
  computed: {
    classObject: function() {
      const isAvailable = this.isAvailable;
      const isBought = this.isBought || this.isCapped;
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
    },
    capDisplay: function() {
      return this.upgrade.formatCapValue(this.formatter);
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.cost = upgrade.formatCost(this.formatter);
      this.isBought = upgrade.isBought;
      this.isAvailable = upgrade.isAvailable;
      this.isCapped = upgrade.isCapped;
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
      <span v-if="isCapped">{{capDisplay}}</span>
      <span v-else>Cost {{cost}} IP</span>
    </button>`
});

class InfinityUpgradeViewModel {
  constructor(props) {
    this._upgrade = props.upgrade;
    this._description = props.description;
    this._formatCurrentEffect = props.formatCurrentEffect;
    this._staticEffect = props.staticEffect;
    this._formatComplexEffect = props.formatComplexEffect;
  }

  formatCost(formatter) {
    return this._upgrade.cost.toString();
  }

  get isCapped() {
    return false;
  }

  formatCapValue(formatter) {
    return String.empty;
  }

  get description() {
    return this._description;
  }

  get isBought() {
    return this._upgrade.isBought;
  }

  get isAvailable() {
    return this._upgrade.isAvailable;
  }

  get hasStaticEffectDisplay() {
    return this._staticEffect !== undefined;
  }

  get staticEffect() {
    return this._staticEffect;
  }

  get hasDynamicEffectDisplay() {
    return this._upgrade.hasDynamicEffect;
  }

  get effectValue() {
    return this._upgrade.effectValue;
  }

  formatEffectValue(value, formatter) {
    return this._formatCurrentEffect(value, formatter);
  }

  get hasComplexEffect() {
    return this._formatComplexEffect !== undefined;
  }

  formatComplexEffect(formatter) {
    return this._formatComplexEffect(formatter);
  }

  purchase() {
    this._upgrade.purchase();
  }
}