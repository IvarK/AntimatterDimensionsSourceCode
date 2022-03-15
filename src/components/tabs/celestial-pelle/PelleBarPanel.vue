<script>
import PelleStrike from "./PelleStrike";
import PelleRift from "./PelleRift";

export default {
  name: "PelleBarPanel",
  components: {
    PelleStrike,
    PelleRift
  },
  data() {
    return {
      decayRate: 0,
      isCollapsed: false,
    };
  },
  computed: {
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    },
    strikes: () => PelleStrikes.all.filter(s => s.hasStrike),
  },
  methods: {
    update() {
      this.decayRate = Pelle.riftDrainPercent;
      this.isCollapsed = player.celestials.pelle.collapsed.rifts;
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.rifts = !this.isCollapsed;
    }
  }
};
</script>

<template>
  <div class="l-pelle-panel-container">
    <div class="c-pelle-panel-title">
      <i
        :class="collapseIcon"
        @click="toggleCollapse"
      />
      Pelle Strikes and Rifts
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      When active, Rifts consume {{ formatPercents(decayRate) }} of another resource per second.
      <br>
      Rift effects are based on the total amount of resource drained.
      <div class="c-pelle-bar-container">
        <div
          v-for="strike in strikes"
          :key="strike.config.id"
          class="c-pelle-single-bar"
        >
          <PelleStrike :strike="strike" />
          <PelleRift :rift="strike.rift" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-pelle-panel-title {
  font-weight: bold;
  font-size: 3rem;
  color: var(--color-pelle--base);
  position: relative;
}

.fa-expand-arrows-alt, .fa-compress-arrows-alt {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
}

.l-pelle-panel-container {
  padding: 1rem;
  margin: 1rem;
  border: 2px solid var(--color-pelle--base);
  border-radius: 5px;
  user-select: none;
  background-color: #1a1a1a;
  color: #888888;
}

.l-pelle-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-pelle-bar-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.c-pelle-single-bar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 27rem;
}
</style>
