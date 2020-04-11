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
    }
  },
  template:
    `<div>
      <div v-if="isUnlocked || isBought" class="c-autobuyer-box l-autobuyer-box">
        <div class="l-autobuyer-box__header">{{name}}</div>
        <slot name="beforeInterval" />
        <interval-label v-if="showInterval" :autobuyer="autobuyer"/>
        <div class="l-autobuyer-box__content">
          <slot />
        </div>
        <div class="o-autobuyer-toggle-checkbox l-autobuyer-box__footer" @click="toggle">
          <span class="o-autobuyer-toggle-checkbox__label">Is active:</span>
          <input
            :checked="isActive && globalToggle"
            :disabled="!globalToggle"
            type="checkbox"
          />
        </div>
      </div>
      <div v-else-if="canBeBought" @click="purchase" class="c-autobuyer-buy-box" :class="autobuyerBuyBoxClass">
        Buy the {{ name }} for {{ format(antimatterCost) }} antimatter
      </div>
    </div>`
});
