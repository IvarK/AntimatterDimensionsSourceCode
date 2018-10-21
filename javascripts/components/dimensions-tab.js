Vue.component('dimensions-tab', {
  props: ['model', 'view', 'actions'],
  data: function() {
    return {
      tabs: [
        {
          name: "Dimensions",
          id: "Dimensions",
          component: "dimensions-normal"
        },
        {
          name: "Infinity Dimensions",
          id: "Infinity Dimensions",
          component: "statistics-challenges",
          condition: function() {
            return this.model.player.challenges.length > 1;
          }.bind(this)
        },
        {
          name: "Time Dimensions",
          id: "Time Dimensions",
          component: "statistic-past-infinities",
          condition: function() {
            return this.progress.infinityUnlocked();
          }.bind(this)
        },
        {
          name: "Production",
          id: "Production",
          component: "dimensions-production",
          condition: function() {
            return this.progress.infinityUnlocked();
          }.bind(this)
        }
      ]
    };
  },
  computed: {
    progress: function() {
      return PlayerProgress.of(this.model.player);
    }
  },
  template:
    `<tab-container>
      <subtabbed-container
        class="tab-content"
        :tabs="tabs"
        :model="model"
        :view="view"
        v-model="view.tabs.dimensions.subtab">
      </subtabbed-container>
    </tab-container>`
});