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
      tabs: Object
    };
  },
  methods: {
    update() {
      this.isHidden = AutomatorData.isEditorFullscreen;
      this.tabs = Tabs.newUI.filter(x => x.isAvailable && !x.isHidden);
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
      class="o-tab-btn--moderntab"
    />
  </div>
</template>

<style scoped>
.o-tab-btn--moderntab:last-child {
  border-bottom-right-radius: var(--var-border-radius, 0.5rem);
}

.o-tab-btn--moderntab:last-child:hover {
  border-bottom-right-radius: 0;
}
</style>
