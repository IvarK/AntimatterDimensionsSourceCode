"use strict";

Vue.component("equipped-glyphs", {
  data() {
    return {
      glyphs: [],
      copiedGlyphs: [],
      dragoverIndex: -1,
      respec: player.reality.respec,
      respecIntoProtected: player.options.respecIntoProtected,
      undoAvailable: false,
      undoVisible: false,
    };
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
        ? "Respec is active and will place your currently - equipped glyphs into your inventory after reality."
        : "Your currently-equipped glyphs will stay equipped on reality.";
    },
    undoTooltip() {
      return this.undoAvailable
        ? ("Unequip the last equipped glyph and rewind Reality to when you equipped it." +
          " (Most resources will be fully reset)")
        : "Undo is only available for glyphs equipped during this Reality";
    },
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
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
    update() {
      this.respec = player.reality.respec;
      this.respecIntoProtected = player.options.respecIntoProtected;
      this.undoVisible = Teresa.has(TERESA_UNLOCKS.UNDO);
      this.undoAvailable = this.undoVisible && player.reality.glyphs.undo.length > 0;
    },
    glyphsChanged() {
      this.glyphs = Glyphs.active.map(GlyphGenerator.copy);
    },
    undo() {
      if (!this.undoAvailable) return;
      if (player.options.confirmations.glyphUndo &&
        // eslint-disable-next-line prefer-template
        !confirm("The last equipped glyph will be removed. Reality will be reset, but some things will" +
          " be restored to what they were when it equipped:\n" +
          " - antimatter, Infinity Points, and Eternity Points;\n" +
          " - Dilation Upgrades, Tachyon Particles, and Dilated Time;\n" +
          " - Time Theorems and Eternity Challenge completions;\n" +
          " - Time Dimension and Reality unlocks;\n" +
          " - time in current Reality" +
          (Enslaved.isUnlocked ? ";\n - stored game time" : ""))) {
        return;
      }
      Glyphs.undo();
    },
    dragEvents(idx) {
      return {
        dragover: $event => this.dragover($event, idx),
        dragleave: () => this.dragleave(idx),
        drop: $event => this.drop($event, idx),
      };
    },
  },
  template: `
  <div class="l-equipped-glyphs">
    <div class="l-equipped-glyphs__slots">
      <div v-for="(glyph, idx) in glyphs"
           :style="glyphPositionStyle(idx)"
           v-on="dragEvents(idx)">
        <!-- the drop zone is a bit larger than the glyph itself. -->
        <div class="l-equipped-glyphs__dropzone"
             v-on="dragEvents(idx)" />
        <glyph-component v-if="glyph"
                         :key="idx"
                         :glyph="glyph"
                         :circular="true"
                         style="-webkit-user-drag: none;"/>
        <div v-else
             :class="['l-equipped-glyphs__empty', 'c-equipped-glyphs__empty',
                      {'c-equipped-glyphs__empty--dragover': dragoverIndex == idx}]" />
      </div>
      <div v-for="glyph in copiedGlyphs" :style="copyPositionStyle(glyph)">
        <glyph-component v-if="glyph"
                          :glyph="glyph"
                          :circular="true"/>
      </div>
    </div>
    <div class="l-equipped-glyphs__buttons">
      <button :class="['l-equipped-glyphs__respec', 'c-reality-upgrade-btn', {'c-reality-upgrade-btn--bought': respec}]"
              :ach-tooltip="respecTooltip"
              @click="toggleRespec">
        Unequip glyphs on Reality
      </button>
      <button v-if="undoVisible"
              class="l-equipped-glyphs__undo c-reality-upgrade-btn"
              :class="{'c-reality-upgrade-btn--unavailable': !undoAvailable}"
              :ach-tooltip="undoTooltip"
              @click="undo">
        Undo
      </button>
    </div>
    <div class="l-equipped-glyphs__buttons">
      <button :class="['l-equipped-glyphs__respec-location', 'c-reality-upgrade-btn',
      {'l-equipped-glyphs__respec-location-large' : undoVisible}]"
              @click="toggleRespecIntoProtected">
        Unequip glyphs to:
        <br>
        <span v-if="respecIntoProtected">Protected slots</span>
        <span v-else>Main inventory</span>
      </button>
    </div>
  </div>
  `,
});
