<script>
import ClassicInfinityDimensionsTab from "./ClassicInfinityDimensionsTab";
import ModernInfinityDimensionsTab from "./ModernInfinityDimensionsTab";

export default {
  name: "InfinityDimensionsTab",
  components: {
    ClassicInfinityDimensionsTab,
    ModernInfinityDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernInfinityDimensionsTab"
        : "ClassicInfinityDimensionsTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
