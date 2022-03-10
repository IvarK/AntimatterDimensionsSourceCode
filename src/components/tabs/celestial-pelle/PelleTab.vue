<script>
import PelleBarPanel from "./PelleBarPanel";
import PelleUpgradePanel from "./PelleUpgradePanel";
import GalaxyGeneratorPanel from "./PelleGalaxyGeneratorPanel";

export default {
  name: "PelleTab",
  components: {
    PelleBarPanel,
    PelleUpgradePanel,
    GalaxyGeneratorPanel
  },
  data() {
    return {
      isDoomed: false,
      hasStrike: false,
      hasGalaxyGenerator: false,
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.hasStrike = PelleStrikes.all.some(s => s.hasStrike);
      this.hasGalaxyGenerator = PelleRifts.war.hasMilestone(2) || GalaxyGenerator.spentGalaxies > 0;
    },
    toggleBought() {
      Pelle.cel.showBought = !Pelle.cel.showBought;
      this.$recompute("upgrades");
    },
    getDoomedScrub() {
      Glyphs.harshAutoClean();
      if (Glyphs.freeInventorySpace === 0) {
        Modal.message.show(`Entering Doomed will unequip your Glyphs. Some of your
        Glyphs could not be unequipped due to lack of inventory space.`);
        return;
      }
      Glyphs.unequipAll();
      Glyphs.harshAutoClean();
      for (const type of BASIC_GLYPH_TYPES) Glyphs.addToInventory(GlyphGenerator.doomedGlyph(type));
      Glyphs.refreshActive();
      player.celestials.pelle.doomed = true;
      Pelle.armageddon(false);
      respecTimeStudies(true);
      Currency.infinityPoints.reset();
      player.infMult = 0;
      Autobuyer.bigCrunch.mode = AUTO_CRUNCH_MODE.AMOUNT;
      disChargeAll();
      player.buyUntil10 = true;
    },
    showModal() {
      Modal.pelleEffects.show();
    }
  }
};
</script>

<template>
  <div class="l-pelle-celestial-tab">
    <div v-if="isDoomed">
      <div class="button-container">
        <button
          class="o-pelle-button"
          @click="showModal"
        >
          Show effects in Doomed Reality
        </button>
      </div>
      <PelleUpgradePanel />
      <PelleBarPanel v-if="hasStrike" />
      <GalaxyGeneratorPanel v-if="hasGalaxyGenerator" />
    </div>
    <button
      v-else
      class="pelle-doom-button"
      @click="getDoomedScrub"
    >
      Doom<br>Your<br>Reality
      <div class="pelle-icon-container">
        <span class="pelle-icon">♅</span>
      </div>
    </button>
  </div>
</template>

<style scoped>
  .l-pelle-celestial-tab {
    display: flex;
    flex-direction: column;
    align-items: stretch;
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
</style>
