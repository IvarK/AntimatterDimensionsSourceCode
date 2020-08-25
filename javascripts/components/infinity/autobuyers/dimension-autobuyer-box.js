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
          isUnlocked: false,
          bulkUnlimited: false,
          bulk: 1,
          cost: 1
        };
      },
      computed: {
        bulkDisplay() {
          if (this.hasMaxedBulk) {
            return `${formatX(this.bulk, 2, 0)} bulk buy`;
          }
          let newBulk = this.bulk;
          newBulk = Math.min(newBulk * 2, 1e10);
          return `${formatX(this.bulk, 2, 0)} ➜ ${formatX(newBulk, 2, 0)} bulk buy`;
        }
      },
      methods: {
        update() {
          const autobuyer = this.autobuyer;
          this.hasMaxedInterval = autobuyer.hasMaxedInterval;
          this.isUnlocked = autobuyer.isUnlocked;
          this.hasMaxedBulk = autobuyer.hasMaxedBulk;
          this.bulkUnlimited = autobuyer.hasUnlimitedBulk;
          this.bulk = autobuyer.bulk;
          this.cost = autobuyer.cost;
        },
        upgradeBulk() {
          this.autobuyer.upgradeBulk();
        }
      },
      template:
        `<button
          v-if="hasMaxedInterval && !bulkUnlimited && isUnlocked"
          class="o-autobuyer-btn"
          @click="upgradeBulk"
        >
        <span>{{bulkDisplay}}</span>
        <template v-if="!hasMaxedBulk">
          <br>
          <span>Cost: {{format(cost, 2, 0)}} IP</span>
        </template>
        </button>
        <button 
          v-else-if="hasMaxedInterval && !bulkUnlimited"
          class="o-autobuyer-btn l-autobuyer-box__button">
          Complete the challenge to upgrade bulk
        </button>`
    }
  },
  props: {
    tier: Number,
  },
  data() {
    return {
      mode: AUTOBUYER_MODE.BUY_SINGLE
    };
  },
  computed: {
    autobuyer() {
      return Autobuyer.dimension(this.tier);
    },
    name() {
      return `${AntimatterDimension(this.tier).displayName} Dimension Autobuyer`;
    },
    modeDisplay() {
      switch (this.mode) {
        case AUTOBUYER_MODE.BUY_SINGLE: return "Buys singles";
        case AUTOBUYER_MODE.BUY_10: return "Buys max";
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
      <template slot="intervalSlot">
        <bulk-button :autobuyer="autobuyer" />
        <autobuyer-interval-button :autobuyer="autobuyer" />
      </template>
      <template slot="toggleSlot">
        <button class="o-autobuyer-btn" @click="toggleMode">{{modeDisplay}}</button>
      </template>
      <template slot="prioritySlot">
        <autobuyer-priority-selector :autobuyer="autobuyer" class="l-autobuyer-box__priority-selector" />
      </template>
    </autobuyer-box>`
});
