Vue.component('subtabbed-container', {
  props: ['tabs', 'model'],
  data: function() {
    return {
      openedTab: this.tabs[0]
    }
  },
  template:
    '<div>\
        <tr>\
            <td is="subtab-button" v-for="tab in tabs" @click="openTab(tab)" v-if="canShow(tab)" >{{ tab.name }}</td>\
        </tr>\
        <keep-alive>\
            <component :is="openedTab.component" :model="model"></component>\
        </keep-alive>\
    </div>',
  methods: {
    openTab: function(tab) {
      this.openedTab = tab;
    },
    canShow: function(tab) {
      return tab.condition === undefined || tab.condition();
    }
  },
  components: {
    'subtab-button': {
      template:
        '<td><secondary-button v-on="$listeners" ><slot></slot></secondary-button></td>'
    }
  }
});
