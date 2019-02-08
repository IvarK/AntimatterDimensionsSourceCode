Vue.component("equipped-glyphs", {
  data: function () {
    return {
      glyphs: Glyphs.activeCopy,
      dragoverIndex: -1,
      respec: player.reality.respec,
    };
  },
  computed: {
    GLYPH_SIZE() {
      // Empty slots are bigger due to the enlarged drop zone
      return 5;
    },
    numSlots() {
      return this.glyphs.length;
    },
    arrangementRadius() {
      return [0, 0, 0, 4, 5, 6][this.numSlots];
    },
    glyphPositionStyle() {
      return this.glyphs.map((g, idx) => ({
        position: "absolute",
        left: `calc(50% + ${this.glyphX(idx)}rem)`,
        top: `calc(50% + ${this.glyphY(idx)}rem)`,
      }));
    },
    respecTooltip() {
      return this.respec
        ? "Respec is active and will place your currently - equipped glyphs into your inventory after reality."
        : "Your currently-equipped glyphs will stay equipped on reality.";
    },
  },
  methods: {
    glyphX(idx) {
      return -this.GLYPH_SIZE / 2 + this.arrangementRadius *
        Math.sin(2 * Math.PI * idx / this.numSlots);
    },
    glyphY(idx) {
      return -this.GLYPH_SIZE / 2 + this.arrangementRadius *
        Math.cos(2 * Math.PI * idx / this.numSlots);
    },
    dragover(event, idx) {
      event.preventDefault();
      this.dragoverIndex = idx;
    },
    dragleave(idx) {
      if (this.dragoverIndex == idx) this.dragoverIndex = -1;
    },
    drop(event) {
      this.dragoverIndex = -1;
      drop(event);
    },
    toggleRespec() {
      player.reality.respec = !player.reality.respec;
    },
    update() {
      this.respec = player.reality.respec;
    }
  },
  template: /*html*/`
  <div class="l-equipped-glyphs">
    <div class="l-equipped-glyphs__slots">
      <template v-for="(glyph, idx) in glyphs">
        <glyph-component v-if="glyph" :glyph="glyph" :key="idx"
                         :style="glyphPositionStyle[idx]" :circular="true"/>
        <div v-else :class="['l-equipped-glyphs__empty', 'c-equipped-glyphs__empty',
                      {'c-equipped-glyphs__empty--dragover': dragoverIndex == idx}]"
                    :style=glyphPositionStyle[idx]>
          <!-- the drop zone is a bit larger than the glyph itself. -->
          <div :id="'active' + idx" class="glyphactive l-equipped-glyphs__dropzone"
                @dragover="dragover($event, idx)" @dragleave="dragleave(idx)" @drop="drop($event)"/>
        </div>
      </template>
    </div>
    <button :class="['l-equipped-glyphs__respec', 'c-reality-upgrade', {rUpgBought: respec}]"
            @click="toggleRespec" :ach-tooltip="respecTooltip">
      Clear glyph slots on Reality
    </button>
  </div>
  `,
});