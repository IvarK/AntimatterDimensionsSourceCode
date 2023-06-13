<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "H2PModal",
  components: {
    ModalCloseButton,
  },
  data() {
    return {
      tabId: 0,
      searchValue: "",
    };
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
      return GameDatabase.h2p.search(this.searchValue).filter(searchObj => searchObj.tab.isUnlocked());
    },
    topThreshold() {
      return Math.min(this.matchingTabs[Math.min(this.matchingTabs.length - 1, 4)].relevance + 0.01, 0.5);
    }
  },
  created() {
    const unlockedTabs = GameDatabase.h2p.tabs.filter(tab => tab.isUnlocked());
    const tab = this.$viewModel.tab;
    const subtab = `${tab}/${this.$viewModel.subtab}`;
    const matchedEntry = unlockedTabs.find(h2pTab => h2pTab.tab === subtab || h2pTab.tab === tab);
    this.activeTab = ui.view.h2pForcedTab || matchedEntry || unlockedTabs[0];
    ui.view.h2pForcedTab = undefined;
    // Force-show the H2P info initally regardless of tab while the tooltip for the H2P button is still active
    if (Tutorial.emphasizeH2P()) this.activeTab = GameDatabase.h2p.tabs[0];
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      document.getElementById("h2p-body").scrollTop = 0;
    },
    isFirstIrrelevant(idx) {
      const matches = this.matchingTabs;
      const searchObjThis = matches[idx];
      const searchObjOther = matches[idx - 1];

      return idx > 0 &&
        searchObjThis.relevance >= this.topThreshold &&
        searchObjOther.relevance < this.topThreshold;
    }
  },
};
</script>

<template>
  <div class="l-h2p-modal">
    <ModalCloseButton @click="emitClose" />
    <div class="l-h2p-header">
      <div class="c-h2p-title">
        How To Play
      </div>
    </div>
    <div class="l-h2p-container">
      <div class="l-h2p-search-tab">
        <input
          ref="input"
          v-model="searchValue"
          placeholder="Type to search..."
          class="c-h2p-search-bar"
          @keyup.esc="emitClose"
        >
        <div class="l-h2p-tab-list">
          <div
            v-for="(searchObj, searchObjId) in matchingTabs"
            :key="searchObj.tab.name"
            class="o-h2p-tab-button"
            :class="{
              'o-h2p-tab-button--selected': searchObj.tab === activeTab,
              'o-h2p-tab-button--relevant': searchObj.relevance < topThreshold,
              'o-h2p-tab-button--first-irrelevant': isFirstIrrelevant(searchObjId)
            }"
            @click="setActiveTab(searchObj.tab)"
          >
            {{ searchObj.tab.alias }}
          </div>
        </div>
      </div>
      <div class="l-h2p-info">
        <div class="c-h2p-body--title">
          {{ activeTab.name }}
        </div>
        <div
          id="h2p-body"
          class="l-h2p-body c-h2p-body"
          v-html="activeTab.info()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.o-h2p-tab-button--relevant {
  background-color: #df505055;
}

.o-h2p-tab-button--first-irrelevant {
  border-top: 0.1rem solid black;
  margin-top: 0.8rem;
}

.s-base--dark .o-h2p-tab-button--first-irrelevant {
  border-top-color: white;
}

.t-s12 .o-h2p-tab-button--first-irrelevant {
  border-top-color: black;
}
</style>
