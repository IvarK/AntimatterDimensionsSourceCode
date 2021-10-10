"use strict";

Vue.component("sidebar", {
  data() {
    return {
      isHidden: false,
    };
  },
  computed: {
    tabs: () => [
      Tab.dimensions,
      Tab.challenges,
      Tab.infinity,
      Tab.eternity,
      Tab.reality,
      Tab.celestials,
      Tab.achievements,
      Tab.statistics,
      Tab.options,
      Tab.shop
    ],
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
