"use strict";

Vue.component("old-ui-tab-bar", {
  computed: {
    tabs: () => Tabs.oldUI
  },
  template: `
    <div>
      <old-ui-tab-button v-for="(tab, i) in tabs" :key="i" :tab="tab" />
    </div>`
});
