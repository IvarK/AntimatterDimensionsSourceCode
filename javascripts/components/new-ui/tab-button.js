"use strict";

Vue.component("tab-button", {
  props: {
    tab: Object
  },
  data() {
    return {
      isAvailable: false,
      isHidden: false,
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
      this.isHidden = this.tab.isHidden;
      this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
      this.hasNotification = this.tab.hasNotification;
    }
  },
  template:
  `<div v-if="!isHidden" :class="[classObject, tab.config.UIClass]">
    <div 
      v-if="isAvailable"
      class="l-tab-btn-inner"
      @click="tab.show(true)"
    >
      {{ tab.name }} <i v-if="hasNotification" class="fas fa-exclamation"></i>
    </div>
    <div v-else class="l-tab-btn-inner">???</div>
    <div class="subtabs" v-if="isAvailable && subtabVisibilities.filter(x => x).length > 1">
      <div v-for="(subtab, index) in tab.subtabs"
        v-if="subtabVisibilities[index]"
        class="o-tab-btn o-tab-btn--subtab"
        :class="tab.config.UIClass"
        @click="subtab.show(true)">
        <span v-html="subtab.symbol">
          <i v-if="subtab.hasNotification" class="fas fa-exclamation"></i>
        </span>
        <div class="o-subtab__tooltip">
          {{ subtab.name }}
        </div>
      </div>
      </div>
    </div>
  </div>`
});
