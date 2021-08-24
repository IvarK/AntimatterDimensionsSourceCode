"use strict";

Vue.component("sidebar", {
  data() {
    return {
      newsEnabled: false,
      isHidden: false,
      isMinimized: false,
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
    minimizeArrowStyle() {
      return {
        transform: this.isMinimized ? "rotateY(180deg)" : "",
      };
    },
  },
  methods: {
    update() {
      this.newsEnabled = player.options.news.enabled;
      this.isHidden = AutomatorData.isEditorFullscreen;
      this.isMinimized = player.options.sidebarMinimized;
    },
    minimize() {
      player.options.sidebarMinimized = !player.options.sidebarMinimized;
    },
  },
  template: `
    <div class="sidebar" v-if="!isHidden">
      <sidebar-currency v-if="!isMinimized" />
      <tab-button
        v-if="!isMinimized"
        v-for="tab in tabs"
        :key="tab.name"
        :tab="tab"
      />
      <button class="ttshop-minimize-btn ttshop-background" @click="minimize">
        <span id="minimizeArrow" :style="minimizeArrowStyle">◀</span>
      </button>
    </div>`
});
