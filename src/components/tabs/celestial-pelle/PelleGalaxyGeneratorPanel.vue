<script>
import wordShift from "@/core/word-shift";

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
      barWidth: 0,
      capRiftName: "",
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
    },
    sacrificeText() {
      return this.capRift.galaxyGeneratorText.replace("$value", this.capRiftName);
    },
    emphasisedStart() {
      return Math.pow(this.generatedGalaxies / this.cap, 0.45);
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
      this.barWidth = (this.isCapped ? this.capRift.reducedTo : this.emphasisedStart);
      if (this.capRift) this.capRiftName = wordShift.wordCycle(this.capRift.name);
    },
    increaseCap() {
      if (GalaxyGenerator.isCapped) GalaxyGenerator.startSacrifice();
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.galaxies = !this.isCollapsed;
    },
    unlock() {
      player.celestials.pelle.galaxyGenerator.unlocked = true;
      Pelle.quotes.galaxyGeneratorUnlock.show();
    }
  },
};
</script>

<template>
  <div class="l-pelle-panel-container">
    <div class="c-pelle-panel-title">
      <i
        v-if="!isCapped"
        :class="collapseIcon"
        class="c-collapse-icon-clickable"
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
              'c-increase-cap-available': isCapped && capRift && !sacrificeActive,
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
              {{ sacrificeText }}. <br><br>
              <span
                v-if="!sacrificeActive"
                class="c-big-text"
              >
                Sacrifice your {{ capRiftName }}
              </span>
              <span
                v-else
                class="c-big-text"
              >
                Getting rid of all that {{ capRiftName }}...
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
.c-collapse-icon-clickable {
  position: absolute;
  top: 50%;
  left: 1.5rem;
  width: 3rem;
  align-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}

.c-generator-unlock-button {
  width: 25rem;
  height: 10rem;
  font-family: Typewriter;
  font-size: 2rem;
  font-weight: bold;
  color: black;
  background: linear-gradient(var(--color-pelle--secondary), var(--color-pelle--base));
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 2rem;
  cursor: pointer;
}

.l-galaxy-generator-upgrades-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.c-galaxies-amount {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(var(--color-pelle--secondary), var(--color-pelle--base));
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.highlight {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-pelle--base);
}

.c-increase-cap {
  overflow: hidden;
  width: 100%;
  height: 11.4rem;
  max-width: 70rem;
  position: relative;
  font-family: Typewriter;
  font-size: 1.1rem;
  color: var(--color-text);
  background-color: #c1eaf0;
  border: var(--var-border-width, 0.1rem) solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
  /* box-shadow is here to prevent a weird grey border forming around the background */
  box-shadow: inset 0 0 0.1rem 0.1rem var(--color-pelle--base);
  margin: 1rem;
  padding: 2rem;
}

.s-base--dark .c-increase-cap {
  background-color: #004b55;
}

.c-increase-cap:hover {
  box-shadow: inset 0 0 0.1rem 0.1rem var(--color-pelle--base), 0.1rem 0.1rem 0.5rem var(--color-pelle--base);
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
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background: linear-gradient(var(--color-text-inverted), var(--color-pelle--base));
  transition: width 0.1s;
}

.c-big-text {
  font-size: 2.5rem;
  text-shadow: 0.2rem 0.2rem 0.2rem #888888;
}

.s-base--dark .c-big-text {
  text-shadow: 0.2rem 0.2rem 0.2rem black;
}

.c-medium-text {
  font-size: 2rem;
  text-shadow: 0.2rem 0.2rem 0.2rem #888888;
}

.s-base--dark .c-medium-text {
  text-shadow: 0.2rem 0.2rem 0.2rem black;
}
</style>
