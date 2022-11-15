<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import GalaxyGeneratorPanel from "./PelleGalaxyGeneratorPanel";
import PelleBarPanel from "./PelleBarPanel";
import PelleUpgradePanel from "./PelleUpgradePanel";

export default {
  name: "PelleTab",
  components: {
    PelleBarPanel,
    PelleUpgradePanel,
    GalaxyGeneratorPanel,
    CelestialQuoteHistory
  },
  data() {
    return {
      isDoomed: false,
      canEnterPelle: false,
      completedRows: 0,
      cappedResources: 0,
      hasStrike: false,
      hasGalaxyGenerator: false
    };
  },
  computed: {
    symbol() {
      return Pelle.symbol;
    },
    totalRows() {
      return Achievements.prePelleRows.length;
    },
    totalAlchemyResources() {
      return AlchemyResources.all.length;
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      if (!this.isDoomed) {
        this.completedRows = Achievements.prePelleRows.countWhere(r => r.every(a => a.isUnlocked));
        this.cappedResources = AlchemyResources.all.countWhere(r => r.capped);
        this.canEnterPelle = this.completedRows === this.totalRows &&
          this.cappedResources === this.totalAlchemyResources;
      }
      this.hasStrike = PelleStrikes.all.some(s => s.hasStrike);
      this.hasGalaxyGenerator = PelleRifts.recursion.milestones[2].canBeApplied || GalaxyGenerator.spentGalaxies > 0;
    },
    toggleBought() {
      Pelle.cel.showBought = !Pelle.cel.showBought;
      this.$recompute("upgrades");
    },
    showModal() {
      Modal.pelleEffects.show();
    },
    enterDoomModal() {
      Modal.armageddon.show();
    }
  }
};
</script>

<template>
  <div class="l-pelle-celestial-tab">
    <div
      v-if="isDoomed"
      class="l-pelle-all-content-container"
    >
      <CelestialQuoteHistory celestial="pelle" />
      <div class="button-container">
        <button
          class="o-pelle-button"
          @click="showModal"
        >
          Show effects in Doomed Reality
        </button>
      </div>
      <br>
      <GalaxyGeneratorPanel v-if="hasGalaxyGenerator" />
      <PelleBarPanel v-if="hasStrike" />
      <PelleUpgradePanel />
    </div>
    <button
      v-else-if="canEnterPelle"
      class="pelle-doom-button"
      @click="enterDoomModal"
    >
      Doom<br>Your<br>Reality
      <div class="pelle-icon-container">
        <span class="pelle-icon">{{ symbol }}</span>
      </div>
    </button>
    <div
      v-else
      class="pelle-unlock-requirements"
    >
      You must have {{ formatInt(totalRows) }} rows of Achievements
      and all of your Glyph Alchemy Resources capped to unlock Pelle, Celestial of Antimatter.
      <br>
      <br>
      {{ formatInt(completedRows) }} / {{ formatInt(totalRows) }} Achievement rows completed
      <br>
      {{ formatInt(cappedResources) }} / {{ formatInt(totalAlchemyResources) }} capped Alchemy Resources
    </div>
  </div>
</template>

<style scoped>
.l-pelle-celestial-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.l-pelle-all-content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.o-pelle-button {
  font-family: Typewriter;
  color: var(--color-text);
  background: var(--color-text-inverted);
  border: 0.1rem solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
  margin-bottom: 1rem;
  padding: 1rem;
  transition-duration: 0.12s;
  cursor: pointer;
}

.o-pelle-button:hover {
  box-shadow: 0.1rem 0.1rem 0.3rem var(--color-pelle--base);
}

.o-pelle-quotes-button {
  display: flex;
  width: 7rem;
  height: 7rem;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  font-weight: 900;
  color: var(--color-pelle--base);
}

.pelle-unlock-requirements {
  width: 50rem;
  padding: 0.5rem;
  font-size: 2.4rem;
  color: var(--color-pelle--base);
  background: black;
  border: var(--var-border-width, 0.2rem) solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
}

.pelle-doom-button {
  width: 20rem;
  align-self: center;
  font-family: Typewriter;
  font-size: 3rem;
  color: var(--color-pelle--base);
  background: black;
  border: var(--var-border-width, 0.2rem) solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 1rem;
  transition-duration: 0.4s;
  cursor: pointer;
}

.pelle-doom-button:hover {
  box-shadow: 0 0 2rem var(--color-pelle--base);
}

.pelle-icon-container {
  display: flex;
  width: 15rem;
  height: 15rem;
  justify-content: center;
  align-items: center;
  font-size: 10rem;
  text-shadow: 0 0 1.5rem #9b0101;
  background: white;
  border: var(--var-border-width, 0.4rem) solid var(--color-pelle--base);
  border-radius: 50%;
  box-shadow: 0 0 1.5rem #9b0101;
  margin: auto;
  margin-top: 3rem;
  transition-duration: 0.4s;
}

.pelle-doom-button:hover .pelle-icon-container {
  color: var(--color-pelle--base);
  background: black;
}

@keyframes a-roll {
  100% { transform: rotateY(360deg); }
}

.pelle-icon {
  animation: a-roll infinite 8s linear;
}
</style>
