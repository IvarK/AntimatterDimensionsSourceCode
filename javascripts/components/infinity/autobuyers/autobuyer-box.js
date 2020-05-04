"use strict";

Vue.component("autobuyer-box", {
  components: {
    "interval-label": {
      props: {
        autobuyer: Object
      },
      data() {
        return {
          interval: 0,
          hasMaxedInterval: false,
          bulk: 0,
          bulkUnlocked: false,
        };
      },
      computed: {
        intervalDisplay() {
          return format(TimeSpan.fromMilliseconds(this.interval).totalSeconds, 2, 2);
        }
      },
      methods: {
        update() {
          this.interval = this.autobuyer.interval;
          this.hasMaxedInterval = this.autobuyer.hasMaxedInterval;
          this.bulk = this.autobuyer.bulk;
          // If it's undefined, the autobuyer isn't the dimboost autobuyer
          // and we don't have to worry about bulk being unlocked.
          this.bulkUnlocked = this.autobuyer.isBulkBuyUnlocked !== false;
        }
      },
      template:
        `<div class="c-autobuyer-box__small-text">
          Current interval: {{intervalDisplay}} seconds
          <span v-if="hasMaxedInterval && bulkUnlocked && bulk">
            <br>Current bulk: {{formatX(bulk, 2)}}
          </span>
        </div>`
    }
  },
  props: {
    autobuyer: Object,
    name: String,
    showInterval: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isUnlocked: false,
      isActive: false,
      globalToggle: false,
      canBeBought: false,
      antimatterCost: new Decimal(0),
      isBought: false,
      antimatter: new Decimal(0)
    };
  },
  watch: {
    isActive(newValue) {
      this.autobuyer.isActive = newValue;
    }
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.isUnlocked = autobuyer.isUnlocked;
      this.isActive = autobuyer.isActive;
      this.globalToggle = player.options.autobuyersOn;
      this.canBeBought = this.autobuyer.canBeBought;
      this.antimatterCost = this.autobuyer.antimatterCost;
      this.isBought = this.autobuyer.isBought;
      this.antimatter.copyFrom(Currency.antimatter);
    },
    toggle() {
      this.isActive = !this.isActive;
    },
    purchase() {
      this.autobuyer.purchase();
    }
  },
  computed: {
    canBuy() {
      return this.antimatter.gte(this.antimatterCost);
    },
    autobuyerBuyBoxClass() {
      return {
        "c-autobuyer-buy-box--purchaseable": this.canBuy
      };
    },
    autobuyerToggleClass() {
      return this.isActive ? "fas fa-check" : "fas fa-times";
    },
    autobuyerStateClass() {
      return {
        "o-autobuyer-toggle-checkbox__label": true,
        "o-autobuyer-toggle-checkbox__label--active": this.isActive,
        "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
      };
    },
  },
  template:
    `<div v-if="isUnlocked || isBought" class="c-autobuyer-box-row">
      <div class="l-autobuyer-box__header">
        {{name}}
        <interval-label v-if="showInterval" :autobuyer="autobuyer"/>
      </div>
      <div class="c-autobuyer-box-row__intervalSlot"><slot name="intervalSlot" /></div>
      <div class="c-autobuyer-box-row__toggleSlot"><slot name="toggleSlot" /></div>
      <div class="c-autobuyer-box-row__prioritySlot"><slot name="prioritySlot" /></div>
      <div class="c-autobuyer-box-row__optionSlot"><slot name="optionSlot" /></div>
      <div class="l-autobuyer-box__footer" @click="toggle">
        <label
          :for="name"
          :class="autobuyerStateClass">
          <span :class="autobuyerToggleClass"></span>
        </label>
        <input
          :checked="isActive && globalToggle"
          :disabled="!globalToggle"
          :name="name"
          type="checkbox"
        />
      </div>
    </div>
    <div v-else-if="canBeBought" @click="purchase" class="c-autobuyer-buy-box" :class="autobuyerBuyBoxClass">
      Buy the {{ name }} for {{ format(antimatterCost) }} antimatter
    </div>`
});
