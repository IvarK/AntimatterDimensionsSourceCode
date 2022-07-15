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
      tabVisibility: false
    };
  },
  computed: {
    tabs: () => Tabs.newUI
  },
  methods: {
    update() {
      this.isHidden = AutomatorData.isEditorFullscreen;
      this.tabVisibility = Tabs.newUI.map(x => x.isAvailable);
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
    <template
      v-for="(tab, tabPosition) in tabs"
    >
      <ModernTabButton
        v-if="tabVisibility[tabPosition]"
        :key="tab.name"
        :tab="tab"
        :tab-position="tabPosition"
      />
    </template>
  </div>
</template>

<style scoped>

</style>
