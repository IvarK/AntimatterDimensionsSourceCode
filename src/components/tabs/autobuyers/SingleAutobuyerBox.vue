<script>
import AutobuyerToggleLabel from "./AutobuyerToggleLabel";
import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel";
import AutobuyerInput from "./AutobuyerInput";

export default {
  name: "SingleAutobuyerBox",
  components: {
    AutobuyerToggleLabel,
    AutobuyerIntervalLabel,
    AutobuyerInput
  },
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
    };
  },
  computed: {
    name() {
      return this.autobuyer.name;
    },
  },
  methods: {
    update() {
      this.isUnlocked = this.autobuyer.isUnlocked;
    },
  }
};
</script>

<template>
  <span
    v-if="isUnlocked"
    class="c-autobuyer-box-row"
  >
    <AutobuyerToggleLabel :autobuyer="autobuyer" />
    <div>
      {{ name }}
      <AutobuyerIntervalLabel :autobuyer="autobuyer" />

      <span
        v-if="autobuyer.hasInput"
        class="c-autobuyer-box__small-text"
      >
        Multiplier:
        <AutobuyerInput
          class="c-small-autobuyer-input"
          :autobuyer="autobuyer"
          :type="autobuyer.inputType"
          :property="autobuyer.inputEntry"
        />
      </span>
    </div>
  </span>
</template>

<style scoped>

</style>
