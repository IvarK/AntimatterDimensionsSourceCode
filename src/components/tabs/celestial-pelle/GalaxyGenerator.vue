<script>
import PelleUpgrade from "./PelleUpgrade.vue";
export default {
  components: { PelleUpgrade },
  data() {
    return {
      galaxies: 0,
      galaxiesPerSecond: 0,
      cap: 0,
      isCapped: false,
      capRift: null,
      sacrificeActive: false,
    };
  },
  methods: {
    update() {
      this.galaxies = player.galaxies + GalaxyGenerator.galaxies;
      this.galaxiesPerSecond = GalaxyGenerator.gainPerSecond;
      this.cap = GalaxyGenerator.generationCap;
      this.isCapped = GalaxyGenerator.isCapped;
      this.capRift = GalaxyGenerator.capRift;
      this.sacrificeActive = GalaxyGenerator.sacrificeActive;
    },
    increaseCap() {
      GalaxyGenerator.startSacrifice();
    }
  },
  computed: {
    upgrades() {
      return PelleRebuyableUpgrade.galaxyGenerator;
    }
  },
};
</script>

<template>
  <div>
    You have <span class="galaxies-amount">{{ format(galaxies, 2) }}</span> Galaxies <br>
    <span class="galaxies-amount">{{ format(galaxiesPerSecond, 2, 1) }}</span>/s
    <div
      v-if="isCapped && capRift"
    >
      You have reached your cap of <span class="highlight">{{ format(cap) }}</span> generated Galaxies.<br>
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
</template>

<style scoped>
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