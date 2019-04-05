Vue.component('past-eternities-tab', {
  mixins: [pastRunsMixin],
  data: function() {
    return {
      runs: player.lastTenEternities,
      reward: function(run) {
        return this.runGain(run) + " EP";
      }
    };
  },
  template:
    `<past-runs-tab
      :runs="runs"
      singular="Eternity"
      plural="Eternities"
      points="EP"
      :reward="reward"
      :real-time-index=2
    />`
});