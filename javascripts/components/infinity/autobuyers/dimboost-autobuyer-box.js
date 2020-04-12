"use strict";

Vue.component("dimboost-autobuyer-box", {
  data() {
    return {
      limitDimBoosts: false,
      isBulkBuyUnlocked: false,
      isBuyMaxUnlocked: false
    };
  },
  watch: {
    limitDimBoosts(newValue) {
      this.autobuyer.limitDimBoosts = newValue;
    }
  },
  computed: {
    autobuyer: () => Autobuyer.dimboost
  },
  methods: {
    update() {
      this.isBulkBuyUnlocked = this.autobuyer.isBulkBuyUnlocked;
      this.isBuyMaxUnlocked = this.autobuyer.isBuyMaxUnlocked;
      this.limitDimBoosts = this.autobuyer.limitDimBoosts;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" :showInterval="!isBuyMaxUnlocked" name="Automatic DimBoosts">
      <autobuyer-interval-button slot="intervalSlot" :autobuyer="autobuyer" />
      <template slot="toggleSlot">
        <div class="o-autobuyer-toggle-checkbox" @click="limitDimBoosts = !limitDimBoosts">
          <input type="checkbox" :checked="limitDimBoosts"/>
          <span>Limit dimboosts to:</span>
        </div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="int"
          property="maxDimBoosts"
        />
      </template>
      <template slot="prioritySlot">
        <div class="c-autobuyer-box__small-text">Galaxies required to always DimBoost:</div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="int"
          property="galaxies"
        />
      </template>
      <template v-if="isBuyMaxUnlocked" slot="intervalSlot">
        <div>Activates every X seconds:</div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="float"
          property="buyMaxInterval"
        />
      </template>
      <template v-else-if="isBulkBuyUnlocked" slot="optionSlot">
        <div class="c-autobuyer-box__small-text">Bulk DimBoost Amount:</div>
        <autobuyer-input
          :autobuyer="autobuyer"
          type="int"
          property="bulk"
        />
      </template>
    </autobuyer-box>`
});
