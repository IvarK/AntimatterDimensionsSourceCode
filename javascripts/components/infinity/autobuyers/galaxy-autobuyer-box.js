Vue.component("galaxy-autobuyer-box", {
  data: function() {
    return {
      isBuyMaxUnlocked: false
    };
  },
  computed: {
    autobuyer: function() {
      return Autobuyer.galaxy;
    },
    boxSetup: function() {
      return new AutobuyerBoxSetup("Automatic Galaxies", this.autobuyer);
    },
    limitInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.INT,
        () => this.autobuyer.limit,
        value => this.autobuyer.limit = value
      );
    },
    buyMaxIntervalInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.FLOAT,
        () => this.autobuyer.buyMaxInterval,
        value => this.autobuyer.buyMaxInterval = value
      );
    },
  },
  methods: {
    update() {
      this.isBuyMaxUnlocked = this.autobuyer.isBuyMaxUnlocked;
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <autobuyer-interval-button slot="beforeInterval" :autobuyer="autobuyer" />
      <span>Max Galaxies:</span>
      <autobuyer-input :setup="limitInputSetup" />
      <template v-if="isBuyMaxUnlocked">
        <br>
        <span>Buy max every X seconds:</span>
        <autobuyer-input :setup="buyMaxIntervalInputSetup" />
        <span class="c-autobuyer-box__small-text">(0 to buy singles on default interval)</span>
      </template>
      <br>
    </autobuyer-box>`
});