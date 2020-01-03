"use strict";

Vue.component("sacrificed-glyphs", {
  components: {
    "type-sacrifice": {
      props: {
        type: String,
        hasDragover: Boolean,
      },
      data() {
        return {
          amount: 0,
          effectValue: 0,
        };
      },
      computed: {
        typeConfig() {
          return GlyphTypes[this.type];
        },
        sacConfig() {
          return GlyphSacrifice[this.type].config;
        },
        symbol() {
          return this.typeConfig.symbol;
        },
        formatAmount() {
          return this.format(this.amount, 2, 2);
        },
        description() {
          return this.sacConfig.description(this.effectValue);
        },
        currentSacrifice() {
          return this.$viewModel.tabs.reality.draggingGlyphInfo;
        },
        showNewSacrifice() {
          return this.hasDragover && this.currentSacrifice.type === this.type;
        },
        formatNewAmount() {
          return this.format(this.currentSacrifice.sacrificeValue, 2, 2);
        }
      },
      methods: {
        update() {
          this.amount = player.reality.glyphs.sac[this.type];
          this.effectValue = GlyphSacrifice[this.type].effectValue;
        }
      },
      template: `
        <div v-if="amount > 0"
             class="l-sacrificed-glyphs__type">
          <div>
            <div class="l-sacrificed-glyphs__type-symbol c-sacrificed-glyphs__type-symbol">
              {{symbol}}
            </div>
            <div class="l-sacrificed-glyphs__type-amount c-sacrificed-glyphs__type-amount">
              {{formatAmount}}
              <span v-if="showNewSacrifice"
                    class="c-sacrificed-glyphs__type-new-amount">
                + {{formatNewAmount}}
              </span>
            </div>
          </div>
          {{description}}
        </div>`
    }
  },
  data() {
    return {
      anySacrifices: false,
      hasDragover: false,
      hasAlteration: false,
      addThreshold: 0,
      empowerThreshold: 0,
      boostThreshold: 0,
      confirmSacrifice: false,
    };
  },
  computed: {
    types: () => GLYPH_TYPES,
  },
  methods: {
    update() {
      this.anySacrifices = GLYPH_TYPES.some(e => player.reality.glyphs.sac[e] !== 0);
      this.hasAlteration = Ra.has(RA_UNLOCKS.ALTERED_GLYPHS);
      this.addThreshold = GlyphAlteration.additionThreshold;
      this.empowerThreshold = GlyphAlteration.empowermentThreshold;
      this.boostThreshold = GlyphAlteration.boostingThreshold;
      this.confirmSacrifice = player.options.confirmations.glyphSacrifice;
    },
    dragover(event) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      event.preventDefault();
      this.hasDragover = true;
    },
    dragleave() {
      this.hasDragover = false;
    },
    drop(event) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      sacrificeGlyph(glyph, false, true);
      this.hasDragover = false;
    },
    toggleConfirm() {
      player.options.confirmations.glyphSacrifice = !this.confirmSacrifice;
    }
  },
  template: `
  <div v-show="anySacrifices"
       class="c-sacrificed-glyphs l-sacrificed-glyphs"
       :class="{'c-sacrificed-glyphs--dragover': hasDragover}"
       @dragover="dragover"
       @dragleave="dragleave"
       @drop="drop">
    <div v-if="hasAlteration">
      Glyph types will have one of their effects<br>
      improved when their sacrifice values are above:
      <br><br>
      {{ format(addThreshold) }} - an additional secondary effect<br>
      {{ format(empowerThreshold) }} - formula drastically improved<br>
      {{ format(boostThreshold) }} - a boost depending on glyph sacrifice
      <br><br>
    </div>
    <div class="c-sacrificed-glyphs__header">Sacrifices:</div>
    <template v-for="type in types">
      <type-sacrifice :type="type" :hasDragover="hasDragover"/>
    </template>
    <div class="l-sacrificed-glyphs__help">
      <div>Drag glyphs here or shift-click to sacrifice.</div>
      <div>Ctrl-shift-click to sacrifice without confirmation</div>
      <div @click="toggleConfirm" class="c-sacrificed-glyphs__confirm">
        <input :checked="confirmSacrifice" type="checkbox" />
        Ask for confirmation when sacrificing
      </div>
    </div>
  </div>`,
});
