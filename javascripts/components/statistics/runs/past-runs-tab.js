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
          getRuns: () => player.records.lastTenRealities,
          reward: (runGain, run, average) => (average
            ? `${runGain} RM`
            : `a level ${formatInt(run[4])} glyph, ${runGain} RM`),
          // Note that runGain is a string so we can't use it for pluralize
          prestigeCountReward: (runGain, run) => `${runGain} ${pluralize("Reality", run[2], "Realities")}`,
        },
        eternity: {
          name: "Eternity",
          plural: "Eternities",
          currency: "EP",
          condition: () => PlayerProgress.eternityUnlocked(),
          getRuns: () => player.records.lastTenEternities,
          reward: runGain => `${runGain} EP`,
          prestigeCountReward: (runGain, run) => `${runGain} ${pluralize("Eternity", run[2], "Eternities")}`,
        },
        infinity: {
          name: "Infinity",
          plural: "Infinities",
          currency: "IP",
          condition: () => PlayerProgress.infinityUnlocked(),
          getRuns: () => player.records.lastTenInfinities,
          reward: runGain => `${runGain} IP`,
          prestigeCountReward: (runGain, run) => `${runGain} ${pluralize("Infinity", run[2], "Infinities")}`,
        },
      },
      showLastTenResourceGain: false
    };
  },
  watch: {
    showLastTenResourceGain(newValue) {
      player.options.showLastTenResourceGain = newValue;
    }
  },
  methods: {
    update() {
      this.showLastTenResourceGain = player.options.showLastTenResourceGain;
    }
  },
  template: `
    <div class="c-stats-tab">
      <div class="c-subtab-option-container">
        <primary-button-on-off-custom
          v-model="showLastTenResourceGain"
          on="Showing resource gain"
          off="Showing prestige count gain"
          class="o-primary-btn--subtab-option"
        />
      </div>
      <past-runs-container
        v-for="layer in layers"
        :key="layer.name"
        :layer="layer"
      />
    </div>`
});