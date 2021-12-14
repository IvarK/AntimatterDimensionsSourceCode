<script>
import OldAntimatterDimensionsTab from "./OldAntimatterDimensionsTab";
import NewAntimatterDimensionsTab from "./NewAntimatterDimensionsTab";

export default {
  name: "AntimatterDimensionsTab",
  components: {
    OldAntimatterDimensionsTab,
    NewAntimatterDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI ? "NewAntimatterDimensionsTab" : "OldAntimatterDimensionsTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
