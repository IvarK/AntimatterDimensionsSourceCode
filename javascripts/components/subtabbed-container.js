Vue.component('subtabbed-container', {
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
    `<tab-container>
        <div v-if="visibleTabs.length > 1" style="display: flex; justify-content: center; flex-wrap: wrap">
          <secondary-tab-button style="margin: 5px 8px; flex-shrink: 0" v-for="tab in visibleTabs" :key="tab.name" @click="emitInput(tab.id)">
            {{ tab.name }}
          </secondary-tab-button>
        </div>
        <component :is="openedTab.component" :model="model" :view="view"/>
    </tab-container>`
});
