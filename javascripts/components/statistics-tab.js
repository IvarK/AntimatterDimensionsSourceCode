Vue.component('statistics-tab', {
  props: ['model', 'view', 'actions'],
  data: function() {
    return {
      tabs: [
        {
          name: "Statistics",
          id: "Statistics",
          component: "statistics-stats-tab"
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
            return this.progress.isInfinityUnlocked;
          }.bind(this)
        },
        {
          name: "Past Eternities",
          id: "Past Eternities",
          component: "statistic-past-eternities",
          condition: function() {
            return this.progress.isEternityUnlocked;
          }.bind(this)
        },
        {
          name: "Past Realities",
          id: "Past Realities",
          component: "statistic-past-realities",
          condition: function() {
            return this.progress.isRealityUnlocked;
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
    `<tab-container id="statistics" style="color: black; font-size: 12px; font-family: Typewriter">
      <subtabbed-container
        class="tab-content"
        :tabs="tabs"
        :model="model"
        v-model="view.tabs.statistics.subtab">
      </subtabbed-container>
    </tab-container>`
});