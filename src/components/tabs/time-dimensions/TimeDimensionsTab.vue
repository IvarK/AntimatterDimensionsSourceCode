<script>
import ClassicTimeDimensionsTab from "./ClassicTimeDimensionsTab";
import ModernTimeDimensionsTab from "./ModernTimeDimensionsTab";

export default {
  name: "TimeDimensionsTab",
  components: {
    ClassicTimeDimensionsTab,
    ModernTimeDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernTimeDimensionsTab"
        : "ClassicTimeDimensionsTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
