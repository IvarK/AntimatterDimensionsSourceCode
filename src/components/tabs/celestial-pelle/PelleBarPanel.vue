<script>
import PelleStrike from "./PelleStrike.vue";

export default {
  name: "PelleBarPanel",
  components: {
    PelleStrike,
  },
  data() {
    return {
      compact: false,
      isCollapsed: false,
    };
  },
  computed: {
    strikes: () => PelleStrikes.all.filter(s => s.hasStrike),
  },
  methods: {
    update() {
      this.compact = Pelle.cel.compact;
      this.isCollapsed = player.celestials.pelle.collapsed.rifts;
    },
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
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
        :class="collapseIcon()"
        @click="toggleCollapse"
      />
      Pelle Strikes and Rifts
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      When active, Rifts consume {{ formatPercents(0.03) }} of another resource per second.
      <br>
      Rift effects are based on the total amount of resource drained.
      <div class="c-pelle-bar-container">
        <PelleStrike
          v-for="strike in strikes"
          :key="strike.config.id"
          :strike="strike"
          :compact="compact"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .c-pelle-panel-title {
    font-weight: bold;
    font-size: 3rem;
    color: var(--color-pelle--base);
  }

  .l-pelle-panel-container {
    width: 140rem;
    padding: 1rem;
    margin: 1rem;
    border: 2px solid var(--color-pelle--base);
    border-radius: 5px;
    user-select: none;
  }

  .l-pelle-content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .c-pelle-bar-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 125rem;
  }
</style>
