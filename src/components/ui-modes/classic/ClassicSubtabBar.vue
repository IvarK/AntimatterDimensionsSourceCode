<script>
import ClassicSubtabButton from "./ClassicSubtabButton";

export default {
  name: "ClassicSubtabBar",
  components: {
    ClassicSubtabButton
  },
  data() {
    return {
      isVisible: false
    };
  },
  computed: {
    tab: () => Tabs.current,
    subtabs() {
      return this.tab.subtabs;
    }
  },
  methods: {
    update() {
      this.isVisible = this.subtabs.countWhere(subtab => subtab.isAvailable) > 1;
    }
  },
};
</script>

<template>
  <div
    v-if="isVisible"
    class="c-subtab-button-container"
  >
    <ClassicSubtabButton
      v-for="(subtab, i) in subtabs"
      :key="i"
      :subtab="subtab"
      :parent-name="tab.name"
    />
  </div>
</template>

<style scoped>

</style>
