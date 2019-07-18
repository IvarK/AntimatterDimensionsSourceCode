"use strict";

Vue.component("sacrifice-autobuyer-box", {
  computed: {
    autobuyer() {
      return Autobuyer.sacrifice;
    },
    boxSetup() {
      return new AutobuyerBoxSetup("Automatic Sacrifice", this.autobuyer);
    },
    limitInputSetup() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.DECIMAL,
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