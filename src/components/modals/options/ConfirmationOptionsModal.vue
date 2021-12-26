<script>
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import OptionsWrapperModal from "@/components/modals/options/OptionsWrapperModal";

export default {
  name: "ConfirmationOptionsModal",
  components: {
    ModalOptionsToggleButton,
    OptionsWrapperModal,
  },
  data() {
    return {
      sacrifice: false,
      challenges: false,
      eternity: false,
      dilation: false,
      reality: false,
      resetReality: false,
      glyphReplace: false,
      glyphSacrifice: false,
      autoClean: false,
      glyphSelection: false,
      harshAutoClean: false,
      glyphUndo: false,
      resetCelestial: false,
      deleteGlyphSetSave: false,
      glyphRefine: false,
      bigCrunch: false,
      antimatterGalaxy: false,
      dimensionBoost: false,
      replicantiGalaxy: false,

      infinityUnlocked: false,
      eternityUnlocked: false,
      realityUnlocked: false,
      dilationUnlocked: false,
      realityAutobuyerUnlocked: false,
      sacrificeUnlocked: false,
      dimensionBoostUnlocked: false,
      antimatterGalaxyUnlocked: false,
      glyphSacrificeUnlocked: false,
      glyphUndoUnlocked: false,
      resetCelestialUnlocked: false,
      glyphSetSaveUnlocked: false,
      glyphRefineUnlocked: false,
      infinityBroken: false,
      replicantUnlocked: false,
    };
  },
  watch: {
    sacrifice(newValue) {
      player.options.confirmations.sacrifice = newValue;
    },
    challenges(newValue) {
      player.options.confirmations.challenges = newValue;
    },
    eternity(newValue) {
      player.options.confirmations.eternity = newValue;
    },
    dilation(newValue) {
      player.options.confirmations.dilation = newValue;
    },
    reality(newValue) {
      player.options.confirmations.reality = newValue;
    },
    resetReality(newValue) {
      player.options.confirmations.resetReality = newValue;
    },
    glyphReplace(newValue) {
      player.options.confirmations.glyphReplace = newValue;
    },
    glyphSacrifice(newValue) {
      player.options.confirmations.glyphSacrifice = newValue;
    },
    autoClean(newValue) {
      player.options.confirmations.autoClean = newValue;
    },
    glyphSelection(newValue) {
      player.options.confirmations.glyphSelection = newValue;
    },
    harshAutoClean(newValue) {
      player.options.confirmations.harshAutoClean = newValue;
    },
    glyphUndo(newValue) {
      player.options.confirmations.glyphUndo = newValue;
    },
    resetCelestial(newValue) {
      player.options.confirmations.resetCelestial = newValue;
    },
    deleteGlyphSetSave(newValue) {
      player.options.confirmations.deleteGlyphSetSave = newValue;
    },
    glyphRefine(newValue) {
      player.options.confirmations.glyphRefine = newValue;
    },
    bigCrunch(newValue) {
      player.options.confirmations.bigCrunch = newValue;
    },
    replicantiGalaxy(newValue) {
      player.options.confirmations.replicantiGalaxy = newValue;
    },
    antimatterGalaxy(newValue) {
      player.options.confirmations.antimatterGalaxy = newValue;
    },
    dimensionBoost(newValue) {
      player.options.confirmations.dimensionBoost = newValue;
    }
  },
  methods: {
    update() {
      const options = player.options.confirmations;
      this.sacrifice = options.sacrifice;
      this.challenges = options.challenges;
      this.eternity = options.eternity;
      this.dilation = options.dilation;
      this.reality = options.reality;
      this.resetReality = options.resetReality;
      this.glyphReplace = options.glyphReplace;
      this.glyphSacrifice = options.glyphSacrifice;
      this.autoClean = options.autoClean;
      this.glyphSelection = options.glyphSelection;
      this.harshAutoClean = options.harshAutoClean;
      this.glyphUndo = options.glyphUndo;
      this.resetCelestial = options.resetCelestial;
      this.deleteGlyphSetSave = options.deleteGlyphSetSave;
      this.glyphRefine = options.glyphRefine;
      this.bigCrunch = options.bigCrunch;
      this.antimatterGalaxy = options.antimatterGalaxy;
      this.dimensionBoost = options.dimensionBoost;
      this.replicantiGalaxy = options.replicantiGalaxy;


      const progress = PlayerProgress.current;
      this.infinityUnlocked = progress.isInfinityUnlocked;
      this.eternityUnlocked = progress.isEternityUnlocked;
      this.realityUnlocked = progress.isRealityUnlocked;
      this.dilationUnlocked = progress.isRealityUnlocked || !Currency.tachyonParticles.eq(0);
      this.realityAutobuyerUnlocked = Autobuyer.reality.isUnlocked;
      this.sacrificeUnlocked = Sacrifice.isVisible;
      this.antimatterGalaxyUnlocked = player.galaxies > 0 || this.infinityUnlocked;
      this.dimensionBoostUnlocked = player.dimensionBoosts > 0 || this.antimatterGalaxyUnlocked;
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.glyphUndoUnlocked = Teresa.has(TERESA_UNLOCKS.UNDO);
      this.resetCelestialUnlocked = Teresa.has(TERESA_UNLOCKS.RUN);
      this.glyphSetSaveUnlocked = EffarigUnlock.setSaves.isUnlocked;
      this.glyphRefineUnlocked = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
      this.infinityBroken = player.break;
      this.replicantiUnlocked = PlayerProgress.eternityUnlocked() || player.replicanti.unl;
    }
  },
};
</script>

