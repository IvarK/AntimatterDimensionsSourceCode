<script>
import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel";
import AutobuyerModeButton from "./AutobuyerModeButton";
import AutobuyerSingleToggleLabel from "./AutobuyerSingleToggleLabel";

export default {
  name: "SingleAutobuyerInRow",
  components: {
    AutobuyerSingleToggleLabel,
    AutobuyerIntervalLabel,
    AutobuyerModeButton
  },
  props: {
    autobuyer: {
      type: Object,
      required: true
    },
    // You may notice that there are no autobuyers where showInterval or showBulk would apply -
    // they are always the same. This is for future-proofing,
    // also for the sunk costs fallacy after trying to fully integrate ADs into this system
    showInterval: Boolean,
    showBulk: Boolean,
    parentDisabled: Boolean,
  },
  data() {
    return {
      isVisible: false,
    };
  },
  computed: {
    name() {
      return this.autobuyer.name;
    },
    hasMode() {
      return this.autobuyer.mode !== undefined;
    },
  },
  methods: {
    update() {
      const buyer = this.autobuyer;
      this.isVisible = buyer.isUnlocked || buyer.isBought;
    },
  }
};
</script>

<template>
  <span
    v-if="isVisible"
    class="c-autobuyer-box-slot"
  >
    <AutobuyerSingleToggleLabel
      :autobuyer="autobuyer"
      :parent-disabled="parentDisabled"
    />
    {{ name }}
    <AutobuyerIntervalLabel
      :autobuyer="autobuyer"
      :show-interval="showInterval"
      :show-bulk="showBulk"
    />
    <AutobuyerModeButton
      v-if="hasMode"
      :autobuyer="autobuyer"
    />
  </span>
</template>

<style scoped>

</style>
