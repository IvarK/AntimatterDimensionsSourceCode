Vue.component('game-tab-with-subtabs', {
  props: ['tabs', 'model', 'view', 'value'],
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
    `<game-tab>
      <div class="l-game-tab-with-subtabs">
        <div v-if="visibleTabs.length > 1" class="l-game-tab-with-subtabs__tab-buttons-container">
          <secondary-tab-button
            v-for="tab in visibleTabs"
            :key="tab.name"
            class="l-game-tab-with-subtabs__tab-button"
            @click="emitInput(tab.id)"
          >{{ tab.name }}</secondary-tab-button>
        </div>
        <component
          :is="openedTab.component"
          :model="model"
          :view="view"
        />
      </div>
    </game-tab>`
});
