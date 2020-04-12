"use strict";

Vue.component("dimboost-autobuyer-box", {
  data() {
    return {
      isBulkBuyUnlocked: false,
      isBuyMaxUnlocked: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.dimboost
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.isBulkBuyUnlocked = autobuyer.isBulkBuyUnlocked;
      this.isBuyMaxUnlocked = autobuyer.isBuyMaxUnlocked;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" :showInterval="!isBuyMaxUnlocked" name="Automatic DimBoosts">
      <template v-if="false" slot="intervalSlot">
        <div>Buy max every X seconds:</div>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="float"
         property="buyMaxInterval"
        />
      </template>
      <template v-else>
        <autobuyer-interval-button slot="intervalSlot" :autobuyer="autobuyer" />
        <template slot="toggleSlot">
          <div class="c-autobuyer-box__small-text">Limit DimBoosts to:</div>
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
        <template v-if="isBulkBuyUnlocked" slot="optionSlot">
          <div class="c-autobuyer-box__small-text">Bulk DimBoost Amount:</div>
          <autobuyer-input
           :autobuyer="autobuyer"
           type="int"
           property="bulk"
          />
        </template>
      </template>
    </autobuyer-box>`
});
