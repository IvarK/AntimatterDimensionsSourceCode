<script>
import AutobuyerToggleLabel from "./AutobuyerToggleLabel";
import AutobuyerIntervalLabel from "./AutobuyerIntervalLabel";

export default {
  name: "SingleAutobuyerBox",
  components: {
    AutobuyerToggleLabel,
    AutobuyerIntervalLabel
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
    </div>
  </span>
</template>

<style scoped>

</style>
