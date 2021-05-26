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
  <div class="l-hide-tab-modal">
  <modal-close-button @click="emitClose"/>
    Click a button to toggle showing a tab on/off.
    <br>
    Some tabs cannot be hidden.
    <br>
    <div v-for="tab in tabs" class="l-hide-modal-tab-container">
      <tab-modal-subtab-group :tab="tab"/>
      <br>
    </div>
  </div>
  `
});

Vue.component("tab-modal-subtab-group", {
  props: {
    tab: Object,
  },
  data() {
    return {
      tabName: String,
      subtabs: Object,
      hidden: Boolean,
    };
  },
  computed: {
    classObject() {
      return {
        "l-hide-modal-tab-button": true,
        "c-hide-modal-button--active": !this.hidden,
        "c-hide-modal-button--inactive": this.hidden,
        "c-hide-modal-button--always-visible": !this.tab.config.hidable,
      };
    },
  },
  methods: {
    update() {
      this.tabName = this.tab.config.name;
      this.subtabs = this.tab.subtabs;
      this.hidden = this.tab.isHidden && this.tab.config.hidable;
    },
    toggleVisibility(tab) {
      tab.toggleVisibility();
    },
    getKey(subtab) {
      // eslint-disable-next-line no-bitwise
      return `${1 << (this.tab.config.id)} ${1 << (subtab.config.id + 1)} ${subtab.isHidden}`;
    }
  },
  template: `
    <div class="c-hide-modal-all-subtab-container l-hide-modal-subtab-container"
      v-if="tab.isUnlocked">
        <div :class="classObject"
          @click="toggleVisibility(tab)">
            {{ tabName }}
            <br>
            (hide main tab)
        </div>
        <br>
        <tab-modal-subtab-button
          v-for="subtab in subtabs"
          v-if="subtab.isUnlocked"
          :key="getKey(subtab)"
          :subtab="subtab"/>
    </div>
  `
});

Vue.component("tab-modal-subtab-button", {
  props: {
    subtab: Object,
  },
  data() {
    return {
      hidden: Boolean,
    };
  },
  computed: {
    classObject() {
      return {
        "l-hide-modal-subtab-button": true,
        "c-hide-modal-button--active": !this.hidden,
        "c-hide-modal-button--inactive": this.hidden,
        "c-hide-modal-button--always-visible": !this.subtab.config.hidable,
      };
    },
  },
  methods: {
    update() {
      this.hidden = this.subtab.isHidden && this.subtab.config.hidable;
    },
    toggleVisibility() {
      this.subtab.toggleVisibility();
    },
  },
  template: `
    <div :class="classObject"
      @click="toggleVisibility()">
        {{ subtab.name }}
    </div>
  `
});
