<script>
import AutobuyerBox from "./AutobuyerBox";
import AutobuyerIntervalButton from "./AutobuyerIntervalButton";
import AutobuyerInput from "./AutobuyerInput";

export default {
  name: "BigCrunchAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerIntervalButton,
    AutobuyerInput
  },
  data() {
    return {
      postBreak: false,
      mode: AUTO_CRUNCH_MODE.AMOUNT,
      hasAdditionalModes: false,
      increaseWithMult: true,
    };
  },
  computed: {
    autobuyer: () => Autobuyer.bigCrunch,
    modes: () => [
      AUTO_CRUNCH_MODE.AMOUNT,
      AUTO_CRUNCH_MODE.TIME,
      AUTO_CRUNCH_MODE.X_HIGHEST,
    ]
  },
  watch: {
    increaseWithMult(newValue) {
      this.autobuyer.increaseWithMult = newValue;
    }
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
        case AUTO_CRUNCH_MODE.X_HIGHEST: return {
          title: "X times highest IP",
          input: {
            property: "xHighest",
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
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    :show-interval="!postBreak"
    name="Automatic Big Crunch"
  >
    <AutobuyerIntervalButton
      slot="intervalSlot"
      :autobuyer="autobuyer"
    />
    <template v-if="postBreak">
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
        <span v-else>
          {{ modeProps(mode).title }}:
        </span>
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
    </template>
  </AutobuyerBox>
</template>

<style scoped>

</style>
