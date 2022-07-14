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
      tabs: Array
    };
  },
  methods: {
    update() {
      this.isHidden = AutomatorData.isEditorFullscreen;
      this.tabs = Tabs.newUI.filter(x => x.isAvailable);
    },
  },
};
</script>

<template>
  <div
    v-if="!isHidden"
    class="c-modern-sidebar"
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
