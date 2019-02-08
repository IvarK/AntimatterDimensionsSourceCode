Vue.component("glyph-inventory", {
  data: function() {
    return {
      inventory: Glyphs.inventoryCopy,
    };
  },
  computed: {
    numRows() { return 10; },
    numCols() { return 10; },
  },
  methods: {
    toIndex(row, col) {
      return (row - 1) * this.numCols + (col - 1);
    },
    allowDrag(event) {
      if (event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) event.preventDefault();
    },
    drop(idx, event) {
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE));
      if (!id || isNaN(id)) return;
      const glyph = Glyphs.inventoryById(id);
      if (!glyph) return;
      Glyphs.moveToSlot(glyph, idx);
    },
    deleteGlyph(id, force) {
      deleteGlyph(id, force);
    },
    clickGlyph(col, id) {
      const glyph = Glyphs.inventoryById(id);
      if (!glyph) return;
      if (glyph.symbol === "key266b") {
        let tempAudio = new Audio(`images/note${col}.mp3`);
        tempAudio.play();
      }
    },
  },
  template: /*html*/`
  <div class="l-glyph-inventory">
    <div v-for="row in numRows" class="l-glyph-inventory__row">
      <div v-for="col in numCols" class="l-glyph-inventory__slot c-glyph-inventory__slot"
           @dragover="allowDrag" @drop="drop(toIndex(row, col), $event)">
        <glyph-component v-if="inventory[toIndex(row, col)]" :glyph="inventory[toIndex(row, col)]"
                         :showSacrifice="true" :draggable="true"
                         @shiftClicked="deleteGlyph($event, false)"
                         @ctrlShiftClicked="deleteGlyph($event, true)"
                         @clicked="clickGlyph(col, $event)"/>
      </div>
    </div>
  </div>
  `,
})