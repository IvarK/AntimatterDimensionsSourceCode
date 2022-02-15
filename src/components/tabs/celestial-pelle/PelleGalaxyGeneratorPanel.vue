<script>
import PelleUpgrade from "./PelleUpgrade.vue";

export default {
  name: "GalaxyGeneratorPanel",
  components: {
    PelleUpgrade
  },
  data() {
    return {
      galaxies: 0,
      galaxiesPerSecond: 0,
      cap: 0,
      isCapped: false,
      capRift: null,
      sacrificeActive: false,
      isCollapsed: false,
    };
  },
  computed: {
    upgrades() {
      return PelleRebuyableUpgrade.galaxyGenerator;
    }
  },
  methods: {
    update() {
      this.galaxies = player.galaxies + GalaxyGenerator.galaxies;
      this.galaxiesPerSecond = GalaxyGenerator.gainPerSecond;
      this.cap = GalaxyGenerator.generationCap;
      this.isCapped = GalaxyGenerator.isCapped;
      this.capRift = GalaxyGenerator.capRift;
      this.sacrificeActive = GalaxyGenerator.sacrificeActive;
      this.isCollapsed = player.celestials.pelle.collapsed.galaxies;
    },
    increaseCap() {
      GalaxyGenerator.startSacrifice();
    },
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.galaxies = !this.isCollapsed;
    }
  },
};
</script>

<template>
  <div class="l-pelle-panel-container">
    <div class="c-pelle-panel-title">
      <i
        :class="collapseIcon()"
        @click="toggleCollapse"
      />
      Galaxy Generator
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      You have <span class="galaxies-amount">{{ format(galaxies, 2) }}</span> Galaxies.
      <span class="galaxies-amount">+{{ format(galaxiesPerSecond, 2, 1) }}</span>/s
      <br>
      You can generate a maximum of {{ format(cap) }} Galaxies.
      <div
        v-if="isCapped && capRift"
      >
        You have reached the generated Galaxy cap.<br>
        <button
          class="increase-cap"
          @click="increaseCap"
        >
          To increase the cap, you need to get rid of all that {{ capRift.name }}. <br><br>
          <span
            v-if="!sacrificeActive"
            class="big-text"
          >Sacrifice your {{ capRift.name }}</span>
          <span
            v-else
            class="big-text"
          >Getting rid of all that {{ capRift.name }}...</span>
        </button>
      </div>
      <div class="galaxy-generator-upgrades-container">
        <PelleUpgrade
          v-for="upgrade in upgrades"
          :key="upgrade.config.id"
          :upgrade="upgrade"
          :galaxy-generator="true"
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

  .galaxy-generator-upgrades-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .galaxies-amount {
    font-weight: bold;
    font-size: 2.5rem;
    background: linear-gradient(var(--color-pelle-secondary), var(--color-pelle--base));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .highlight {
    font-weight: bold;
    font-size: 2rem;
    color: var(--color-pelle--base);
  }

  .increase-cap {
    padding: 2rem;
    color: white;
    background: linear-gradient(black, var(--color-pelle--base));;
    border: 1px solid var(--color-pelle--base);
    border-radius: .5rem;
    font-family: Typewriter;
    cursor: pointer;
    margin: 1rem;
    font-size: 1.1rem;
  }

  .increase-cap:hover {
    box-shadow: 1px 1px 5px var(--color-pelle--base);
    transition-duration: 0.12s;
  }

  .big-text {
    font-size: 3rem;
    text-shadow: 2px 2px 2px black;
  }
</style>
