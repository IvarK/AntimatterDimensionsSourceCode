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
          name: "Challenge records",
          id: "Challenge records",
          component: "statistics-challenges",
          condition: function() {
            return this.model.player.challenges.length > 1;
          }.bind(this)
        },
        {
          name: "Past Infinities",
          id: "Past Infinities",
          component: "statistic-past-infinities",
          condition: function() {
            return this.progress.infinityUnlocked();
          }.bind(this)
        },
        {
          name: "Past Eternities",
          id: "Past Eternities",
          component: "statistic-past-eternities",
          condition: function() {
            return this.progress.eternityUnlocked();
          }.bind(this)
        },
        {
          name: "Past Realities",
          id: "Past Realities",
          component: "statistic-past-realities",
          condition: function() {
            return this.progress.realityUnlocked();
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