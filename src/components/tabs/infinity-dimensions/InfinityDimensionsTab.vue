<script>
import OldInfinityDimensionsTab from "./OldInfinityDimensionsTab";
import NewInfinityDimensionsTab from "./NewInfinityDimensionsTab";

export default {
  name: "InfinityDimensionsTab",
  components: {
    OldInfinityDimensionsTab,
    NewInfinityDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI ? "NewInfinityDimensionsTab" : "OldInfinityDimensionsTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
