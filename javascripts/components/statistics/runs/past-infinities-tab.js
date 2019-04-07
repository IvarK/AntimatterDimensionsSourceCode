Vue.component("past-infinities-tab", {
  mixins: [pastRunsMixin],
  data() {
    return {
      runs: player.lastTenRuns,
      reward(run) {
        return this.runGain(run) + " IP";
      }
    };
  },
  template:
    `<past-runs-tab
      :runs="runs"
      singular="Infinity"
      plural="Infinities"
      points="IP"
      :reward="reward"
      :real-time-index=2
    />`
});