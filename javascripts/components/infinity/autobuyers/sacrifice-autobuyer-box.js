Vue.component("sacrifice-autobuyer-box",{
  computed: {
    autobuyer: function() {
      return Autobuyer.sacrifice;
    },
    boxSetup: function() {
      return new AutobuyerBoxSetup("Automatic Sacrifice", this.autobuyer);
    },
    limitInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.FLOAT,
        () => this.autobuyer.limit,
        value => this.autobuyer.limit = value
      );
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <div>
        <span>Sacrifice when the multiplier is over:</span>
        <autobuyer-input :setup="limitInputSetup" />
      </div>
      <br>
    </autobuyer-box>`
});