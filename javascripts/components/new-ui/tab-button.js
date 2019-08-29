"use strict";

Vue.component("tab-button", {
  props: {
    tab: Object
  },
  data() {
    return {
      isAvailable: false,
      subtabVisibilities: []
    };
  },
  computed: {
    classObject() {
      return {
        "tab-button": true,
        "tab-button-subtabs": this.isAvailable && this.subtabVisibilities.filter(x => x).length > 1,
      };
    },
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
    }
  },
  template:
  `<div :class="[classObject, tab.config.newUIClass]">
    <div 
      v-if="isAvailable"
      class="tab-button-inner"
      @click="tab.show()"
    >
      <h3>{{ tab.name }}</h3>
    </div>
    <div v-else class="tab-button-inner"><h3>???</h3></div>
    <div class="subtabs" v-if="isAvailable && subtabVisibilities.filter(x => x).length > 1">
      <div v-for="(subtab, index) in tab.subtabs"
          v-if="subtabVisibilities[index]"
          class="subtab"
          :class="tab.config.newUIClass"
          @click="subtab.show()"><span v-html="subtab.symbol"></span>
      </div>
    </div>
  </div>`
});
