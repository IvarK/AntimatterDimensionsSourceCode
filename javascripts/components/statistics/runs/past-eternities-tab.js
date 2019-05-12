"use strict";

Vue.component("past-eternities-tab", {
  data() {
    return {
      getRuns: () => player.lastTenEternities,
      reward: runGain => `${runGain} EP`
    };
  },
  template:
    `<past-runs-tab
      :getRuns="getRuns"
      singular="Eternity"
      plural="Eternities"
      points="EP"
      :reward="reward"
    />`
});
