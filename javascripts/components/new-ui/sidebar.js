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
    ]
  },
  template: `
    <div class="sidebar">
      <sidebar-currency />
      <tab-button
        v-for="(tab, index) in tabs"
        :key="tab.name"
        :tab="tab"
      />
    </div>`
});
