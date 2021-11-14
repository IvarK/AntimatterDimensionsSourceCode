"use strict";

Vue.component("glyph-protected-row-button-group", {
  data() {
    return {
      protectedRows: 0,
      moveGlyphs: false,
    };
  },
  watch: {
    moveGlyphs(newValue) {
      player.reality.moveGlyphsOnProtection = newValue;
    },
  },
  computed: {
    questionmarkTooltip() {
      return `Protected slots are unaffected by anything which may move or purge Glyphs.
        New Glyphs will never be inserted into these slots.`;
    }
  },
  methods: {
    update() {
      this.moveGlyphs = player.reality.moveGlyphsOnProtection;
      this.protectedRows = player.reality.glyphs.protectedRows;
    },
    addRow() {
      Glyphs.changeProtectedRows(1);
    },
    removeRow() {
      Glyphs.changeProtectedRows(-1);
    }
  },
  template: `
    <div>
      <div class="l-glyph-sacrifice-options__header">
        <div class="o-questionmark" :ach-tooltip="questionmarkTooltip">?</div>
        Protected Slots: ({{ quantifyInt("row", protectedRows) }})
      </div>
      <button
        class="c-glyph-inventory-option"
        @click="addRow"
      >
        Add a protected row
        <div class="c-glyph-inventory-option__tooltip">One row is permanently un-protected for new Glyphs</div>
      </button>
      <button
        class="c-glyph-inventory-option"
        @click="removeRow"
      >
        Remove a protected row
      </button>
      <button-on-off
        v-model="moveGlyphs"
        class="c-glyph-inventory-option"
        text="Move Glyphs on changing row count:"
      />
    </div>`
});
