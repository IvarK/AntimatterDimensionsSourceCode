"use strict";

Vue.component("reality-autobuyer-box", {
  computed: {
    boxSetup() {
      return new AutobuyerBoxSetup("Automatic Reality", Autobuyer.reality);
    },
    targetRMInputSetup() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.DECIMAL,
        () => Autobuyer.reality.rm,
        value => Autobuyer.reality.rm = value
      );
    },
    targetGlyphInputSetup() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.INT,
        () => Autobuyer.reality.glyph,
        value => Autobuyer.reality.glyph = value
      );
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <br>
      <div>
        <span>Target reality machines:</span>
        <autobuyer-input :setup="targetRMInputSetup" />
      </div>
      <div>
        <span>Target glyph level:</span>
        <autobuyer-input :setup="targetGlyphInputSetup" />
      </div>
      <br>
    </autobuyer-box>`
});