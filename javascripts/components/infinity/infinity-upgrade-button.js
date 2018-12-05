Vue.component("infinity-upgrade-button", {
  props: {
    upgrade: Object
  },
  data: function() {
    return {
      cost: String.empty,
      description: String.empty,
      isAvailable: false,
      isBought: false,
      effectValue: new Decimal(0),
      complexEffect: String.empty,
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
    effectDisplay: function() {
      const upgrade = this.upgrade;
      if (upgrade.hasComplexEffect) {
        return this.complexEffect;
      }
      if (upgrade.hasDynamicEffect) {
        return `Currently: ${upgrade.formatEffectValue(this.effectValue, this.formatter)}`;
      }
      if (upgrade.hasStaticEffectDisplay) {
        return upgrade.staticEffect;
      }
    },
    capDisplay: function() {
      return this.upgrade.formatCapValue(this.formatter);
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.cost = upgrade.formatCost(this.formatter);
      this.description = upgrade.description;
      this.isBought = upgrade.isBought;
      this.isAvailable = upgrade.isAvailable;
      this.isCapped = upgrade.isCapped;
      if (upgrade.hasComplexEffect) {
        this.complexEffect = upgrade.formatComplexEffect(this.formatter);
      }
      else if (upgrade.hasDynamicEffect) {
        this.effectValue.copyFrom(new Decimal(upgrade.effectValue));
      }
    },
    purchase() {
      this.upgrade.purchase();
    }
  },
  template:
    `<button :class="classObject" @click="purchase">
      {{description}}
      <template v-if="effectDisplay">
        <br>
        <span>{{effectDisplay}}</span>
      </template>
      <br>
      <span v-if="isCapped">{{capDisplay}}</span>
      <span v-else-if="!isBought">Cost {{cost}} IP</span>
    </button>`
});

class InfinityUpgradeSetup {
  constructor(props) {
    this._upgrade = props.upgrade;
    this._description = props.description;
    this._formatEffect = props.formatEffect;
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
    const description = this._description;
    return typeof description === "function" ? description() : description;
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

  get hasDynamicEffect() {
    return this._formatEffect !== undefined;
  }

  get effectValue() {
    return this._upgrade.effectValue;
  }

  formatEffectValue(value, formatter) {
    return this._formatEffect(value, formatter);
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