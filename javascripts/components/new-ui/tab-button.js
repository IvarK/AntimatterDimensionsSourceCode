"use strict";

Vue.component("tab-button", {
  data() {
    return {
      visible: false,
      subtabVisibilities: []
    };
  },
  props: {
    tab: Object
  },
  methods: {
    changeTab(tab) {
      this.$viewModel.page = tab;
    },
    update() {
      this.visible = this.tab.condition();
      if (this.tab.subtabs) this.subtabVisibilities = this.tab.subtabs.map(x => x.condition());
    }
  },
  template:
  `<div class="tab-button" :class="tab.class">
    <div 
      @click="changeTab(tab.component)"
      v-if="visible"
      class="tab-button-inner">
      <h3>{{ tab.label }}</h3>
    </div>
    <div v-else class="tab-button-inner"><h3>???</h3></div>
    <div class="subtabs" v-if="visible && subtabVisibilities.filter(x => x).length > 1">
      <div v-for="(subtab, index) in tab.subtabs">
        <div 
          v-if="subtabVisibilities[index]"
          class="subtab" :class="tab.class"
          @click="changeTab(subtab.component)">{{ subtab.label }}</div>
      </div>
    </div>
  </div>`
});