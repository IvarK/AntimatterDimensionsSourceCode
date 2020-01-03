"use strict";

Vue.component("dimension-autobuyer-box", {
  components: {
    "bulk-button": {
      props: {
        autobuyer: Object
      },
      data() {
        return {
          hasMaxedInterval: false,
          hasMaxedBulk: false,
          bulk: 1,
          cost: 1
        };
      },
      computed: {
        bulkDisplay() {
          let bulk = this.bulk;
          if (!this.hasMaxedBulk) {
            bulk = Math.min(bulk * 2, 1e100);
          }
          return `${format(bulk, 2, 0)}x bulk purchase`;
        }
      },
      methods: {
        update() {
          const autobuyer = this.autobuyer;
          this.hasMaxedInterval = autobuyer.hasMaxedInterval;
          this.hasMaxedBulk = autobuyer.hasMaxedBulk;
          this.bulk = autobuyer.bulk;
          this.cost = autobuyer.cost;
        },
        upgradeBulk() {
          this.autobuyer.upgradeBulk();
        }
      },
      template:
        `<button
          v-if="hasMaxedInterval"
          class="o-autobuyer-btn"
          @click="upgradeBulk"
        >
        <span>{{bulkDisplay}}</span>
        <template v-if="!hasMaxedBulk">
          <br>
          <span>Cost: {{format(cost, 2, 0)}} IP</span>
        </template>
        </button>`
    }
  },
  props: {
    tier: Number,
  },
  data() {
    return {
      mode: AutobuyerMode.BUY_SINGLE
    };
  },
  computed: {
    autobuyer() {
      return Autobuyer.dimension(this.tier);
    },
    name() {
      return `${DISPLAY_NAMES[this.tier]} Dimension Autobuyer`;
    },
    modeDisplay() {
      switch (this.mode) {
        case AutobuyerMode.BUY_SINGLE: return "Buys singles";
        case AutobuyerMode.BUY_10: return "Buys max";
      }
      throw "Unknown dimension autobuyer mode";
    }
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
    },
    toggleMode() {
      this.autobuyer.toggleMode();
      this.update();
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" :name="name" showInterval>
      <template slot="beforeInterval">
        <bulk-button :autobuyer="autobuyer" />
        <autobuyer-interval-button :autobuyer="autobuyer" />
        <button class="o-autobuyer-btn" @click="toggleMode">{{modeDisplay}}</button>
      </template>
      <div class="l-autobuyer-box__fill" />
      <autobuyer-priority-selector :autobuyer="autobuyer" class="l-autobuyer-box__priority-selector" />
    </autobuyer-box>`
});
