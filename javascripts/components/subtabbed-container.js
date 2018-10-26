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
    '<div>\
        <tr v-if="visibleTabs.length > 1">\
            <td is="subtab-button" v-for="tab in visibleTabs" :key="tab.name" @click="emitInput(tab.id)">{{ tab.name }}</td>\
        </tr>\
        <component :is="openedTab.component" :model="model" :view="view"></component>\
    </div>',
  components: {
    'subtab-button': {
      template:
        '<td><secondary-tab-button v-on="$listeners" ><slot></slot></secondary-tab-button></td>'
    }
  }
});
