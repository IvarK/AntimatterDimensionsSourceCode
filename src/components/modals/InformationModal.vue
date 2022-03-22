<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "InformationModal",
  components: {
    ModalCloseButton,
  },
  data() {
    return {
      tabId: 0,
    };
  },
  computed: {
    activeTab: {
      get() {
        return this.tabs[this.tabId];
      },
      set(tab) {
        this.tabId = tab.id;
      }
    },
    tabs() {
      return GameDatabase.information.tabs;
    }
  },
  methods: {
    setActiveTab(tab) {
      // Donate tab
      if (tab.id === 2) SecretAchievement(33).unlock();

      this.activeTab = tab;
      document.getElementById("h2p-body").scrollTop = 0;
    },
  }
};
</script>

<template>
  <div class="l-information-modal">
    <ModalCloseButton @click="emitClose" />
    <div class="l-h2p-header">
      <div class="c-h2p-title">
        Information
      </div>
    </div>
    <div class="l-h2p-container">
      <div class="l-information-modal--search-tab">
        <div class="l-information-modal--tab-list">
          <div
            v-for="tab in tabs"
            :key="tab.name"
            class="o-h2p-tab-button"
            :class="tab === activeTab ? 'o-h2p-tab-button--selected' : ''"
            @click="setActiveTab(tab)"
          >
            {{ tab.name }}
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