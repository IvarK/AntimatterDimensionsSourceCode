Vue.component("modal-hidden-tabs", {
  data() {
    return {
      tabs: null,
      isEnslaved: false,
    };
  },
  methods: {
    update() {
      this.tabs = Tab;
      this.isEnslaved = Enslaved.isRunning;
    },
  },
  template: `
    <div>
      <modal-close-button @click="emitClose" />
      <h2>Modify Visible Tabs</h2>
      Click a button to toggle showing a tab on/off.
      <br>
      Some tabs cannot be hidden, and you cannot hide your current tab.
      <br>
      <div v-if="isEnslaved">
        <br>
        <i>You must... see everywhere...</i>
        <br>
        (You cannot hide your tabs within this Reality)
      </div>
      <div v-for="tab in tabs" class="l-hide-modal-tab-container">
        <tab-modal-subtab-group :tab="tab" />
      </div>
    </div>`
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
    styleObjectRow() {
      return {
        "background-color": this.hidden ? "var(--color-bad)" : "var(--color-good)",
      };
    },
    isCurrentTab() {
      return this.tab.id === Tabs.current.id;
    },
    classObjectButton() {
      return {
        "o-primary-btn": true,
        "c-hide-modal-tab-button": true,
        "c-hide-modal-button--active": !this.hidden,
        "c-hide-modal-button--inactive": this.hidden,
        "c-hide-modal-button--always-visible": !this.tab.config.hidable || this.isCurrentTab,
        "c-hide-modal-button--current": this.isCurrentTab,
        [`c-hide-modal-tab-button--${this.tab.key}`]: !this.isCurrentTab,
      };
    },
  },
  methods: {
    update() {
      this.tabName = this.tab.config.name;
      this.subtabs = this.tab.subtabs;
      this.hidden = this.tab.isHidden && this.tab.config.hidable;
    },
    toggleVisibility() {
      // If this tab and all subtabs are hidden, unhide all subtabs too
      if (this.tab.isHidden && this.subtabs.every(t => t.isHidden || !t.isUnlocked)) {
        for (const subtab of this.subtabs) {
          if (subtab.isUnlocked) subtab.toggleVisibility();
        }
        this.tab.unhideTab();
      } else this.tab.toggleVisibility();
    },
    getKey(subtab) {
      return `${this.tab.id} ${subtab.id} ${subtab.isHidden}`;
    }
  },
  template: `
    <div
      class="c-hide-modal-all-subtab-container l-hide-modal-subtab-container"
      :style="styleObjectRow"
      v-if="tab.isUnlocked"
    >
      <div
        :class="classObjectButton"
        @click="toggleVisibility()"
      >
        {{ tabName }}
        <br>
        (all subtabs)
      </div>
      <br>
      <tab-modal-subtab-button
        v-for="subtab in subtabs"
        v-if="subtab.isUnlocked"
        :key="getKey(subtab)"
        :subtab="subtab"
        :tab="tab"
      />
    </div>`
});

Vue.component("tab-modal-subtab-button", {
  props: {
    subtab: Object,
    tab: Object
  },
  data() {
    return {
      hidden: Boolean,
    };
  },
  computed: {
    isCurrentSubtab() {
      return this.tab.id === Tabs.current.id &&
        this.subtab.id === Tabs.current._currentSubtab.id;
    },
    classObject() {
      return {
        "o-primary-btn": true,
        "c-hide-modal-tab-button": true,
        "c-hide-modal-button--active": !this.hidden,
        "c-hide-modal-button--inactive": this.hidden,
        "c-hide-modal-button--always-visible": !this.subtab.config.hidable || this.isCurrentSubtab,
        "c-hide-modal-button--current": this.isCurrentSubtab,
        [`c-hide-modal-tab-button--${this.tab.key}`]: !this.isCurrentSubtab,
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
    <div
      :class="classObject"
      @click="toggleVisibility()"
    >
      {{ subtab.name }}
    </div>`
});
