"use strict";

Vue.component("past-realities-tab", {
  data() {
    return {
      getRuns: () => player.lastTenRealities,
      reward: (runGain, run) => `${runGain} ${pluralize("reality machine", run[1])} and a level ${run[3]} glyph`
    };
  },
  template:
    `<past-runs-tab
      :getRuns="getRuns"
      singular="Reality"
      plural="Realities"
      points="RM"
      :reward="reward"
    />`
});
