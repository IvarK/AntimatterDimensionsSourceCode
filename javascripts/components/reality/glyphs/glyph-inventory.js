Vue.component("glyph-inventory", {
  data: function () {
    return {
      inventory: [],
    };
  },
  computed: {
    rowCount: () => 10,
    colCount: () => 10,
  },
  created() {
    this.on$(GameEvent.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    toIndex(row, col) {
      return (row - 1) * this.colCount + (col - 1);
    },
    allowDrag(event) {
      if (event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) event.preventDefault();
    },
    drop(idx, event) {
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE));
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      Glyphs.moveToSlot(glyph, idx);
    },
    deleteGlyph(id, force) {
      deleteGlyph(id, force);
    },
    clickGlyph(col, id) {
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      if (glyph.symbol === "key266b") {
        let tempAudio = new Audio(`images/note${col}.mp3`);
        tempAudio.play();
      }
    },
    glyphsChanged() {
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
    },
    sort() {
      Glyphs.sort();
    }
  },
  template: /*html*/`
  <div class="l-glyph-inventory">
    <div v-for="row in rowCount" class="l-glyph-inventory__row">
      <div v-for="col in colCount"
           class="l-glyph-inventory__slot c-glyph-inventory__slot"
           @dragover="allowDrag"
           @drop="drop(toIndex(row, col), $event)">
        <glyph-component v-if="inventory[toIndex(row, col)]"
                         :glyph="inventory[toIndex(row, col)]"
                         :showSacrifice="true"
                         :draggable="true"
                         @shiftClicked="deleteGlyph($event, false)"
                         @ctrlShiftClicked="deleteGlyph($event, true)"
                         @clicked="clickGlyph(col, $event)"/>
      </div>
    </div>
    <button class="l-glyph-inventory__sort c-reality-upgrade"
            ach-tooltip="Sort by type and level * rarity"
            @click="sort">
      Sort
    </button>
  </div>
  `,
})