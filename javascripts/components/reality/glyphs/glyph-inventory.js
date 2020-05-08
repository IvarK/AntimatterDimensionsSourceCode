"use strict";

Vue.component("glyph-inventory", {
  data() {
    return {
      inventory: [],
      showScoreFilter: false,
      doubleClickTimeOut: null,
      clickedGlyphId: null,
      showAutoAutoClean: false,
      isAutoAutoCleanOn: false,
      glyphSacrificeUnlocked: false,
      hasPerkShop: false,
    };
  },
  computed: {
    rowCount: () => Glyphs.totalSlots / 10,
    colCount: () => 10,
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  watch: {
    isAutoAutoCleanOn(newValue) {
      player.reality.autoAutoClean = newValue;
    }
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.hasPerkShop = Teresa.has(TERESA_UNLOCKS.SHOP);
      this.showScoreFilter = EffarigUnlock.basicFilter.isUnlocked;
      this.showAutoAutoClean = V.has(V_UNLOCKS.AUTO_AUTOCLEAN);
      this.isAutoAutoCleanOn = player.reality.autoAutoClean;
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
    sortByPower() {
      Glyphs.sort((a, b) => -a.level * a.strength + b.level * b.strength);
    },
    sortByScore() {
      Glyphs.sort((a, b) => -AutoGlyphProcessor.filterValue(a) + AutoGlyphProcessor.filterValue(b));
    },
    sortByEffect() {
      function reverseBitstring(eff) {
        // eslint-disable-next-line no-bitwise
        return parseInt(((1 << 30) + (eff >>> 0)).toString(2).split("").reverse().join(""), 2);
      }
      // The bitwise reversal is so that the effects with the LOWER id are valued higher in the sorting.
      // This primarily meant for effarig glyph effect sorting, which makes it prioritize timespeed pow highest.
      Glyphs.sort((a, b) => -reverseBitstring(a.effects) + reverseBitstring(b.effects));
    },
    autoClean() {
      Glyphs.autoClean();
    },
    harshAutoClean() {
      Glyphs.harshAutoClean();
    },
    deleteAllUnprotected() {
      Glyphs.deleteAllUnprotected();
    },
    slotClass(index) {
      return index < Glyphs.protectedSlots ? "c-glyph-inventory__protected-slot" : "c-glyph-inventory__slot";
    }
  },
  template: `
  <div class="l-glyph-inventory">
    Click and drag or double-click to equip glyphs.
    <br>
    The top two rows of slots are protected slots and are unaffected by glyph sorting and auto clean.
    <div v-for="row in rowCount" class="l-glyph-inventory__row">
      <div v-for="col in colCount"
           class="l-glyph-inventory__slot"
           :class="slotClass(toIndex(row, col))"
           @dragover="allowDrag"
           @drop="drop(toIndex(row, col), $event)">
        <glyph-component v-if="inventory[toIndex(row, col)]"
          :glyph="inventory[toIndex(row, col)]"
          :showSacrifice="glyphSacrificeUnlocked"
          :draggable="true"
          @shiftClicked="removeGlyph($event, false)"
          @ctrlShiftClicked="removeGlyph($event, true)"
          @clicked="clickGlyph(col, $event)"/>
      </div>
    </div>
    <div>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="Arranges by decreasing level×rarity"
        @click="sortByPower">
          Sort by power
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        ach-tooltip="Group glyphs together based on effects"
        @click="sortByEffect">
          Sort by effect
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
        v-if="showScoreFilter"
        ach-tooltip="Arranges by decreasing glyph filter score"
        @click="sortByScore">
          Sort by score
      </button>
      <br/>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
            :ach-tooltip="(glyphSacrificeUnlocked ? 'Sacrifice' : 'Delete') +
              ' glyphs that are worse in every way than enough other glyphs' +
              (hasPerkShop ? ' (ignores music glyphs)' : '')"
            @click="autoClean">
       Auto clean
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
            :ach-tooltip="(glyphSacrificeUnlocked ? 'Sacrifice' : 'Delete') +
              ' glyphs that are worse in every way than ANY other glyph' +
              (hasPerkShop ? ' (can remove music glyphs)' : '')"
            @click="harshAutoClean">
       Harsh auto clean
      </button>
      <button class="l-glyph-inventory__sort c-reality-upgrade-btn"
            @click="deleteAllUnprotected">
       {{ glyphSacrificeUnlocked ? "Sacrifice" : "Delete" }} all unprotected glyphs
      </button>
      <primary-button-on-off
        v-if="showAutoAutoClean"
        v-model="isAutoAutoCleanOn"
        class="l-glyph-inventory__sort c-reality-upgrade-btn"
        text="Auto auto-clean:"
      />
    </div>
  </div>
  `,
});
