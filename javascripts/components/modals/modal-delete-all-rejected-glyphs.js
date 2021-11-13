"use strict";

Vue.component("modal-delete-all-rejected-glyphs", {
  data() {
    return {
      glyphsTotal: Number,
      glyphsDeleted: Number,
    };
  },
  computed: {
    refiningOrSacrificing() {
      if (GlyphSacrificeHandler.isRefining) return `Refine`;
      return `Sacrifice`;
    },
    topLabel() {
      return `You are about to ${this.refiningOrSacrificing} all rejected Glyphs`;
    },
    message() {
      return `Are you sure you want to ${this.refiningOrSacrificing} all rejected Glyphs? This will remove
      all Glyphs that would be rejected by your new Glyph Filter settings that were previously not removed.
      This process is irreversible!`;
    },
    extraMessage() {
      return `This process will remove ${this.glyphsDeleted}/${this.glyphsTotal} Glyphs.`;
    }
  },
  methods: {
    update() {
      this.glyphsTotal = Glyphs.inventory.filter(slot => slot !== null).length;
      this.glyphsDeleted = Glyphs.deleteAllRejected(false);
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.deleteAllRejected(true);
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
    <h2>{{ topLabel }}</h2>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
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