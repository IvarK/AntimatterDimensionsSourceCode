import "./sidebar-resources/sidebar-currency.js";
import "./tab-button.js";

Vue.component("sidebar", {
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
  template: `
    <div class="sidebar" v-if="!isHidden">
      <sidebar-currency />
      <tab-button
        v-for="tab in tabs"
        :key="tab.name"
        :tab="tab"
      />
    </div>`
});
