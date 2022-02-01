import "./autobuyer-input.js";
import "./autobuyer-box.js";

Vue.component("eternity-autobuyer-box", {
  data() {
    return {
      mode: AUTO_ETERNITY_MODE.AMOUNT,
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
    autobuyer: () => Autobuyer.eternity,
    modes: () => [
      AUTO_ETERNITY_MODE.AMOUNT,
      AUTO_ETERNITY_MODE.TIME,
      AUTO_ETERNITY_MODE.X_HIGHEST,
    ]
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
      this.hasAdditionalModes = this.autobuyer.hasAdditionalModes;
      this.increaseWithMult = this.autobuyer.increaseWithMult;
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
          title: "Seconds between Eternities",
          input: {
            property: "time",
            type: "float"
          },
        };
        case AUTO_ETERNITY_MODE.X_HIGHEST: return {
          title: "X times highest EP",
          input: {
            property: "xHighest",
            type: "decimal"
          },
        };
      }
      throw new Error("Unknown Auto Eternity mode");
    },
    changeMode(event) {
      const mode = parseInt(event.target.value, 10);
      this.autobuyer.mode = mode;
      this.mode = mode;
    }
  },
  template: `
    <autobuyer-box :autobuyer="autobuyer" name="Automatic Eternity">
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
        <span v-else>{{ modeProps(mode).title }}:</span>
      </template>
      <template slot="toggleSlot">
        <autobuyer-input
          :autobuyer="autobuyer"
          :key="mode"
          v-bind="modeProps(mode).input"
        />
      </template>
      <template slot="checkboxSlot" style="margin-top: 1.2rem;">
        <span>Dynamic amount:</span>
        <div
          class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
          @click="increaseWithMult = !increaseWithMult"
        >
          <input type="checkbox" :checked="increaseWithMult" />
        </div>
      </template>
    </autobuyer-box>`
});
