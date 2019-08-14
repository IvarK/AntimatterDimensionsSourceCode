Vue.component("eternity-autobuyer-box", {
  data: function() {
    return {
      mode: AutoEternityMode.AMOUNT
    };
  },
  computed: {
    boxSetup: function() {
      return new AutobuyerBoxSetup("Automatic Eternity", Autobuyer.eternity);
    },
    limitInputSetup: function() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.DECIMAL,
        () => Autobuyer.eternity.limit,
        value => Autobuyer.eternity.limit = value
      );
    },
    modeDisplay: function() {
      switch (this.mode) {
        case AutoEternityMode.AMOUNT: return "Amount of EP to wait until reset";
        case AutoEternityMode.TIME: return "Seconds between eternities";
        case AutoEternityMode.RELATIVE: return "X times last eternity";
      }
      throw "Unknown auto eternity mode";
    }
  },
  methods: {
    update() {
      this.mode = Autobuyer.eternity.mode;
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <div>
        <span>{{modeDisplay}}:</span>
        <autobuyer-input :setup="limitInputSetup" />
      </div>
      <br>
    </autobuyer-box>`
});