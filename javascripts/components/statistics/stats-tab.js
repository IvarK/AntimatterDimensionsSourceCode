Vue.component('stats-tab', {
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
          component: "statistics-tab"
        },
        {
          name: "Challenge records",
          id: "Challenge records",
          component: "challenge-records-tab",
          condition: function() { return this.isChallengeTabUnlocked; }.bind(this)
        },
        {
          name: "Past Infinities",
          id: "Past Infinities",
          component: "past-infinities-tab",
          condition: function() { return this.isInfinitiesTabUnlocked; }.bind(this)
        },
        {
          name: "Past Eternities",
          id: "Past Eternities",
          component: "past-eternities-tab",
          condition: function() { return this.isEternitiesTabUnlocked; }.bind(this)
        },
        {
          name: "Past Realities",
          id: "Past Realities",
          component: "past-realities-tab",
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
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.statistics.subtab"
      :tabs="tabs"
      class="c-stats-tab"
    />`
});