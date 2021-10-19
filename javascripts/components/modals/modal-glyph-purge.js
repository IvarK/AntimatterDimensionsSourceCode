"use strict";

Vue.component("modal-glyph-purge", {
  props: { modalConfig: Object },
  data() {
    return {
      glyphsDeleted: 0,
    };
  },
  computed: {
    glyphsTotal() { return Glyphs.inventory.filter(thing => thing !== null).length; },
    harsh() { return this.modalConfig.harsh; },
    extraMessage() {
      this.handleDeletion(false);
      return `${this.whichType} will delete ${this.glyphsDeleted}/${this.glyphsTotal} of your Glyphs.`;
    },
    explanation() {
      if (this.harsh) return `Harsh Purging deletes Glyphs that are strictly worse than any other Glyph in your
      inventory. For example, if there is a Glyph that has all better effects than another, the worse is deleted.`;
      return `Purging deletes Glyphs that are worse than enough other Glyphs. Instead of keeping one good Glyph,
      like Harsh Purge, it keeps five.`;
    },
    whichType() {
      return this.harsh ? `Harsh Purging` : `Purging`;
    },
    topLabel() {
      return `You are about to ${this.harsh ? `Harsh Purge` : `Purge`} your Glyphs`;
    },
  },
  methods: {
    handleDeletion(deleteGlyphs) {
      for (let inventoryIndex = Glyphs.totalSlots - 1; inventoryIndex >= Glyphs.protectedSlots; --inventoryIndex) {
        const glyph = Glyphs.inventory[inventoryIndex];
        const threshold = this.harsh ? 1 : 5;
        if (glyph === null) continue;
        // Don't auto-clean custom glyphs (eg. music glyphs) unless it's harsh or delete all
        const isCustomGlyph = glyph.color !== undefined || glyph.symbol !== undefined;
        if (isCustomGlyph && !this.harsh) continue;
        // If the threshold for better glyphs needed is zero, the glyph is definitely getting deleted
        // no matter what (well, unless it can't be gotten rid of in current glyph removal mode).
        // Harsh purge is threshold 1.
        if (Glyphs.isObjectivelyUseless(glyph, threshold)) {
          if (deleteGlyphs) AutoGlyphProcessor.getRidOfGlyph(glyph);
          else this.glyphsDeleted++;
        }
      }
    },
    handleYesClick() {
      this.glyphsTotal = Glyphs.inventoryList.length;
      this.emitClose();
      this.handleDeletion(true);
      if (player.reality.autoCollapse) Glyphs.collapseEmptySlots();
      Modal.message.show(`${this.whichType} deleted ${this.glyphsDeleted}/${this.glyphsTotal} 
      of your Glyphs.`);
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>{{ topLabel }}</h2>
      <div class="c-modal-message__text">
        This could delete Glyphs in your inventory that are good enough that you might want to use them
        later. Are you sure you want to do this? This process is irreversible! Purging will Purge Glyphs based on your
        Purge mode.
        <br>
        {{ explanation }}
      </div>
      <br>
      <div class="c-modal-hard-reset-danger">
        {{ extraMessage }}
      </div>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >
          Cancel
        </primary-button>
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Confirm
        </primary-button>
      </div>
    </div>`
});