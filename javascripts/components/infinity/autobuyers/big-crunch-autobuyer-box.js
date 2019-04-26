"use strict";

Vue.component("big-crunch-autobuyer-box", {
  data() {
    return {
      postBreak: false,
      mode: AutoCrunchMode.AMOUNT
    };
  },
  computed: {
    autobuyer() {
      return Autobuyer.infinity;
    },
    boxSetup() {
      return new AutobuyerBoxSetup("Automatic Big Crunch", this.autobuyer);
    },
    limitInputSetup() {
      return new AutobuyerInputSetup(
        AutobuyerInputType.DECIMAL,
        () => this.autobuyer.limit,
        value => this.autobuyer.limit = value
      );
    },
    modeDisplay() {
      switch (this.mode) {
        case AutoCrunchMode.AMOUNT: return "Amount of IP to wait until reset";
        case AutoCrunchMode.TIME: return "Seconds between crunches";
        case AutoCrunchMode.RELATIVE: return "X times last crunch";
      }
      throw "Unknown auto eternity mode";
    }
  },
  methods: {
    update() {
      this.postBreak = player.break;
      this.mode = this.autobuyer.mode;
    }
  },
  template:
    `<autobuyer-box :setup="boxSetup">
      <autobuyer-interval-button slot="beforeInterval" :autobuyer="autobuyer" />
      <div v-if="postBreak">
        <span>{{modeDisplay}}</span>
        <autobuyer-input :setup="limitInputSetup" />
      </div>
      <br>
    </autobuyer-box>`
});