<script>
import OldTimeDimensionsTab from "./OldTimeDimensionsTab";
import NewTimeDimensionsTab from "./NewTimeDimensionsTab";

export default {
  name: "TimeDimensionsTab",
  components: {
    OldTimeDimensionsTab,
    NewTimeDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI ? "NewTimeDimensionsTab" : "OldTimeDimensionsTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
