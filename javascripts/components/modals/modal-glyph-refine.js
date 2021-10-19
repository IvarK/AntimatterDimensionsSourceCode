"use strict";

Vue.component("modal-glyph-refine", {
  props: {
    modalConfig: Object
  },
  data() {
    return {
      resourceAmount: 0,
      resourceUnlocked: false,
      gain: 0,
      after: 0,
      cap: 0,
    };
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.modalConfig.idx);
    },
    resourceName() {
      return GlyphSacrificeHandler.glyphAlchemyResource(this.glyph).name;
    },
  },
  methods: {
    update() {
      this.resourceAmount = GlyphSacrificeHandler.glyphAlchemyResource(this.glyph).amount;
      this.resourceUnlocked = AlchemyResource[this.glyph.type].isUnlocked;
      this.gain = GlyphSacrificeHandler.glyphRefinementGain(this.glyph);
      this.cap = GlyphSacrificeHandler.levelAlchemyCap(this.glyph.level);

      this.after = this.resourceAmount + this.gain;

      const newGlyph = Glyphs.findByInventoryIndex(this.modalConfig.idx);
      if (this.glyph !== newGlyph) {
        this.emitClose();
        Modal.message.show("The selected Glyph changed position or was otherwise changed!");
      }
    },
    handleYesClick() {
      this.emitClose();
      GlyphSacrificeHandler.refineGlyph(this.glyph);
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to refine a Glyph</h2>
      <div v-if="resourceUnlocked" class="c-modal-message__text">
        Refining a Glyph will remove the Glyph from your inventory, and in return,
        you will increase your {{ resourceName }} Alchemy resource from
        {{ format(resourceAmount, 2, 2) }} to {{ format(after, 2, 2) }}.
        This Glyph can raise your {{ resourceName }} resource to at most {{ format(cap, 2, 2) }}.
      </div>
      <div v-else class="c-modal-message__text">
        You cannot gain any {{ resourceName }} Alchemy resource because you have not
        unlocked this Glyph's resource yet. You can still refine it anyway, but nothing
        will happen. Consider sacrificing the Glyph instead.
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
