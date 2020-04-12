"use strict";

Vue.component("autobuyer-box", {
  components: {
    "interval-label": {
      props: {
        autobuyer: Object
      },
      data() {
        return {
          interval: 0
        };
      },
      computed: {
        intervalDisplay() {
          return TimeSpan.fromMilliseconds(this.interval).totalSeconds.toFixed(2);
        }
      },
      methods: {
        update() {
          this.interval = this.autobuyer.interval;
        }
      },
      template:
        `<div class="c-autobuyer-box__small-text">Current interval: {{intervalDisplay}} seconds</div>`
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
      this.antimatter.copyFrom(player.antimatter);
    },
    toggle() {
      if (!this.globalToggle) return;
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
      return this.isActive ? "fas fa-play" : "fas fa-pause";
    }
  },
  template:
    `<div>
      <div v-if="isUnlocked || isBought" class="l-autobuyer-box-row">
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
            class="o-autobuyer-toggle-checkbox__label" 
            :class="{ 'o-autobuyer-toggle-checkbox__label--active': isActive && globalToggle }">
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
      </div>
    </div>`
});
