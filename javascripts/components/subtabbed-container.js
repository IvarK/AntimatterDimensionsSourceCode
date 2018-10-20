Vue.component('subtabbed-container', {
  props: ['tabs', 'model', 'view', 'value'],
  data: function() {
    return {
      openedTab: this.value && this.isUnlocked(this.value) ? this.value : this.tabs[0]
    };
  },
  template:
    '<div>\
        <tr>\
            <td is="subtab-button" v-for="tab in visibleTabs" :key="tab.name" @click="openTab(tab)">{{ tab.name }}</td>\
        </tr>\
        <component :is="openedTab.component" :model="model" :view="view"></component>\
    </div>',
  computed: {
    visibleTabs: function() {
      return this.tabs.filter(tab => this.isUnlocked(tab));
    }
  },
  methods: {
    openTab: function(tab) {
      this.openedTab = tab;
      this.emitInput(tab);
    },
    isUnlocked: function(tab) {
      return tab !== undefined && (tab.condition === undefined || tab.condition());
    }
  },
  components: {
    'subtab-button': {
      template:
        '<td><secondary-tab-button v-on="$listeners" ><slot></slot></secondary-tab-button></td>'
    }
  }
});
