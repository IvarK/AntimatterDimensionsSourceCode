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
            `${runGain} ${pluralize("Reality Machine", run[1])}, a level ${formatInt(run[4])} glyph,`,
          // Note that runGain is a string so we can't use it for pluralize
          prestigeCountReward: (runGain, run) => `${runGain} ${pluralize("Reality", run[2], "Realities")}`,
        },
        eternity: {
          name: "Eternity",
          plural: "Eternities",
          currency: "EP",
          condition: () => PlayerProgress.eternityUnlocked(),
          getRuns: () => player.lastTenEternities,
          reward: runGain => `${runGain} EP`,
          prestigeCountReward: (runGain, run) => `${runGain} ${pluralize("Eternity", run[2], "Eternities")}`,
        },
        infinity: {
          name: "Infinity",
          plural: "Infinities",
          currency: "IP",
          condition: () => PlayerProgress.infinityUnlocked(),
          getRuns: () => player.lastTenRuns,
          reward: runGain => `${runGain} IP`,
          prestigeCountReward: (runGain, run) => `${runGain} ${pluralize("Infinity", run[2], "Infinities")}`,
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
          :layer="layer"
        />
    </div>
    `
});