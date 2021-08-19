"use strict";

Vue.component("equipped-glyphs", {
  data() {
    return {
      glyphs: [],
      dragoverIndex: -1,
      respec: player.reality.respec,
      respecIntoProtected: player.options.respecIntoProtected,
      undoAvailable: false,
      undoVisible: false,
      logGlyphSacrifice: 0,
    };
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  computed: {
    // Empty slots are bigger due to the enlarged drop zone
    GLYPH_SIZE: () => 5,
    slotCount() {
      return this.glyphs.length;
    },
    arrangementRadius() {
      return [0, 0, 0, 4, 5, 6][this.slotCount];
    },
    respecTooltip() {
      return this.respec
        ? "Respec is active and will place your currently - equipped Glyphs into your inventory after reality."
        : "Your currently-equipped Glyphs will stay equipped on Reality.";
    },
    undoTooltip() {
      return this.undoAvailable
        ? ("Unequip the last equipped Glyph and rewind Reality to when you equipped it." +
          " (Most resources will be fully reset)")
        : "Undo is only available for Glyphs equipped during this Reality";
    },
  },
  methods: {
    update() {
      this.respec = player.reality.respec;
      this.respecIntoProtected = player.options.respecIntoProtected;
      this.undoVisible = Teresa.has(TERESA_UNLOCKS.UNDO);
      this.undoAvailable = this.undoVisible && player.reality.glyphs.undo.length > 0;
      // This is necessary to force a re-render by key-swapping for when altered glyph effects are activated
      this.logGlyphSacrifice = BASIC_GLYPH_TYPES
        .reduce((tot, type) => tot + Math.log10(player.reality.glyphs.sac[type]), 0);
    },
    glyphPositionStyle(idx) {
      return {
        position: "absolute",
        left: `calc(50% + ${this.glyphX(idx, 1)}rem)`,
        top: `calc(50% + ${this.glyphY(idx, 1)}rem)`,
        "z-index": 1,
      };
    },
    copyPositionStyle(glyph) {
      return {
        position: "absolute",
        left: `calc(50% + ${this.glyphX(glyph.idx, 1.4)}rem)`,
        top: `calc(50% + ${this.glyphY(glyph.idx, 1.4)}rem)`,
        opacity: 0.4,
      };
    },
    glyphX(idx, scale) {
      return -this.GLYPH_SIZE / 2 + this.arrangementRadius * scale *
        Math.sin(2 * Math.PI * idx / this.slotCount);
    },
    glyphY(idx, scale) {
      return -this.GLYPH_SIZE / 2 + this.arrangementRadius * scale *
        Math.cos(2 * Math.PI * idx / this.slotCount);
    },
    dragover(event, idx) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      event.preventDefault();
      this.dragoverIndex = idx;
    },
    dragleave(idx) {
      if (this.dragoverIndex === idx) this.dragoverIndex = -1;
    },
    drop(event, idx) {
      this.dragoverIndex = -1;
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (glyph) Glyphs.equip(glyph, idx);
    },
    toggleRespec() {
      player.reality.respec = !player.reality.respec;
    },
    toggleRespecIntoProtected() {
      player.options.respecIntoProtected = !player.options.respecIntoProtected;
    },
    glyphsChanged() {
      this.glyphs = Glyphs.active.map(GlyphGenerator.copy);
    },
    undo() {
      if (!this.undoAvailable) return;
      if (player.options.confirmations.glyphUndo) Modal.glyphUndo.show();
      else Glyphs.undo();
    },
    dragEvents(idx) {
      return {
        dragover: $event => this.dragover($event, idx),
        dragleave: () => this.dragleave(idx),
        drop: $event => this.drop($event, idx),
      };
    },
    showModal() {
      GlyphShowcaseSet = this.glyphs;
      Modal.glyphChoiceInfo.show({
        name: "Equipped Glyphs",
        closeOn: GAME_EVENT.GLYPHS_CHANGED,
        showGlobalGlyphLevel: false,
        showSetName: true,
        displaySacrifice: true,
      });
    }
  },
  template: `
    <div class="l-equipped-glyphs">
      <div class="l-equipped-glyphs__slots">
        <div
          v-for="(glyph, idx) in glyphs"
          :style="glyphPositionStyle(idx)"
          v-on="dragEvents(idx)"
          @click="showModal"
        >
          <!-- the drop zone is a bit larger than the glyph itself. -->
          <div
            class="l-equipped-glyphs__dropzone"
            v-on="dragEvents(idx)"
          />
          <glyph-component
            v-if="glyph"
            :key="idx + logGlyphSacrifice"
            :glyph="glyph"
            :circular="true"
            :isActiveGlyph="true"
            style="-webkit-user-drag: none;"
          />
          <div
            v-else
            :class="['l-equipped-glyphs__empty', 'c-equipped-glyphs__empty',
              {'c-equipped-glyphs__empty--dragover': dragoverIndex == idx}]"
          />
        </div>
      </div>
      <div class="l-equipped-glyphs__buttons">
        <button
          class="l-equipped-glyphs__large c-reality-upgrade-btn"
          :class="{'c-reality-upgrade-btn--bought': respec}"
          :ach-tooltip="respecTooltip"
          @click="toggleRespec"
        >
          Unequip Glyphs on Reality
        </button>
        <button
          v-if="undoVisible"
          class="l-equipped-glyphs__small c-reality-upgrade-btn"
          :class="{'c-reality-upgrade-btn--unavailable': !undoAvailable}"
          :ach-tooltip="undoTooltip"
          @click="undo"
        >
          Undo
        </button>
      </div>
      <div class="l-equipped-glyphs__buttons">
        <button
          class="l-equipped-glyphs__large c-reality-upgrade-btn"
          :class="{'l-equipped-glyphs__larger' : undoVisible}"
          @click="toggleRespecIntoProtected"
        >
          Unequip Glyphs to:
          <br>
          <span v-if="respecIntoProtected">Protected slots</span>
          <span v-else>Main inventory</span>
        </button>
      </div>
    </div>`
});
