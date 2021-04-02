"use strict";

Vue.component("sidebar", {
  data() {
    return {
      RMVisible: false,
      newsEnabled: false
    };
  },
  methods: {
    update() {
      this.RMVisible = PlayerProgress.realityUnlocked();
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
  template:
  `<div class="sidebar">
    <sidebar-rm v-if="RMVisible" />
    <tab-button 
      v-for="tab in tabs"
      :key="tab.name"
      :tab="tab" 
    />
  </div>`
});
