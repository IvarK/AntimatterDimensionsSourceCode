<script>
import AutobuyerToggleLabel from "./AutobuyerToggleLabel";
import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel";
import AutobuyerModeButton from "./AutobuyerModeButton";

export default {
  name: "SingleAutobuyerInRow",
  components: {
    AutobuyerToggleLabel,
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
    <AutobuyerToggleLabel :autobuyer="autobuyer" />
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
