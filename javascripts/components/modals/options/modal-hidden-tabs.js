"use strict";

Vue.component("modal-hidden-tabs", {
  data() {
    return {
      tabs: null,
    };
  },
  computed: {
    tabDB() {
      return GameDatabase.tabs;
    },
  },
  methods: {
    update() {
      this.tabs = GameDatabase.tabs;
    },
  },
  template: `
  <div class="c-modal-message l-modal-content--centered" style="height: 50rem; overflow-y: scroll;">
  <modal-close-button @click="emitClose"/>
  Click a button to toggle showing a tab on/off.  Some tabs cannot be hidden.
  <br>
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div v-for="tab in tabDB">
        {{ tab.name }} Tab
        <br>
        <subtab-toggle class="c-auto-sac-type-tab__effect-desc l-specified-effect-tab__effect-desc"
          v-for="subtab in tab.subtabs"
          :tabId="tab.id"
          :subtabId="subtab.id"
          :hidable="subtab.hidable"
          :subtabName="subtab.name"/>
        <br>
      </div>
    </div>
  <br>
  </div>
  `
});

Vue.component("subtab-toggle", {
  props: {
    tabId: Number,
    subtabId: Number,
    hidable: Boolean,
    subtabName: String
  },
  data() {
    return {
      // eslint-disable-next-line no-bitwise
      isHidden: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-tab-btn": true,
        "o-tab-btn--secondary": true,
        "o-primary-btn--disabled": this.isHidden && this.hidable,
      };
    },
  },
  methods: {
    update() {
      // eslint-disable-next-line no-bitwise
      this.isHidden = (player.options.hiddenSubtabBits[this.tabId] & (1 << this.subtabId)) !== 0;
    },
    toggleSelection() {
      this.isHidden = !this.isHidden;
      // eslint-disable-next-line no-bitwise
      player.options.hiddenSubtabBits[this.tabId] ^= (1 << this.subtabId);
    },
  },
  template: `
    <div :class="classObject" @click="toggleSelection()">
      {{ subtabName }}
    </div>
  `
});
