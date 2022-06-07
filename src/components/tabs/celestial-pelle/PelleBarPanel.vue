<script>
import PelleRift from "./PelleRift";

export default {
  name: "PelleBarPanel",
  components: {
    PelleRift
  },
  data() {
    return {
      decayRate: 0,
      isCollapsed: false,
      strikes: []
    };
  },
  computed: {
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    }
  },
  methods: {
    update() {
      this.decayRate = Pelle.riftDrainPercent;
      this.isCollapsed = player.celestials.pelle.collapsed.rifts;
      this.strikes = PelleStrikes.all.filter(s => s.hasStrike);
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
        class="c-collapse-icon-clickable"
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
          <PelleRift :strike="strike" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-pelle-panel-title {
  position: relative;
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-pelle--base);
}

.c-collapse-icon-clickable {
  position: absolute;
  top: 50%;
  left: 1.5rem;
  transform: translateY(-50%);
  cursor: pointer;
}

.l-pelle-panel-container {
  border: var(--var-border-width, 0.2rem) solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.2rem);
  margin: 1rem;
  padding: 1rem;
  -webkit-user-select: none;
  user-select: none;
}

.l-pelle-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-pelle-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-pelle-single-bar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
