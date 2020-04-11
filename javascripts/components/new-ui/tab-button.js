"use strict";

Vue.component("tab-button", {
  props: {
    tab: Object
  },
  data() {
    return {
      isAvailable: false,
      subtabVisibilities: [],
      hasNotification: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-tab-btn": true,
        "o-tab-btn--subtabs": this.isAvailable && this.subtabVisibilities.filter(x => x).length > 1,
      };
    },
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
      this.hasNotification = this.tab.hasNotification;
    }
  },
  template:
  `<div :class="[classObject, tab.config.UIClass]">
    <div 
      v-if="isAvailable"
      class="l-tab-btn-inner"
      @click="tab.show()"
    >
      {{ tab.name }} {{ hasNotification ? "(!)" : "" }}
    </div>
    <div v-else class="l-tab-btn-inner">???</div>
    <div class="subtabs" v-if="isAvailable && subtabVisibilities.filter(x => x).length > 1">
      <div v-for="(subtab, index) in tab.subtabs"
          v-if="subtabVisibilities[index]"
          class="o-tab-btn o-tab-btn--subtab"
          :class="tab.config.UIClass"
          @click="subtab.show()"><span v-html="subtab.symbol"> {{ subtab.hasNotification ? "(!)" : "" }}</span>
      </div>
    </div>
  </div>`
});
