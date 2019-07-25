"use strict";

Vue.component("old-ui-tab-bar", {
  computed: {
    tabs: () => [
      Tab.dimensions,
      Tab.options,
      Tab.statistics,
      Tab.achievements,
      Tab.challenges,
      Tab.infinity,
      Tab.eternity,
      Tab.reality,
      Tab.celestials
    ]
  },
  template: `
    <div>
      <old-ui-tab-button v-for="(tab, i) in tabs" :key="i" :tab="tab" />
    </div>
  `
});
