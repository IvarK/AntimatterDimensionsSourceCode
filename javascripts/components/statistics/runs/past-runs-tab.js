"use strict";

Vue.component("past-runs-tab", {
  data() {
    return {
      layers: {
        reality: {
          name: "Reality",
          plural: "Realities",
          currency: "RM",
          condition: () => PlayerProgress.realityUnlocked(),
          getRuns: () => player.lastTenRealities,
          reward: (runGain, run) =>
            `${runGain} ${pluralize("reality machine", run[1])} and a level ${formatInt(run[3])} glyph`
        },
        eternity: {
          name: "Eternity",
          plural: "Eternities",
          currency: "EP",
          condition: () => PlayerProgress.eternityUnlocked(),
          getRuns: () => player.lastTenEternities,
          reward: runGain => `${runGain} EP`
        },
        infinity: {
          name: "Infinity",
          plural: "Infinities",
          currency: "IP",
          condition: () => PlayerProgress.infinityUnlocked(),
          getRuns: () => player.lastTenRuns,
          reward: runGain => `${runGain} IP`
        },
      }
    };
  },
  template:
    `
    <div>
      <past-runs-container
        v-for="layer in layers"
        :key="layer.name"
        v-if="layer.condition"
        :getRuns="layer.getRuns"
        :singular="layer.name"
        :plural="layer.plural"
        :points="layer.currency"
        :reward="layer.reward"
      />
    </div>
    `
});