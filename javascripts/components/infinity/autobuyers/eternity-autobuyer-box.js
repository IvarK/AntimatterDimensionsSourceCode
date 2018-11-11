Vue.component("eternity-autobuyer-box", {
  data: function() {
    return {
      mode: AutoEternityMode.AMOUNT
    };
  },
  computed: {
    boxSetup: function() {
      return new AutobuyerBoxSetup(
        () => player.eternities >= 100,
        () => player.eternityBuyer.isOn,
        value => player.eternityBuyer.isOn = value
      );
    },
    modeDisplay: function() {
      switch (this.mode) {
        case AutoEternityMode.AMOUNT: return "Amount of EP to wait until reset";
        case AutoEternityMode.TIME: return "Seconds between eternities";
        case AutoEternityMode.RELATIVE: return "X times last eternity";
      }
      throw "Unknown auto eternity mode";
    },
    limitInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.DECIMAL,
        () => player.eternityBuyer.limit,
        value => player.eternityBuyer.limit = value
      );
    }
  },
  methods: {
    update() {
      this.mode = player.autoEternityMode;
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <div>Automatic Eternity</div><br>
      <div>
        <span>{{modeDisplay}}:</span>
        <autobuyer-input :setup="limitInputSetup" />
      </div>
      <br>
    </autobuyer-box>`
});