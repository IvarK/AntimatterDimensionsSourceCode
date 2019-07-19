"use strict";

Vue.component("dimboost-autobuyer-box", {
  data() {
    return {
      isBulkBuyUnlocked: false,
      isBuyMaxUnlocked: false
    };
  },
  computed: {
    autobuyer() {
      return Autobuyer.dimboost;
    },
    boxSetup() {
      return new AutobuyerBoxSetup("Automatic DimBoosts", this.autobuyer);
    },
    limitInputSetup() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.INT,
        () => this.autobuyer.maxDimBoosts,
        value => this.autobuyer.maxDimBoosts = value
      );
    },
    galaxiesInputSetup() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.INT,
        () => this.autobuyer.galaxies,
        value => this.autobuyer.galaxies = value
      );
    },
    bulkBuyModeDisplay() {
      return this.isBuyMaxUnlocked ? "Buy max DimBoosts every X seconds" : "Bulk DimBoost Amount";
    },
    bulkInputSetup() {
      return new AutobuyerInputSetup(
        this.isBuyMaxUnlocked ? AutobuyerInputType.FLOAT : AutobuyerInputType.INT,
        () => this.autobuyer.bulk,
        value => this.autobuyer.bulk = value
      );
    },
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.isBulkBuyUnlocked = autobuyer.isBulkBuyUnlocked;
      this.isBuyMaxUnlocked = autobuyer.isBuyMaxUnlocked;
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <template v-if="isBulkBuyUnlocked">
        <span class="c-autobuyer-box__small-text">{{bulkBuyModeDisplay}}:</span>
        <autobuyer-input :setup="bulkInputSetup" />
      </template>
      <template v-else>
        <autobuyer-interval-button slot="beforeInterval" :autobuyer="autobuyer" />
        <span class="c-autobuyer-box__small-text">Max DimBoosts:</span>
        <autobuyer-input :setup="limitInputSetup" />
        <span class="c-autobuyer-box__small-text">Galaxies required to always DimBoost:</span>
        <autobuyer-input :setup="galaxiesInputSetup" />
      </template>
      <br>
    </autobuyer-box>`
});
