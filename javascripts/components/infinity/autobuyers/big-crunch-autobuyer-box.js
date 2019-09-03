"use strict";

Vue.component("big-crunch-autobuyer-box", {
  data() {
    return {
      postBreak: false,
      mode: AutoCrunchMode.AMOUNT,
      hasAdditionalModes: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.bigCrunch,
    modes: () => [
      AutoCrunchMode.AMOUNT,
      AutoCrunchMode.TIME,
      AutoCrunchMode.X_LAST
    ]
  },
  methods: {
    update() {
      this.postBreak = player.break;
      this.mode = this.autobuyer.mode;
      this.hasAdditionalModes = this.autobuyer.hasAdditionalModes;
    },
    modeProps(mode) {
      switch (mode) {
        case AutoCrunchMode.AMOUNT: return {
          title: "Big Crunch at X IP",
          input: {
            property: "amount",
            type: "decimal"
          },
        };
        case AutoCrunchMode.TIME: return {
          title: "Seconds between Crunches",
          input: {
            property: "time",
            type: "float"
          },
        };
        case AutoCrunchMode.X_LAST: return {
          title: "X times last Crunch",
          input: {
            property: "xLast",
            type: "decimal"
          },
        };
      }
      throw new Error("Unknown auto crunch mode");
    },
    changeMode(event) {
      const mode = parseInt(event.target.value, 10);
      this.autobuyer.mode = mode;
      this.mode = mode;
    }
  },
  template:
    `<autobuyer-box :autobuyer="autobuyer" :showInterval="!postBreak" name="Automatic Big Crunch">
      <autobuyer-interval-button slot="beforeInterval" :autobuyer="autobuyer" />
      <div v-if="postBreak">
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
