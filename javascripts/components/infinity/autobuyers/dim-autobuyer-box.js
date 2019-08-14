Vue.component("dim-autobuyer-box", {
  components: {
    "bulk-button": {
      props: {
        autobuyer: Object
      },
      data: function() {
        return {
          hasMaxedInterval: false,
          hasMaxedBulk: false,
          bulk: 1,
          cost: 1
        };
      },
      computed: {
        bulkDisplay: function() {
          let bulk = this.bulk;
          if (!this.hasMaxedBulk) {
            bulk = Math.min(bulk * 2, 1e100);
          }
          return `${shortenDimensions(bulk)}x bulk purchase`;
        }
      },
      methods: {
        update() {
          const autobuyer = this.autobuyer;
          if (!autobuyer.isUnlocked) return;
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
          <span>Cost: {{shortenDimensions(cost)}} IP</span>
        </template>
        </button>`
    }
  },
  props: {
    tier: Number,
  },
  data: function() {
    return {
      mode: AutobuyerMode.BUY_SINGLE
    };
  },
  computed: {
    autobuyer: function() {
      return Autobuyer.dim(this.tier);
    },
    boxSetup: function() {
      const name = DISPLAY_NAMES[this.tier];
      return new AutobuyerBoxSetup(`${name} Dimension Autobuyer`, this.autobuyer);
    },
    modeDisplay: function() {
      switch (this.mode) {
        case AutobuyerMode.BUY_SINGLE: return "Buys singles";
        case AutobuyerMode.BUY_10: return "Buys max";
      }
      throw "Unknown dimension autobuyer mode";
    }
  },
  methods: {
    update() {
      if (!this.autobuyer.isUnlocked) return;
      this.mode = this.autobuyer.mode;
    },
    toggleMode() {
      this.autobuyer.toggleMode();
      this.update();
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <template slot="beforeInterval">
        <bulk-button :autobuyer="autobuyer" />
        <autobuyer-interval-button :autobuyer="autobuyer" />
        <button class="o-autobuyer-btn" @click="toggleMode">{{modeDisplay}}</button>
      </template>
      <autobuyer-priority-selector :autobuyer="autobuyer"/>
      <br>
    </autobuyer-box>`
});