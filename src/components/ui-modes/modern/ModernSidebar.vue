<script>
import ModernSidebarCurrency from "./ModernSidebarCurrency";
import ModernTabButton from "./ModernTabButton";

export default {
  name: "ModernSidebar",
  components: {
    ModernSidebarCurrency,
    ModernTabButton
  },
  data() {
    return {
      isHidden: false,
    };
  },
  computed: {
    tabs: () => Tabs.newUI
  },
  methods: {
    update() {
      this.isHidden = AutomatorData.isEditorFullscreen;
    },
  },
};
</script>

<template>
  <div
    v-if="!isHidden"
    class="sidebar"
  >
    <ModernSidebarCurrency />
    <ModernTabButton
      v-for="(tab, tabPosition) in tabs"
      :key="tab.name"
      :tab="tab"
      :tab-position="tabPosition"
    />
  </div>
</template>

<style scoped>

</style>