<template>
  <OptionsWrapperModal
    class="c-modal-options__large"
    @close="emitClose"
  >
    <div class="c-modal-options__button-container">
      <span v-if="!dimensionBoostUnlocked">
        You do not have anything that requires confirmation,
        but if you did it would appear here.
      </span>
      <ModalOptionsToggleButton
        v-if="dimensionBoostUnlocked"
        v-model="dimensionBoost"
        text="Dimension Boost:"
      />
      <ModalOptionsToggleButton
        v-if="antimatterGalaxyUnlocked"
        v-model="antimatterGalaxy"
        text="Antimatter Galaxy:"
      />
      <ModalOptionsToggleButton
        v-if="sacrificeUnlocked"
        v-model="sacrifice"
        text="Sacrifice:"
      />
      <ModalOptionsToggleButton
        v-if="infinityUnlocked"
        v-model="challenges"
        text="Challenges:"
      />
      <ModalOptionsToggleButton
        v-if="infinityBroken"
        v-model="bigCrunch"
        text="Big Crunch:"
      />
      <ModalOptionsToggleButton
        v-if="replicantiUnlocked"
        v-model="replicantiGalaxy"
        text="Replicanti Galaxy:"
      />
      <ModalOptionsToggleButton
        v-if="eternityUnlocked"
        v-model="eternity"
        text="Eternity:"
      />
      <ModalOptionsToggleButton
        v-if="dilationUnlocked"
        v-model="dilation"
        text="Dilation:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="reality"
        text="Reality:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="resetReality"
        text="Reset Reality:"
      />
      <ModalOptionsToggleButton
        v-if="realityUnlocked"
        v-model="glyphReplace"
        text="Glyph replace:"
      />
      <ModalOptionsToggleButton
        v-if="glyphSacrificeUnlocked"
        v-model="glyphSacrifice"
        text="Glyph Sacrifice:"
      />
      <ModalOptionsToggleButton
        v-if="glyphSacrificeUnlocked"
        v-model="autoClean"
        text="Glyph Purge:"
      />
      <ModalOptionsToggleButton
        v-if="realityAutobuyerUnlocked"
        v-model="glyphSelection"
        text="Glyph Selection:"
      />
      <ModalOptionsToggleButton
        v-if="glyphUndoUnlocked"
        v-model="glyphUndo"
        text="Glyph undo:"
      />
      <ModalOptionsToggleButton
        v-if="resetCelestialUnlocked"
        v-model="resetCelestial"
        text="Reset Celestial:"
      />
      <ModalOptionsToggleButton
        v-if="glyphSetSaveUnlocked"
        v-model="deleteGlyphSetSave"
        text="Delete Glyph Set Save:"
      />
      <ModalOptionsToggleButton
        v-if="glyphRefineUnlocked"
        v-model="glyphRefine"
        text="Glyph refine:"
      />
    </div>
  </OptionsWrapperModal>
</template>
