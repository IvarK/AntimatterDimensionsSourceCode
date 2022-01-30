<script>
import AutobuyerBox from "./AutobuyerBox";
import AutobuyerInput from "./AutobuyerInput";

export default {
  name: "EternityAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerInput
  },
  data() {
    return {
      mode: AUTO_ETERNITY_MODE.AMOUNT,
      hasAdditionalModes: false,
      increaseWithMult: true,
    };
  },
  computed: {
    autobuyer: () => Autobuyer.eternity,
    modes: () => [
      AUTO_ETERNITY_MODE.AMOUNT,
      AUTO_ETERNITY_MODE.TIME,
      AUTO_ETERNITY_MODE.X_HIGHEST,
    ]
  },
  watch: {
    increaseWithMult(newValue) {
      this.autobuyer.increaseWithMult = newValue;
    }
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
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    name="Automatic Eternity"
  >
    <template slot="intervalSlot">
      <select
        v-if="hasAdditionalModes"
        class="c-autobuyer-box__mode-select"
        @change="changeMode"
      >
        <option
          v-for="optionMode in modes"
          :key="optionMode"
          :value="optionMode"
          :selected="mode === optionMode"
        >
          {{ modeProps(optionMode).title }}
        </option>
      </select>
      <span v-else>{{ modeProps(mode).title }}:</span>
    </template>
    <template slot="toggleSlot">
      <AutobuyerInput
        :key="mode"
        :autobuyer="autobuyer"
        v-bind="modeProps(mode).input"
      />
    </template>
    <template slot="checkboxSlot">
      <span>Dynamic amount:</span>
      <div
        class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
        @click="increaseWithMult = !increaseWithMult"
      >
        <input
          type="checkbox"
          :checked="increaseWithMult"
        >
      </div>
    </template>
  </AutobuyerBox>
</template>

<style scoped>

</style>
