Vue.component("game-tab-with-subtabs", {
  props: {
    tabs: Array,
    value: {
      type: String,
      default: undefined
    }
  },
  computed: {
    visibleTabs() {
      return this.tabs.filter(tab => this.isUnlocked(tab));
    },
    firstTab() {
      return this.tabs[0];
    },
    openedTab() {
      if (!this.value || this.value === "") {
        return this.firstTab;
      }
      const tab = this.tabs.find(t => t.id === this.value);
      if (!this.isUnlocked(tab)) {
        return this.firstTab;
      }
      return tab;
    }
  },
  methods: {
    isUnlocked(tab) {
      return tab !== undefined && (tab.condition === undefined || tab.condition());
    },
    handleTabClick(tab) {
      this.emitInput(tab.id);
      GameUI.dispatch(GameEvent.TAB_CHANGED);
    }
  },
  template:
    `<div class="l-game-tab-with-subtabs">
      <slot name="before-subtabs"/>
      <div v-if="visibleTabs.length > 1" class="l-game-tab-with-subtabs__tab-buttons-container">
        <secondary-tab-button
          v-for="tab in visibleTabs"
          :key="tab.name"
          class="l-game-tab-with-subtabs__tab-button"
          @click="handleTabClick(tab)"
        >{{ tab.name }}</secondary-tab-button>
      </div>
      <slot name="before-content"/>
      <component :is="openedTab.component" />
    </div>`
});
