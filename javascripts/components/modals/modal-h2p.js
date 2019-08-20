"use strict";
Vue.component("modal-h2p", {
  data() {
    return {
      menuObject: {
        name: "How to Play?"
      },
      activeTab: this.menuObject,
      searchValue: "",
    };
  },
  created() {
    this.activeTab = this.unlockedTabs.find(
      h2pTab =>
        h2pTab.tab === `${this.$viewModel.tab}/${this.$viewModel.subtab}` || h2pTab.tab === this.$viewModel.tab
    ) || this.menuObject;
  },
  computed: {
    allTabs: () => H2P_TABS,
    unlockedTabs() {
      return this.allTabs.filter(tab => tab.unlock());
    },
    displayMenu() {
      return this.activeTab === this.menuObject;
    },
    searchTerm() {
      return this.searchValue.toLowerCase();
    },
    matchingTabs() {
      if (this.searchTerm === "") return this.unlockedTabs;
      const searchWords = this.searchTerm.split(" ").filter(str => str !== "");
      let unusedTabs = this.unlockedTabs;
      // Find tab names that exactly match the search term
      let tabs = unusedTabs.filter(tab => tab.name.toLowerCase() === this.searchTerm);
      // Used to flush out used tabs
      unusedTabs = unusedTabs.filter(tab => !tabs.includes(tab));
      // Find tab names that start with the search term
      tabs = tabs.concat(unusedTabs.filter(
        tab => tab.name.toLowerCase().slice(0, this.searchTerm.length - 1) === this.searchTerm)
      );
      unusedTabs = unusedTabs.filter(tab => !tabs.includes(tab));
      // Split tab name into individual words and check if they match the search term
      tabs = tabs.concat(unusedTabs.filter(
        tab => tab.name.toLowerCase().split(" ").some(word =>
          word === this.searchTerm)
      ));
      unusedTabs = unusedTabs.filter(tab => !tabs.includes(tab));
      // Split tab name into individual words and check if they start with the search term
      tabs = tabs.concat(unusedTabs.filter(
        tab => tab.name.toLowerCase().split(" ").some(word =>
          word.slice(0, this.searchTerm.length - 1) === this.searchTerm)
      ));
      unusedTabs = unusedTabs.filter(tab => !tabs.includes(tab));
      // Check if any word in the search term exactly matches a tab's search tag
      tabs = tabs.concat(unusedTabs.filter(
        tab => tab.tags.some(
          tag => searchWords.some(
            term => tag.toLowerCase() === term)
      )));
      unusedTabs = unusedTabs.filter(tab => !tabs.includes(tab));
      // Check if any word in the search term matches the start of a tab's search tag
      tabs = tabs.concat(unusedTabs.filter(
        tab => tab.tags.some(
          tag => searchWords.some(term =>
            tag.toLowerCase().slice(0, this.searchTerm.length - 1) === term)
      )));
      unusedTabs = unusedTabs.filter(tab => !tabs.includes(tab));
      // Check if the name or any of the tabs of a tab contain one of the words in the search term
      tabs = tabs.concat(unusedTabs.filter(
        tab => searchWords.some(term => tab.name.toLowerCase().includes(term) || tab.tags.some(
          tag => tag.toLowerCase().includes(term))
      )));
      return tabs;
    }
  },
  methods: {
    goBack() {
      if (this.activeTab === this.menuObject) {
        if (this.searchValue === "") this.exit();
        this.searchValue = "";
      }
      this.activeTab = this.menuObject;
    },
    exit() {
      Modal.hide();
    },
    setActiveTab(id) {
      this.activeTab = this.allTabs[id];
    }
  },
  template: `
  <div class="l-h2p-modal">
    <div class="l-h2p-header">
      <div class="o-h2p-return" @click="goBack" />
      <div class="c-h2p-title">
        {{activeTab.name}}
      </div>
      <div class="o-h2p-exit" @click= "exit" />
    </div>
    <div v-if=displayMenu>
      <div>
        <input v-model="searchValue" placeholder="Type to search..." class="c-h2p-search-bar"/>
      </div>
      <div class="l-h2p-tab-list">
        <button v-for="tab in matchingTabs"
          :key="tab.name"
          class="o-primary-button tabbtn l-h2p-tab-button"
          @click="setActiveTab(tab.id)">
          {{tab.name}}
        </button">
      </div>
    </div>
    <div v-else class="l-h2p-body c-h2p-body" v-html="activeTab.info()" />
  </div>
  `
});
