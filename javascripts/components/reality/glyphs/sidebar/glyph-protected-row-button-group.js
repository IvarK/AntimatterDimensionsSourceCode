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
      <div class="c-glyph-sacrifice-options__option--active o-questionmark" :ach-tooltip="questionmarkTooltip">?</div>
      Protected Slots: ({{ "row" | quantifyInt(protectedRows) }})
      <br>
      <button
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="One row is permanently un-protected for new Glyphs"
        @click="addRow"
      >
        Add a protected row
      </button>
      <button
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        @click="removeRow"
      >
        Remove a protected row
      </button>
      <primary-button-on-off
        v-model="moveGlyphs"
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        text="Move Glyphs on changing row count:"
      />
    </div>`
});
