Vue.component("dimboost-autobuyer-box", {
  data: function() {
    return {
      isBulkBuyUnlocked: false,
      isBuyMaxUnlocked: false
    };
  },
  computed: {
    autobuyer: function() {
      return Autobuyer.dimboost;
    },
    boxSetup: function() {
      return new AutobuyerBoxSetup("Automatic DimBoosts", this.autobuyer);
    },
    limitInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.INT,
        () => this.autobuyer.maxDimBoosts,
        value => this.autobuyer.maxDimBoosts = value
      );
    },
    galaxiesInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.INT,
        () => this.autobuyer.galaxies,
        value => this.autobuyer.galaxies = value
      );
    },
    bulkBuyModeDisplay: function() {
      return this.isBuyMaxUnlocked ? "Buy max DimBoosts every X seconds" : "Bulk DimBoost Amount";
    },
    bulkInputSetup: function() {
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
      <autobuyer-interval-button slot="beforeInterval" :autobuyer="autobuyer" />
      <span class="c-autobuyer-box__small-text">Max DimBoosts:</span>
      <autobuyer-input :setup="limitInputSetup" />
      <span class="c-autobuyer-box__small-text">Galaxies required to always DimBoost:</span>
      <autobuyer-input :setup="galaxiesInputSetup" />
      <template v-if="isBulkBuyUnlocked">
        <span class="c-autobuyer-box__small-text">{{bulkBuyModeDisplay}}:</span>
        <autobuyer-input :setup="bulkInputSetup" />
      </template>
      <br>
    </autobuyer-box>`
});