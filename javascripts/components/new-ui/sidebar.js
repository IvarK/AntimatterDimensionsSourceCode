"use strict";

Vue.component("sidebar", {
  data() {
    return {
      ipVisible: false,
      epVisible: false,
      rmVisible: false
    };
  },
  methods: {
    update() {
      this.ipVisible = player.infinitied.gt(0);
      this.epVisible = PlayerProgress.eternityUnlocked();
      this.rmVisible = player.realities > 0;
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
    <sidebar-ip :cond="ipVisible" />
    <sidebar-ep :cond="epVisible" />
    <sidebar-rm :cond="rmVisible" />
    <tab-button 
      v-for="tab in tabs"
      :key="tab.name"
      :tab="tab" 
    />
  </div>`
});
