<script>
import PelleUpgrade from "./PelleUpgrade";

export default {
  name: "GalaxyGeneratorPanel",
  components: {
    PelleUpgrade
  },
  data() {
    return {
      isUnlocked: false,
      galaxies: 0,
      generatedGalaxies: 0,
      galaxiesPerSecond: 0,
      cap: 0,
      isCapped: false,
      capRift: null,
      sacrificeActive: false,
      isCollapsed: false,
      barWidth: 0
    };
  },
  computed: {
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    },
    upgrades() {
      return GalaxyGeneratorUpgrades.all;
    },
    galaxyText() {
      let text = format(Math.max(this.galaxies, 0), 2);
      if (this.galaxies < 0) text += ` [${format(this.galaxies, 2)}]`;
      return text;
    }
  },
  methods: {
    update() {
      this.isUnlocked = Pelle.hasGalaxyGenerator;
      this.isCapped = GalaxyGenerator.isCapped;
      this.isCollapsed = player.celestials.pelle.collapsed.galaxies && !this.isCapped;
      if (this.isCollapsed || !this.isUnlocked) return;
      this.galaxies = player.galaxies + GalaxyGenerator.galaxies;
      this.generatedGalaxies = GalaxyGenerator.generatedGalaxies;
      this.galaxiesPerSecond = GalaxyGenerator.gainPerSecond;
      this.cap = GalaxyGenerator.generationCap;
      this.capRift = GalaxyGenerator.capRift;
      this.sacrificeActive = GalaxyGenerator.sacrificeActive;
      this.barWidth = (this.isCapped ? this.capRift.reducedTo : this.generatedGalaxies / this.cap);
    },
    increaseCap() {
      GalaxyGenerator.startSacrifice();
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.galaxies = !this.isCollapsed;
    },
    unlock() {
      player.celestials.pelle.galaxyGenerator.unlocked = true;
      Pelle.quotes.show(Pelle.quotes.GALAXY_GENERATOR_UNLOCK);
    }
  },
};
</script>

<template>
  <div class="l-pelle-panel-container">
    <div class="c-pelle-panel-title">
      <i
        :class="collapseIcon"
        @click="toggleCollapse"
      />
      Galaxy Generator
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      <div v-if="isUnlocked">
        <div>
          You have a total of
          <span class="c-galaxies-amount">{{ galaxyText }}</span>
          Galaxies.
          <span class="c-galaxies-amount">+{{ format(galaxiesPerSecond, 2, 1) }}/s</span>
        </div>
        <div>
          <button
            class="c-increase-cap"
            :class="{
              'c-increase-cap-available': isCapped && capRift,
              'tutorial--glow': cap === Infinity
            }"
            @click="increaseCap"
          >
            <div
              class="c-increase-cap-background"
              :style="{ 'width': `${barWidth * 100}%` }"
            />
            <div
              v-if="isCapped && capRift"
              class="c-increase-cap-text"
            >
              To generate more Galaxies, you need to get rid of all that {{ capRift.name }}. <br><br>
              <span
                v-if="!sacrificeActive"
                class="c-big-text"
              >
                Sacrifice your {{ capRift.name }}
              </span>
              <span
                v-else
                class="c-big-text"
              >
                Getting rid of all that {{ capRift.name }}...
              </span>
            </div>
            <div
              v-else
              class="c-increase-cap-text c-medium-text"
            >
              {{ format(generatedGalaxies, 2) }} / {{ format(cap, 2) }} Galaxies generated
            </div>
          </button>
        </div>
        <div class="l-galaxy-generator-upgrades-container">
          <PelleUpgrade
            v-for="upgrade in upgrades"
            :key="upgrade.config.id"
            :upgrade="upgrade"
            :galaxy-generator="true"
          />
        </div>
      </div>
      <button
        v-else
        class="c-generator-unlock-button"
        @click="unlock"
      >
        Unlock the Galaxy Generator
      </button>
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

.c-generator-unlock-button {
  padding: 2rem;
  border-radius: .5rem;
  font-family: Typewriter;
  cursor: pointer;
  width: 25rem;
  height: 10rem;
  font-size: 2rem;
  background: linear-gradient(var(--color-pelle-secondary), var(--color-pelle--base));
  color: black;
  font-weight: bold;
}

.l-galaxy-generator-upgrades-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.c-galaxies-amount {
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

.c-increase-cap {
  padding: 2rem;
  color: white;
  background-color: #004b55;
  border: 0.2rem solid var(--color-pelle--base);
  border-radius: .5rem;
  font-family: Typewriter;
  margin: 1rem;
  font-size: 1.1rem;
  position: relative;
  width: 100%;
  max-width: 70rem;
  height: 11.4rem;
  overflow: hidden;
  box-shadow: inset 0 0 1px 1px var(--color-pelle--base);
  /* box-shadow is here to prevent a weird grey border forming around the background */
}

.c-increase-cap:hover {
  box-shadow: inset 0 0 1px 1px var(--color-pelle--base), 1px 1px 5px var(--color-pelle--base);
  transition-duration: 0.12s;
}

.c-increase-cap-available {
  cursor: pointer;
}

.c-increase-cap-text {
  position: relative;
  z-index: 1;
}

.c-increase-cap-background {
  background: linear-gradient(black, var(--color-pelle--base));
  left: 0;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 0;
  transition: width 0.1s;
}

.c-big-text {
  font-size: 3rem;
  text-shadow: 2px 2px 2px black;
}
.c-medium-text {
  font-size: 2rem;
  text-shadow: 2px 2px 2px black;
}
</style>

<style>
.s-base--metro .c-increase-cap {
  border-radius: 0;
}
</style>