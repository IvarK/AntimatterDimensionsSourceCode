"use strict";

Vue.component("sidebar", {
  data() {
    return {
      newsEnabled: false
    };
  },
  methods: {
    update() {
      this.newsEnabled = player.options.news.enabled;
    }
  },
  computed: {
    tabs: () => Tabs.newUI
  },
  template: `
    <div class="sidebar">
      <sidebar-currency />
      <tab-button
        v-for="tab in tabs"
        :key="tab.name"
        :tab="tab"
      />
    </div>`
});
