"use strict";

Vue.component("big-crunch-autobuyer-box", {
  data() {
    return {
      postBreak: false,
      mode: AUTO_CRUNCH_MODE.AMOUNT,
      hasAdditionalModes: false,
      increaseWithMult: true,
    };
  },
  watch: {
    increaseWithMult(newValue) {
      this.autobuyer.increaseWithMult = newValue;
    }
  },
  computed: {
    autobuyer: () => Autobuyer.bigCrunch,
    modes: () => [
      AUTO_CRUNCH_MODE.AMOUNT,
      AUTO_CRUNCH_MODE.TIME,
      AUTO_CRUNCH_MODE.X_CURRENT,
    ]
  },
  methods: {
    update() {
      this.postBreak = player.break;
      this.mode = this.autobuyer.mode;
      this.hasAdditionalModes = this.autobuyer.hasAdditionalModes;
      this.increaseWithMult = this.autobuyer.increaseWithMult;
    },
    modeProps(mode) {
      switch (mode) {
        case AUTO_CRUNCH_MODE.AMOUNT: return {
          title: "Big Crunch at X IP",
          input: {
            property: "amount",
            type: "decimal"
          },
        };
        case AUTO_CRUNCH_MODE.TIME: return {
          title: "Seconds between Crunches",
          input: {
            property: "time",
            type: "float"
          },
        };
        case AUTO_CRUNCH_MODE.X_CURRENT: return {
          title: "X times current IP",
          input: {
            property: "xCurrent",
            type: "decimal"
          },
        };
      }
      throw new Error("Unknown Auto Crunch mode");
    },
    changeMode(event) {
      const mode = parseInt(event.target.value, 10);
      this.autobuyer.mode = mode;
      this.mode = mode;
    }
  },
  template: `
    <autobuyer-box :autobuyer="autobuyer" :showInterval="!postBreak" name="Automatic Big Crunch">
      <autobuyer-interval-button slot="intervalSlot" :autobuyer="autobuyer" />
      <template v-if="postBreak">
        <template slot="intervalSlot">
          <select
            v-if="hasAdditionalModes"
            class="c-autobuyer-box__mode-select"
            @change="changeMode"
          >
            <option
              v-for="optionMode in modes"
              :value="optionMode"
              :selected="mode === optionMode"
            >
              {{ modeProps(optionMode).title }}
            </option>
          </select>
          <span v-else>
            {{ modeProps(mode).title }}:
          </span>
        </template>
        <template slot="toggleSlot">
          <autobuyer-input
            :autobuyer="autobuyer"
            :key="mode"
            v-bind="modeProps(mode).input"
          />
        </template>
        <template slot="prioritySlot" style="margin-top: 1.2rem;">
          <span>Dynamic amount:</span>
          <div
            class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
            @click="increaseWithMult = !increaseWithMult"
          >
            <input type="checkbox" :checked="increaseWithMult" />
          </div>
        </template>
      </template>
    </autobuyer-box>`
});
