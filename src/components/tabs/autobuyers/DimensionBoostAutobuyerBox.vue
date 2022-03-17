<script>
import AutobuyerBox from "./AutobuyerBox";
import AutobuyerIntervalButton from "./AutobuyerIntervalButton";
import AutobuyerInput from "./AutobuyerInput";

export default {
  name: "DimensionBoostAutobuyerBox",
  components: {
    AutobuyerBox,
    AutobuyerIntervalButton,
    AutobuyerInput
  },
  data() {
    return {
      hasMaxedInterval: false,
      limitDimBoosts: false,
      limitUntilGalaxies: false,
      isBuyMaxUnlocked: false
    };
  },
  computed: {
    autobuyer: () => Autobuyer.dimboost
  },
  watch: {
    limitDimBoosts(newValue) {
      this.autobuyer.limitDimBoosts = newValue;
    },
    limitUntilGalaxies(newValue) {
      this.autobuyer.limitUntilGalaxies = newValue;
    }
  },
  methods: {
    update() {
      const autobuyer = this.autobuyer;
      this.hasMaxedInterval = autobuyer.hasMaxedInterval;
      this.isBuyMaxUnlocked = autobuyer.isBuyMaxUnlocked;
      this.limitDimBoosts = autobuyer.limitDimBoosts;
      this.limitUntilGalaxies = autobuyer.limitUntilGalaxies;
    }
  }
};
</script>

<template>
  <AutobuyerBox
    :autobuyer="autobuyer"
    :show-interval="!isBuyMaxUnlocked"
    name="Automatic Dimension Boosts"
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
      <div
        class="c-autobuyer-box__small-text"
        style="margin-top: 1.2rem;"
      >
        Activates every X seconds:
      </div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="float"
        property="buyMaxInterval"
      />
    </template>
    <template
      v-else
      #checkboxSlot
    >
      <div
        class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
        style="margin-top: 1.2rem;"
        @click="limitDimBoosts = !limitDimBoosts"
      >
        <input
          type="checkbox"
          :checked="limitDimBoosts"
        >
        <span>Limit Dimension Boosts to:</span>
      </div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="int"
        property="maxDimBoosts"
      />
    </template>
    <template #toggleSlot>
      <div
        class="o-autobuyer-toggle-checkbox c-autobuyer-box__small-text"
        style="height: 3rem;"
        @click="limitUntilGalaxies = !limitUntilGalaxies"
      >
        <input
          type="checkbox"
          :checked="limitUntilGalaxies"
        >
        <span v-if="isBuyMaxUnlocked">
          Only Dimboost to unlock new<br>
          Dimensions until X Galaxies:
        </span>
        <span v-else>
          Galaxies required to always<br>
          Dimboost, ignoring the limit:
        </span>
      </div>
      <AutobuyerInput
        :autobuyer="autobuyer"
        type="int"
        property="galaxies"
      />
    </template>
  </AutobuyerBox>
</template>

<style scoped>

</style>
