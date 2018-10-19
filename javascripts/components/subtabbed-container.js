Vue.component('subtabbed-container', {
  props: ['tabs', 'model', 'view'],
  data: function() {
    return {
      openedTab: this.tabs[0]
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
      return this.tabs.filter(tab => tab.condition === undefined || tab.condition());
    }
  },
  methods: {
    openTab: function(tab) {
      this.openedTab = tab;
    }
  },
  components: {
    'subtab-button': {
      template:
        '<td><secondary-button v-on="$listeners" ><slot></slot></secondary-button></td>'
    }
  }
});
