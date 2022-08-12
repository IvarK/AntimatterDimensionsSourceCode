<script>
import ClassicTabButton from "./ClassicTabButton";

export default {
  name: "ClassicTabBar",
  components: {
    ClassicTabButton,
  },
  computed: {
    tabs: () => Tabs.oldUI,
  },
};
</script>

<template>
  <div>
    <ClassicTabButton
      v-for="(tab, i) in tabs"
      :key="i"
      :tab-position="i"
      :tab="tab"
    />
  </div>
</template>

<style scoped>

</style>
