"use strict";

Vue.component("modal-hidden-tabs", {
  data() {
    return {
      tabs: null,
    };
  },
  methods: {
    update() {
      this.tabs = Tab;
    },
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
  <modal-close-button @click="emitClose"/>
  Click a button to toggle showing a tab on/off.
  <br>
  Some tabs cannot be hidden.
  <br>
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div v-for="tab in tabs">
        <subtab-group
          :tab="tab"/>
        <br>
      </div>
    </div>
  <br>
  </div>
  `
});

Vue.component("subtab-group", {
  props: {
    tab: Object,
  },
  data() {
    return {
      tabName: String,
      subtabs: Object,
    };
  },
  computed: {
  },
  methods: {
    update() {
      this.tabName = this.tab.config.name;
      this.subtabs = this.tab.subtabs;
    },
    toggleVisibility(tab) {
      tab.toggleVisibility();
    },
    classObject(subtab) {
      return {
        "o-tab-btn": true,
        "o-tab-btn--secondary": true,
        "o-primary-btn--disabled": subtab.isHidden && subtab.hidable,
      };
    },
  },
  template: `
    <div class="c-auto-sac-type-tab__effect-desc l-specified-effect-tab__effect-desc"
      v-if="tab.isUnlocked">
        <div @click="toggleVisibility(tab)">
          {{ tabName }} Tab
        </div>
        <br>
        <div v-for="subtab in subtabs" v-if="subtab.isUnlocked"
          :class="classObject(subtab)"
          @click="toggleVisibility(subtab)">
            {{ subtab.name }}
        </div>
    </div>
  `
});
