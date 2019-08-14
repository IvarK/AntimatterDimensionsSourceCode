"use strict";

Vue.component("past-infinities-tab", {
  data() {
    return {
      getRuns: () => player.lastTenRuns,
      reward: runGain => `${runGain} IP`
    };
  },
  template:
    `<past-runs-tab
      :getRuns="getRuns"
      singular="Infinity"
      plural="Infinities"
      points="IP"
      :reward="reward"
    />`
});
