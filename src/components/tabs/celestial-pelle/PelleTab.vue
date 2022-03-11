<script>
import ArmageddonButton from "./ArmageddonButton";
import PelleBarPanel from "./PelleBarPanel";
import PelleUpgradePanel from "./PelleUpgradePanel";
import GalaxyGeneratorPanel from "./PelleGalaxyGeneratorPanel";
import RemnantGainFactor from "./RemnantGainFactor";
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";

export default {
  name: "PelleTab",
  components: {
    ArmageddonButton,
    PelleBarPanel,
    PelleUpgradePanel,
    GalaxyGeneratorPanel,
    RemnantGainFactor,
    CelestialQuoteHistory
  },
  data() {
    return {
      isDoomed: false,
      canEnterPelle: false,
      completedRows: 0,
      remnants: 0,
      realityShards: new Decimal(0),
      shardRate: new Decimal(0),
      hasStrike: false,
      hasGalaxyGenerator: false,
      remnantsGain: 0,
      realityShardGain: new Decimal(0),
      isHovering: false
    };
  },
  computed: {
    symbol() {
      return Pelle.symbol;
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      if (!this.isDoomed) {
        this.canEnterPelle = Achievements.prePelle.every(a => a.isUnlocked);
        this.completedRows = Achievements.prePelleRows.countWhere(r => r.every(a => a.isUnlocked));
      }
      this.remnants = Pelle.cel.remnants;
      this.realityShards.copyFrom(Pelle.cel.realityShards);
      this.shardRate.copyFrom(Pelle.realityShardGainPerSecond);
      this.hasStrike = PelleStrikes.all.some(s => s.hasStrike);
      this.hasGalaxyGenerator = PelleRifts.war.milestones[2].canBeApplied || GalaxyGenerator.spentGalaxies > 0;
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
      <CelestialQuoteHistory
        celestial="pelle"
        :visible-lines="4"
        font-size="1.6rem"
        line-height="2.56rem"
      />
      <div class="button-container">
        <button
          class="o-pelle-button"
          @click="showModal"
        >
          Show effects in Doomed Reality
        </button>
      </div>
      <br>
      <div class="c-armageddon-container">
        <div>
          <div
            class="c-armageddon-button-container"
            @mouseover="isHovering = true"
            @mouseleave="isHovering = false"
          >
            <ArmageddonButton />
          </div>
          <RemnantGainFactor />
        </div>
        <div class="c-armageddon-resources-container">
          <div>
            You have <span class="c-remnants-amount">{{ format(remnants, 2) }}</span> Remnants.
          </div>
          <div>
            You have <span class="c-remnants-amount">{{ format(realityShards, 2) }}</span> Reality Shards.
            <span class="c-remnants-amount">(+{{ format(shardRate, 2, 2) }}/s)</span>
          </div>
        </div>
      </div>
      <GalaxyGeneratorPanel v-if="hasGalaxyGenerator" />
      <PelleBarPanel v-if="hasStrike" />
      <PelleUpgradePanel :is-hovering="isHovering" />
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
      You must have 17 rows of achievements to unlock Doomed.
      <br>
      {{ completedRows }} / 17
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
  align-items: stretch;
  width: 100%;
}

.o-pelle-button {
  background: black;
  color: white;
  border: 1px solid var(--color-pelle--base);
  border-radius: 5px;
  padding: 1rem;
  font-family: Typewriter;
  margin: 0 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition-duration: 0.12s;
}

.o-pelle-button:hover {
  box-shadow: 1px 1px 3px var(--color-pelle--base);
}

.o-pelle-quotes-button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-pelle--base);
  font-size: 5rem;
  height: 7rem;
  width: 7rem;
  font-weight: 900;
}

.pelle-unlock-requirements {
  font-size: 3rem;
  background: black;
  color: var(--color-pelle--base);
  border: 0.2rem solid var(--color-pelle--base);
  border-radius: 0.5rem;
  width: 40rem;
}

.pelle-doom-button {
  font-family: Typewriter;
  padding: 1rem;
  background: black;
  color: var(--color-pelle--base);
  font-size: 3rem;
  border: 2px solid var(--color-pelle--base);
  border-radius: 5px;
  width: 20rem;
  cursor: pointer;
  transition-duration: 0.4s;
  align-self: center;
}

.pelle-doom-button:hover {
  box-shadow: 0px 0px 20px var(--color-pelle--base);
}

.pelle-icon-container {
  background: white;
  border-radius: 50%;
  height: 15rem;
  width: 15rem;
  margin: auto;
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid var(--color-pelle--base);
  font-size: 10rem;
  transition-duration: 0.4s;
  text-shadow: 0px 0px 15px #9b0101;
  box-shadow: 0px 0px 15px #9b0101;
}

.pelle-doom-button:hover .pelle-icon-container {
  background: black;
  color: var(--color-pelle--base);
}

@keyframes roll {
  100% { transform: rotateY(360deg) }
}

.pelle-icon {
  animation: roll infinite 8s linear;
}

.o-celestial-quote-history {
  align-self: center;
}

.c-armageddon-container {
  align-self: center;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: 0.5rem;
  border: 0.2rem solid var(--color-pelle--base);
  padding: 1rem;
  background-color: #1a1a1a;
  color: #888888;
}

.c-armageddon-button-container {
  width: 32rem;
  margin-bottom: 0.5rem;
}

.c-armageddon-resources-container {
  width: 41.5rem;
}

.c-remnants-amount {
  font-weight: bold;
  font-size: 2rem;
  color: var(--color-pelle--base);
}
</style>

<style>
.s-base--metro .l-pelle-panel-container, .s-base--metro .c-armageddon-container {
  border-radius: 0;
}

.s-base--metro .o-pelle-button {
  border-radius: 0;
}
</style>
