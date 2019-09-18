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
    }
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
        !confirm("The last equipped glyph will be removed. Reality will be reset, but you will get the antimatter," +
          " infinity points, eternity points, time theorems, and eternity challenge completions that you had when it " +
          "was equipped.")) {
        return;
      }
      Glyphs.undo();
    }
  },
  template: `
  <div class="l-equipped-glyphs">
    <div class="l-equipped-glyphs__slots">
      <template v-for="(glyph, idx) in glyphs">
        <glyph-component v-if="glyph"
                         :key="idx"
                         :glyph="glyph"
                         :style="glyphPositionStyle(idx)"
                         :circular="true"/>
        <div v-else
             :class="['l-equipped-glyphs__empty', 'c-equipped-glyphs__empty',
                      {'c-equipped-glyphs__empty--dragover': dragoverIndex == idx}]"
             :style=glyphPositionStyle(idx)>
          <!-- the drop zone is a bit larger than the glyph itself. -->
          <div class="l-equipped-glyphs__dropzone"
               @dragover="dragover($event, idx)"
               @dragleave="dragleave(idx)"
               @drop="drop($event, idx)"/>
        </div>
      </template>
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