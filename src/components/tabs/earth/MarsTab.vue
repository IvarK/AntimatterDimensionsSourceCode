<script>
import ModernSolarDimensionsTab from "@/components/tabs/earth/ModernSolarDimensionsTab";

export default {
  name: "MarsTab",
  components: {
    ModernSolarDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernSolarDimensionsTab"
        : "";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>

<style scoped>

</style>