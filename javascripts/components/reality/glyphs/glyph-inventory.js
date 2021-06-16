"use strict";

Vue.component("glyph-inventory", {
  data() {
    return {
      inventory: [],
      doubleClickTimeOut: null,
      clickedGlyphId: null,
      glyphSacrificeUnlocked: false,
      protectedRows: 0,
    };
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  computed: {
    rowCount: () => Glyphs.totalSlots / 10,
    colCount: () => 10,
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.protectedRows = player.reality.glyphs.protectedRows;
    },
    toIndex(row, col) {
      return (row - 1) * this.colCount + (col - 1);
    },
    allowDrag(event) {
      if (event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) event.preventDefault();
    },
    drop(idx, event) {
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      Glyphs.moveToSlot(glyph, idx);
    },
    removeGlyph(id, force) {
      GlyphSacrificeHandler.removeGlyph(Glyphs.findById(id), force);
    },
    clickGlyph(col, id) {
      const glyph = Glyphs.findById(id);
      // If single click
      if (!this.doubleClickTimeOut) {
        this.doubleClickTimeOut = setTimeout(() => {
          this.clickedGlyphId = null;
          this.doubleClickTimeOut = null;
        }, 200);
        this.clickedGlyphId = id;
        if (!glyph) return;
        if (glyph.symbol === "key266b") {
          new Audio(`audio/note${col}.mp3`).play();
        }
      // Else it's double click, so equip a glyph
      } else if (this.clickedGlyphId === id) {
        clearTimeout(this.doubleClickTimeOut);
        this.doubleClickTimeOut = null;
        const idx = Glyphs.active.indexOf(null);
        if (idx !== -1) Glyphs.equip(glyph, idx);
      }
    },
    glyphsChanged() {
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
    },
    slotClass(index) {
      return index < Glyphs.protectedSlots ? "c-glyph-inventory__protected-slot" : "c-glyph-inventory__slot";
    }
  },
  template: `
    <div class="l-glyph-inventory">
      Click and drag or double-click to equip Glyphs.
      <br>
      The top {{ format(protectedRows, 2, 0) }} {{ "row" | pluralize(protectedRows, "rows") }}
      of slots are protected slots and are unaffected by anything which
      <br>
      may move or delete Glyphs. New Glyphs will never be inserted into these slots.
      <glyph-protected-row-options />
      <glyph-sort-options />
      <div
        v-for="row in rowCount"
        class="l-glyph-inventory__row"
        :key="protectedRows + row"
      >
        <div
          v-for="col in colCount"
          class="l-glyph-inventory__slot"
          :class="slotClass(toIndex(row, col))"
          @dragover="allowDrag"
          @drop="drop(toIndex(row, col), $event)"
        >
          <glyph-component
            v-if="inventory[toIndex(row, col)]"
            :glyph="inventory[toIndex(row, col)]"
            :showSacrifice="glyphSacrificeUnlocked"
            :draggable="true"
            @shiftClicked="removeGlyph($event, false)"
            @ctrlShiftClicked="removeGlyph($event, true)"
            @clicked="clickGlyph(col, $event)"
          />
        </div>
      </div>
    </div>`
});

Vue.component("glyph-protected-row-options", {
  methods: {
    update() {
      this.showScoreFilter = EffarigUnlock.glyphFilter.isUnlocked;
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
