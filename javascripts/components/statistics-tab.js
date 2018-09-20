Vue.component('statistics-tab', {
  props: ['model', 'view', 'actions'],
  data: function() {
    return {
      tabs: [
        {name: "Statistics", component: "statistics-stats-tab"},
        {
          name: "Challenge records",
          component: "statistics-challenges",
          condition: function() {
            return this.model.player.challenges.length > 1;
          }.bind(this)
        },
        {
          name: "Past Infinities",
          component: "statistic-past-infinities",
          condition: function() {
            return this.progress.infinityUnlocked();
          }.bind(this)
        },
        {
          name: "Past Eternities",
          component: "statistic-past-eternities",
          condition: function() {
            return this.progress.eternityUnlocked();
          }.bind(this)
        },
        {
          name: "Past Realities",
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
    '<tab-container id="statistics" stickyFooter="true" style="color: black; font-size: 12px; font-family: Typewriter; margin: 0 auto">\
      <subtabbed-container :tabs="tabs" :model="model"></subtabbed-container>\
    </tab-container>'
});