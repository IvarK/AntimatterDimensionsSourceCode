import { modalOptionsMixin } from "./modal-options.js";

Vue.component("modal-confirmation-options", {
  mixins: [modalOptionsMixin],
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
      glyphSelection: false,
      harshAutoClean: false,
      glyphUndo: false,
      resetCelestial: false,
      deleteGlyphSetSave: false,
      glyphRefine: false,

      realityAutobuyerUnlocked: false,
      sacrificeUnlocked: false,
      glyphSacrificeUnlocked: false,
      glyphUndoUnlocked: false,
      resetCelestialUnlocked: false,
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
      this.glyphSelection = options.glyphSelection;
      this.harshAutoClean = options.harshAutoClean;
      this.glyphUndo = options.glyphUndo;
      this.resetCelestial = options.resetCelestial;
      this.deleteGlyphSetSave = options.deleteGlyphSetSave;
      this.glyphRefine = options.glyphRefine;

      this.sacrificeUnlocked = PlayerProgress.infinityUnlocked() || player.dimensionBoosts >= 5 || player.galaxies > 0;
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.realityAutobuyerUnlocked = Autobuyer.reality.isUnlocked;
      this.glyphUndoUnlocked = Teresa.has(TERESA_UNLOCKS.UNDO);
      this.resetCelestialUnlocked = Teresa.has(TERESA_UNLOCKS.RUN);
      this.glyphSetSaveUnlocked = EffarigUnlock.setSaves.isUnlocked;
      this.glyphRefineUnlocked = Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY);
    }
  },
  template: `
    <modal-options @close="emitClose" style="width: 50rem">
      <div class="c-modal-options__button-container">
        <wide-on-off-button v-if="sacrificeUnlocked" v-model="sacrifice" text="Sacrifice:" />
        <wide-on-off-button v-if="infinityUnlocked" v-model="challenges" text="Challenges:" />
        <wide-on-off-button v-if="eternityUnlocked" v-model="eternity" text="Eternity:" />
        <wide-on-off-button v-if="dilationUnlocked" v-model="dilation" text="Dilation:" />
        <wide-on-off-button v-if="realityUnlocked" v-model="reality" text="Reality:" />
        <wide-on-off-button v-if="realityUnlocked" v-model="resetReality" text="Reset Reality:" />
        <wide-on-off-button v-if="realityUnlocked" v-model="glyphReplace" text="Glyph replace:" />
        <wide-on-off-button v-if="glyphSacrificeUnlocked" v-model="glyphSacrifice" text="Glyph Sacrifice:" />
        <wide-on-off-button v-if="glyphSacrificeUnlocked" v-model="harshAutoClean" text="Harsh auto clean:" />
        <wide-on-off-button v-if="realityAutobuyerUnlocked" v-model="glyphSelection" text="Glyph Selection:" />
        <wide-on-off-button v-if="glyphUndoUnlocked" v-model="glyphUndo" text="Glyph undo:" />
        <wide-on-off-button v-if="resetCelestialUnlocked" v-model="resetCelestial" text="Reset Celestial:" />
        <wide-on-off-button v-if="glyphSetSaveUnlocked" v-model="deleteGlyphSetSave" text="Delete Glyph Set Save:" />
        <wide-on-off-button v-if="glyphRefineUnlocked" v-model="glyphRefine" text="Glyph refine:" />
      </div>
    </modal-options>`
});
