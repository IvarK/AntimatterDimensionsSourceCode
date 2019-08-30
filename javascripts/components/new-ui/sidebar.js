"use strict";

Vue.component("sidebar", {
  data() {
    return {
      IPVisible: false,
      EPVisible: false,
      RMVisible: false
    };
  },
  methods: {
    update() {
      this.IPVisible = PlayerProgress.infinityUnlocked();
      this.EPVisible = PlayerProgress.eternityUnlocked();
      this.RMVisible = PlayerProgress.realityUnlocked();
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
      Tab.options
    ]
  },
  template:
  `<div class="sidebar">
    <sidebar-am />
    <sidebar-ip v-if="IPVisible" />
    <sidebar-ep v-if="EPVisible" />
    <sidebar-rm v-if="RMVisible" />
    <tab-button 
      v-for="tab in tabs"
      :key="tab.name"
      :tab="tab" 
    />
  </div>`
});
