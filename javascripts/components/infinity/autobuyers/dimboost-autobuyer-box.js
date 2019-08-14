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
      <div v-if="isBuyMaxUnlocked">
        <span>Buy max every X seconds:</span>
        <autobuyer-input
         :autobuyer="autobuyer"
         type="float"
         property="buyMaxInterval"
        />
      </div>
      <template v-else>
        <autobuyer-interval-button slot="beforeInterval" :autobuyer="autobuyer" />
        <div>
          <span class="c-autobuyer-box__small-text">Limit DimBoosts to:</span>
          <autobuyer-input
           :autobuyer="autobuyer"
           type="int"
           property="maxDimBoosts"
          />
        </div>
        <div>
          <span class="c-autobuyer-box__small-text">Galaxies required to always DimBoost:</span>
          <autobuyer-input
           :autobuyer="autobuyer"
           type="int"
           property="galaxies"
          />
        </div>
        <div v-if="isBulkBuyUnlocked">
          <span class="c-autobuyer-box__small-text">Bulk DimBoost Amount:</span>
          <autobuyer-input
           :autobuyer="autobuyer"
           type="int"
           property="bulk"
          />
        </div>
      </template>
    </autobuyer-box>`
});
