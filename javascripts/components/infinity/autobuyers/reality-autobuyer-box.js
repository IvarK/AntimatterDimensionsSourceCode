Vue.component("reality-autobuyer-box", {
  computed: {
    boxSetup: function() {
      return new AutobuyerBoxSetup(
        () => player.reality.upg.includes(25),
        () => player.realityBuyer.isOn,
        value => player.realityBuyer.isOn = value
      );
    },
    targetRMInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.DECIMAL,
        () => player.realityBuyer.rm,
        value => player.realityBuyer.rm = value
      );
    },
    targetGlyphInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.INT,
        () => player.realityBuyer.glyph,
        value => player.realityBuyer.glyph = value
      );
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <div>Automatic Reality</div>
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