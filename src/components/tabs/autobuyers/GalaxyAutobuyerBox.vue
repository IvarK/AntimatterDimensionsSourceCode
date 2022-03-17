<script>
import AutobuyerBox from "./AutobuyerBox";
import AutobuyerIntervalButton from "./AutobuyerIntervalButton";
import AutobuyerInput from "./AutobuyerInput";

export default {
  name: "GalaxyAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerIntervalButton,
    AutobuyerInput
  },
  data() {
    return {
      hasMaxedInterval: false,
      limitGalaxies: false,
      isBuyMaxUnlocked: false,
      buyMax: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.galaxy,
    limitGalaxiesSlot() {
      return this.isBuyMaxUnlocked ? "toggleSlot" : "intervalSlot";
    }
  },
  watch: {
    limitGalaxies(newValue) {
      this.autobuyer.limitGalaxies = newValue;
    }
  },
  methods: {
    update() {
      this.hasMaxedInterval = this.autobuyer.hasMaxedInterval;
      this.isBuyMaxUnlocked = this.autobuyer.isBuyMaxUnlocked;
      this.limitGalaxies = this.autobuyer.limitGalaxies;
    }
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    name="Automatic Antimatter Galaxies"
    :show-interval="!isBuyMaxUnlocked"
  >
    <template
      v-if="!hasMaxedInterval"
      #intervalSlot
    >
      <AutobuyerIntervalButton :autobuyer="autobuyer" />
    </template>
    <template
      v-else-if="isBuyMaxUnlocked"
      #intervalSlot
    >
      <div class="c-autobuyer-box__small-text">
        Activates every X seconds:
      </div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="float"
        property="buyMaxInterval"
      />
    </template>
    <template #[limitGalaxiesSlot]>
      <div
        class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
        @click="limitGalaxies = !limitGalaxies"
      >
        <input
          type="checkbox"
          :checked="limitGalaxies"
        >
        <span>Limit Antimatter Galaxies to:</span>
      </div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="int"
        property="maxGalaxies"
      />
    </template>
  </AutobuyerBox>
</template>

<style scoped>

</style>
