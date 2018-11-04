Vue.component('game-tab-with-subtabs', {
  props: ['tabs', 'value'],
  computed: {
    visibleTabs: function() {
      return this.tabs.filter(tab => this.isUnlocked(tab));
    },
    firstTab: function() {
      return this.tabs[0];
    },
    openedTab: function() {
      if (!this.value || this.value === String.empty) {
        return this.firstTab;
      }
      const tab = this.tabs.find(tab => tab.id === this.value);
      if (!this.isUnlocked(tab)) {
        return this.firstTab;
      }
      return tab;
    }
  },
  methods: {
    isUnlocked: function(tab) {
      return tab !== undefined && (tab.condition === undefined || tab.condition());
    }
  },
  template:
    `<div class="l-game-tab-with-subtabs">
      <div v-if="visibleTabs.length > 1" class="l-game-tab-with-subtabs__tab-buttons-container">
        <secondary-tab-button
          v-for="tab in visibleTabs"
          :key="tab.name"
          class="l-game-tab-with-subtabs__tab-button"
          @click="emitInput(tab.id)"
        >{{ tab.name }}</secondary-tab-button>
      </div>
      <slot name="before-content"/>
      <component :is="openedTab.component" />
    </div>`
});
