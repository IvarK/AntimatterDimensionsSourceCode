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
      limitGalaxies: false,
      isBuyMaxUnlocked: false,
      buyMax: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.galaxy
  },
  watch: {
    limitGalaxies(newValue) {
      this.autobuyer.limitGalaxies = newValue;
    }
  },
  methods: {
    update() {
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
    <AutobuyerIntervalButton
      slot="intervalSlot"
      :autobuyer="autobuyer"
    />
    <template
      v-if="isBuyMaxUnlocked"
      slot="intervalSlot"
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
    <template :slot=" isBuyMaxUnlocked ? 'toggleSlot' : 'intervalSlot' ">
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
