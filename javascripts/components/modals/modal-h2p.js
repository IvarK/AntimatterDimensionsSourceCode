"use strict";

Vue.component("modal-h2p", {
  data() {
    return {
      tabId: 0,
      searchValue: "",
    };
  },
  created() {
    const unlockedTabs = GameDatabase.h2p.tabs.filter(tab => tab.isUnlocked());
    const tab = this.$viewModel.tab;
    const subtab = `${tab}/${this.$viewModel.subtab}`;
    const matchedEntry = unlockedTabs.find(h2pTab => h2pTab.tab === subtab || h2pTab.tab === tab);
    this.activeTab = matchedEntry || unlockedTabs[0];
  },
  computed: {
    activeTab: {
      get() {
        return GameDatabase.h2p.tabs[this.tabId];
      },
      set(tab) {
        this.tabId = tab.id;
      }
    },
    matchingTabs() {
      return GameDatabase.h2p.search(this.searchValue).filter(tab => tab.isUnlocked());
    }
  },
  methods: {
    update() {
      if (ui.view.h2pForcedTab !== undefined) this.activeTab = ui.view.h2pForcedTab;
    },
    exit() {
      Modal.hide();
      ui.view.h2pForcedTab = undefined;
    },
    setActiveTab(tab) {
      this.activeTab = tab;
      ui.view.h2pForcedTab = undefined;
    }
  },
  template: `
    <div class="l-h2p-modal">
      <div class="l-h2p-header">
        <div class="c-h2p-title">
          How To Play
        </div>
        <div class="c-modal__close-btn o-primary-btn o-primary-btn--modal-close" @click="exit">×</div>
      </div>
      <div class="l-h2p-container">
        <div class="l-h2p-search-tab">
          <input v-model="searchValue" placeholder="Type to search..." class="c-h2p-search-bar" />
          <div class="l-h2p-tab-list">
            <div v-for="tab in matchingTabs"
              :key="tab.name"
              class="o-h2p-tab-button"
              :class="tab === activeTab ? 'o-h2p-tab-button--selected' : ''"
              @click="setActiveTab(tab)"
            >
              {{ tab.alias }}
            </div>
          </div>
        </div>
        <div class="l-h2p-info">
          <div class="c-h2p-body--title">
            {{ activeTab.name }}
          </div>
          <div class="l-h2p-body c-h2p-body" v-html="activeTab.info()" />
        </div>
      </div>
    </div>`
});
