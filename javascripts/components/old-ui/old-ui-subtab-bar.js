"use strict";

Vue.component("old-ui-subtab-bar", {
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
  template: `
    <div v-if="isVisible">
      <old-ui-subtab-button v-for="(subtab, i) in subtabs" :key="i" :subtab="subtab" />
    </div>
  `
});
