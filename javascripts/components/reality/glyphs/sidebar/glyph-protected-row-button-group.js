"use strict";

Vue.component("glyph-protected-row-button-group", {
  data() {
    return {
      protectedRows: 0,
    };
  },
  computed: {
    questionmarkTooltip() {
      return `Protected slots are unaffected by anything which may move or delete Glyphs.
        New Glyphs will never be inserted into these slots.`;
    }
  },
  methods: {
    update() {
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
      Protected Slots: ({{ format(protectedRows, 2) }} {{ "row" | pluralize(protectedRows, "rows") }})
      <br>
      <button
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="One row is permanently un-protected for new glyphs"
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
    </div>`
});
