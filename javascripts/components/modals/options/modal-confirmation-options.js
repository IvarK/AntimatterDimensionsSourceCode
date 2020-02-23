"use strict";

Vue.component("modal-confirmation-options", {
  mixins: [modalOptionsMixin],
  data() {
    return {
      sacrifice: false,
      challenges: false,
      eternity: false,
      dilation: false,
      reality: false,
      glyphReplace: false,
      glyphTrash: false,
      glyphSacrifice: false,
      glyphSacrificeUnlocked: false,
      glyphUndo: false,
      glyphUndoUnlocked: false,
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
    glyphReplace(newValue) {
      player.options.confirmations.glyphReplace = newValue;
    },
    glyphTrash(newValue) {
      player.options.confirmations.glyphTrash = newValue;
    },
    glyphSacrifice(newValue) {
      player.options.confirmations.glyphSacrifice = newValue;
    },
    glyphUndo(newValue) {
      player.options.confirmations.glyphUndo = newValue;
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
      this.glyphReplace = options.glyphReplace;
      this.glyphUndo = options.glyphUndo;
      this.glyphTrash = options.glyphTrash;
      this.glyphSacrifice = options.glyphSacrifice;
      this.glyphSacrificeUnlocked = canSacrifice();
      this.glyphUndoUnlocked = Teresa.has(TERESA_UNLOCKS.UNDO);
    }
  },
  template:
    `<modal-options @close="emitClose">
      <on-off-button v-model="sacrifice" text="Sacrifice:"/>
      <on-off-button v-if="infinityUnlocked" v-model="challenges" text="Challenges:"/>
      <on-off-button v-if="eternityUnlocked" v-model="eternity" text="Eternity:"/>
      <on-off-button v-if="dilationUnlocked" v-model="dilation" text="Dilation:"/>
      <on-off-button v-if="realityUnlocked" v-model="reality" text="Reality:"/>
      <on-off-button v-if="realityUnlocked" v-model="glyphReplace" text="Glyph replace:"/>
      <on-off-button v-if="realityUnlocked" v-model="glyphTrash" text="Glyph trash:"/>
      <on-off-button v-if="glyphSacrificeUnlocked" v-model="glyphSacrifice" text="Glyph sacrifice:"/>
      <on-off-button v-if="glyphUndoUnlocked" v-model="glyphUndo" text="Glyph undo:"/>
    </modal-options>`
});
