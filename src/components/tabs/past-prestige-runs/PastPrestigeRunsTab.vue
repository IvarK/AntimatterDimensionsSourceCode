<script>
import PastPrestigeRunsContainer from "./PastPrestigeRunsContainer";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "PastPrestigeRunsTab",
  components: {
    PastPrestigeRunsContainer,
    PrimaryToggleButton
  },
  data() {
    return {
      layers: {
        reality: {
          name: "Reality",
          plural: "Realities",
          currency: "RM",
          condition: () => PlayerProgress.realityUnlocked(),
          getRuns: () => player.records.recentRealities,
          extra: ["Glyph Level", "Relic Shards"],
          formatExtra: [x => formatInt(x), x => format(x, 2)],
          allowRate: [false, true],
          rateString: ["", "Relic Shard Rate"],
        },
        eternity: {
          name: "Eternity",
          plural: "Eternities",
          currency: "EP",
          condition: () => PlayerProgress.eternityUnlocked(),
          getRuns: () => player.records.recentEternities,
          extra: ["Tachyon Particles"],
          formatExtra: [x => format(x, 2)],
          allowRate: [false],
        },
        infinity: {
          name: "Infinity",
          plural: "Infinities",
          currency: "IP",
          condition: () => PlayerProgress.infinityUnlocked(),
          getRuns: () => player.records.recentInfinities,
        },
      },
      showRate: false,
    };
  },
  watch: {
    showRate(newValue) {
      player.options.showRecentRate = newValue;
    },
  },
  methods: {
    update() {
      this.showRate = player.options.showRecentRate;
    }
  }
};
</script>

<template>
  <div class="c-stats-tab">
    <div class="c-subtab-option-container">
      <PrimaryToggleButton
        v-model="showRate"
        on="Showing resource gain rate"
        off="Showing absolute resource gain"
        class="o-primary-btn--subtab-option"
      />
    </div>
    <PastPrestigeRunsContainer
      v-for="layer in layers"
      :key="layer.name"
      :layer="layer"
    />
  </div>
</template>
