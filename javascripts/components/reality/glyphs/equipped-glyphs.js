"use strict";

Vue.component("equipped-glyphs", {
  data() {
    return {
      glyphs: [],
      dragoverIndex: -1,
      respec: player.reality.respec,
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
        ? ("Unequip the last equipped glyph and rewind reality to when you equipped it." +
          " (Most resources will be fully reset)")
        : "Undo is only available for glyphs equipped during this reality";
    },
  },
  created() {
    this.on$(GameEvent.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    glyphPositionStyle(idx) {
      return {
        position: "absolute",
        left: `calc(50% + ${this.glyphX(idx)}rem)`,
        top: `calc(50% + ${this.glyphY(idx)}rem)`,
      };
    },
    glyphX(idx) {
      return -this.GLYPH_SIZE / 2 + this.arrangementRadius *
        Math.sin(2 * Math.PI * idx / this.slotCount);
    },
    glyphY(idx) {
      return -this.GLYPH_SIZE / 2 + this.arrangementRadius *
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
    update() {
      this.respec = player.reality.respec;
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
          " - antimmatter, infinity points, and eternity points;\n" +
          " - time theorems and EC completions;\n" +
          " - time in current reality" +
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
                         :circular="true"/>
        <div v-else
             :class="['l-equipped-glyphs__empty', 'c-equipped-glyphs__empty',
                      {'c-equipped-glyphs__empty--dragover': dragoverIndex == idx}]" />
      </div>
    </div>
    <div class="l-equipped-glyphs__buttons">
      <button :class="['l-equipped-glyphs__respec', 'c-reality-upgrade-btn', {'c-reality-upgrade-btn--bought': respec}]"
              :ach-tooltip="respecTooltip"
              @click="toggleRespec">
        Clear glyph slots on Reality
      </button>
      <button v-if="undoVisible"
              class="l-equipped-glyphs__undo c-reality-upgrade-btn"
              :class="{'c-reality-upgrade-btn--unavailable': !undoAvailable}"
              :ach-tooltip="undoTooltip"
              @click="undo">
        Undo
      </button>
    </div>
  </div>
  `,
});