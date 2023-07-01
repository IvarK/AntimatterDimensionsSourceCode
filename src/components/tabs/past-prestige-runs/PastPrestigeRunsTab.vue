<script>
import PastPrestigeRunsContainer from "./PastPrestigeRunsContainer";

export default {
  name: "PastPrestigeRunsTab",
  components: {
    PastPrestigeRunsContainer
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
          showExtra: [() => true, () => TeresaUnlocks.effarig.canBeApplied],
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
          showExtra: [() => PlayerProgress.dilationUnlocked()],
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
      resourceType: false,
    };
  },
  computed: {
    resourceText() {
      switch (this.resourceType) {
        case RECENT_PRESTIGE_RESOURCE.ABSOLUTE_GAIN:
          return "total resource gain";
        case RECENT_PRESTIGE_RESOURCE.RATE:
          return "resource gain rate";
        case RECENT_PRESTIGE_RESOURCE.CURRENCY:
          return "prestige currency";
        case RECENT_PRESTIGE_RESOURCE.PRESTIGE_COUNT:
          return "prestige count";
        default:
          throw new Error("Unrecognized Statistics tab resource type");
      }
    }
  },
  methods: {
    update() {
      this.resourceType = player.options.statTabResources;
    },
    cycleButton() {
      const stateCount = Object.keys(RECENT_PRESTIGE_RESOURCE).length;
      player.options.statTabResources = (player.options.statTabResources + 1) % stateCount;
    },
  }
};
</script>

<template>
  <div class="c-stats-tab">
    <div class="c-subtab-option-container">
      <button
        class="o-primary-btn o-primary-btn--subtab-option"
        @click="cycleButton()"
      >
        Showing {{ resourceText }}
      </button>
    </div>
    <PastPrestigeRunsContainer
      v-for="layer in layers"
      :key="layer.name"
      :layer="layer"
    />
  </div>
</template>
