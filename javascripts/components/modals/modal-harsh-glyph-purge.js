"use strict";

Vue.component("modal-harsh-glyph-purge", {
  data() {
    return {
      glyphsDeleted: 0,
      glyphsTotal: 0,
    };
  },
  computed: {
    extraMessage() {
      this.getGlyphsThatWillBeDeleted();
      return `Harsh purging will delete ${this.glyphsDeleted}/${this.glyphsTotal} of your Glyphs.`;
    }
  },
  methods: {
    handleYesClick() {
      this.glyphsTotal = Glyphs.inventoryList.length;
      this.emitClose();
      for (let inventoryIndex = Glyphs.totalSlots - 1; inventoryIndex >= Glyphs.protectedSlots; --inventoryIndex) {
        const glyph = Glyphs.inventory[inventoryIndex];
        const isHarsh = true;
        if (glyph === null) continue;
        // Don't auto-clean custom glyphs (eg. music glyphs) unless it's harsh or delete all
        const isCustomGlyph = glyph.color !== undefined || glyph.symbol !== undefined;
        if (isCustomGlyph && !isHarsh) continue;
        // If the threshold for better glyphs needed is zero, the glyph is definitely getting deleted
        // no matter what (well, unless it can't be gotten rid of in current glyph removal mode).
        // Harsh purge is threshold 1.
        if (Glyphs.isObjectivelyUseless(glyph, 1)) {
          AutoGlyphProcessor.getRidOfGlyph(glyph);
        }
      }
      if (player.reality.autoCollapse) Glyphs.collapseEmptySlots();
      Modal.message.show(`Harsh purging deleted ${this.glyphsDeleted}/${this.glyphsTotal} 
      of your Glyphs.`);
    },
    getGlyphsThatWillBeDeleted() {
      // Basically handleYesClick() but without the actual deletion.
      this.glyphsTotal = Glyphs.inventoryList.length;
      for (let inventoryIndex = Glyphs.totalSlots - 1; inventoryIndex >= Glyphs.protectedSlots; --inventoryIndex) {
        const glyph = Glyphs.inventory[inventoryIndex];
        const isHarsh = true;
        if (glyph === null) continue;
        const isCustomGlyph = glyph.color !== undefined || glyph.symbol !== undefined;
        if (isCustomGlyph && !isHarsh) continue;
        if (Glyphs.isObjectivelyUseless(glyph, 1)) {
          this.glyphsDeleted++;
        }
      }
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
  <h2>You are about to harsh purge Glyphs</h2>
  <div class="c-modal-message__text">
  This could delete glyphs in your inventory that are good enough that you might want to use them
  later. Are you sure you want to do this? This process is irreversible!
  <br>
  Harsh purging deletes glyphs that are strictly worse than any other Glyph in your inventory. For example, 
  if there is a Glyph that has all better effects than another, the worse is deleted.
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
</div>
  `
});