<script>
import ClassicAntimatterDimensionsTab from "./ClassicAntimatterDimensionsTab";
import ModernAntimatterDimensionsTab from "./ModernAntimatterDimensionsTab";

export default {
  name: "AntimatterDimensionsTab",
  components: {
    ClassicAntimatterDimensionsTab,
    ModernAntimatterDimensionsTab
  },
  data() {
    return {
      newGameKey: "",
    };
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernAntimatterDimensionsTab"
        : "ClassicAntimatterDimensionsTab";
    }
  },
  methods: {
    update() {
      // This only exists to force a key-swap after pressing the button to start a new game; this clears out and redraws
      // any components which would otherwise possibly linger around with END formatting bugs
      this.newGameKey = Pelle.isDoomed;
    }
  }
};
</script>

<template>
  <component
    :is="activeComponent"
    :key="newGameKey"
  />
</template>
