"use strict";

Vue.component("eternity-autobuyer-box", {
  data() {
    return {
      mode: AUTO_ETERNITY_MODE.AMOUNT,
      hasAdditionalModes: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.eternity,
    modes: () => [
      AUTO_ETERNITY_MODE.AMOUNT,
      AUTO_ETERNITY_MODE.TIME,
      AUTO_ETERNITY_MODE.X_LAST
    ]
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
      this.hasAdditionalModes = this.autobuyer.hasAdditionalModes;
    },
    modeProps(mode) {
      switch (mode) {
        case AUTO_ETERNITY_MODE.AMOUNT: return {
          title: "Eternity at X EP",
          input: {
            property: "amount",
            type: "decimal"
          },
        };
        case AUTO_ETERNITY_MODE.TIME: return {
          title: "Seconds between eternities",
          input: {
            property: "time",
            type: "float"
          },
        };
        case AUTO_ETERNITY_MODE.X_LAST: return {
          title: "X times last eternity",
          input: {
            property: "xLast",
            type: "decimal"
          },
        };
      }
      throw new Error("Unknown auto eternity mode");
    },
    changeMode(event) {
      const mode = parseInt(event.target.value, 10);
      this.autobuyer.mode = mode;
      this.mode = mode;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" name="Automatic Eternity">
      <div>
        <select
          v-if="hasAdditionalModes"
          class="c-autobuyer-box__mode-select l-autobuyer-box__mode-select"
          @change="changeMode"
        >
          <option
            v-for="optionMode in modes"
            :value="optionMode"
            :selected="mode === optionMode"
          >{{modeProps(optionMode).title}}</option>
        </select>
        <span v-else>{{modeProps(mode).title}}:</span>
        <autobuyer-input
         :autobuyer="autobuyer"
         :key="mode"
         v-bind="modeProps(mode).input"
        />
      </div>
    </autobuyer-box>`
});
