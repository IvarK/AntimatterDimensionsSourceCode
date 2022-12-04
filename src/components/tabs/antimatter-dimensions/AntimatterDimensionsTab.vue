<script>
import ClassicAntimatterDimensionsTab from "./ClassicAntimatterDimensionsTab";
import ModernAntimatterDimensionsTab from "./ModernAntimatterDimensionsTab";

export default {
  name: "AntimatterDimensionsTab",
  components: {
    ClassicAntimatterDimensionsTab,
    ModernAntimatterDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernAntimatterDimensionsTab"
        : "ClassicAntimatterDimensionsTab";
    }
  },
};
</script>

<template>
  <component :is="activeComponent" />
</template>
