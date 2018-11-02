Vue.component('statistics-tab', {
  props: ['model', 'view', 'actions'],
  data: function() {
    return {
      isChallengeTabUnlocked: false,
      isInfinitiesTabUnlocked: false,
      isEternitiesTabUnlocked: false,
      isRealitiesTabUnlocked: false,
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
          condition: function() { return this.isChallengeTabUnlocked; }.bind(this)
        },
        {
          name: "Past Infinities",
          id: "Past Infinities",
          component: "statistic-past-infinities",
          condition: function() { return this.isInfinitiesTabUnlocked; }.bind(this)
        },
        {
          name: "Past Eternities",
          id: "Past Eternities",
          component: "statistic-past-eternities",
          condition: function() { return this.isEternitiesTabUnlocked; }.bind(this)
        },
        {
          name: "Past Realities",
          id: "Past Realities",
          component: "statistic-past-realities",
          condition: function() { return this.isRealitiesTabUnlocked; }.bind(this)
        }
      ]
    };
  },
  methods: {
    update() {
      const progress = PlayerProgress.current;
      this.isChallengeTabUnlocked = player.challenges.length > 1;
      this.isInfinitiesTabUnlocked = progress.isInfinityUnlocked;
      this.isEternitiesTabUnlocked = progress.isEternityUnlocked;
      this.isRealitiesTabUnlocked = progress.isRealityUnlocked;
    }
  },
  template:
    `<subtabbed-container
      style="color: black; font-size: 12px; font-family: Typewriter"
      class="tab-content"
      :tabs="tabs"
      :model="model"
      v-model="view.tabs.statistics.subtab">
    </subtabbed-container>`
});