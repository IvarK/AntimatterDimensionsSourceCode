"use strict";
Vue.component("h2p-modal", {
  data() {
    return {
      activeTab: "menu",
    };
  },
  computed: {
    allTabs: () => H2P_TABS, 
  },
  methods: {

  },
  template: `
  <div class="c-h2p-modal">
    <div v-if=activeTab="menu">
    </div>
    <div v-else>
    <div>
  </div>
  `
});
