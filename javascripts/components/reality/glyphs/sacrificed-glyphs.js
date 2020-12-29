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
        style() {
          return {
            color: this.typeConfig.color,
            "text-shadow": `-1px 1px 1px black, 1px 1px 1px black,
            -1px -1px 1px black, 1px -1px 1px black, 0 0 3px ${this.typeConfig.color}`,
            animation: this.typeConfig.id === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
          };
        },
        symbol() {
          return this.typeConfig.symbol;
        },
        formatAmount() {
          return format(this.amount, 2, 2);
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
          return format(this.currentSacrifice.sacrificeValue, 2, 2);
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
             class="l-sacrificed-glyphs__type"
             :style="style">
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
      teresaMult: 0,
      lastRMTeresa: new Decimal(0),
    };
  },
  computed: {
    types: () => GLYPH_TYPES.filter(type => type !== "cursed" && type !== "companion"),
  },
  methods: {
    update() {
      this.anySacrifices = GLYPH_TYPES.some(e => player.reality.glyphs.sac[e] && player.reality.glyphs.sac[e] !== 0);
      this.hasAlteration = Ra.has(RA_UNLOCKS.ALTERED_GLYPHS);
      this.addThreshold = GlyphAlteration.additionThreshold;
      this.empowerThreshold = GlyphAlteration.empowermentThreshold;
      this.boostThreshold = GlyphAlteration.boostingThreshold;
      this.teresaMult = Teresa.runRewardMultiplier;
      this.lastRMTeresa.copyFrom(player.celestials.teresa.lastRepeatedRM);
    },
    dragover(event) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      event.preventDefault();
      this.hasDragover = true;
    },
    dragleave(event) {
      if (
        event.relatedTarget.classList.contains("c-current-glyph-effects") ||
        event.relatedTarget.classList.contains("c-sacrificed-glyphs__header") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type-symbol") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type-amount") ||
        event.relatedTarget.classList.contains("c-sacrificed-glyphs__type-new-amount") ||
        event.relatedTarget.classList.length === 0) return;
      this.hasDragover = false;
    },
    drop(event) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      GlyphSacrificeHandler.sacrificeGlyph(glyph);
      this.hasDragover = false;
    },
  },
  template: `
  <div
      class="c-current-glyph-effects l-current-glyph-effects"
      :class="{'c-sacrificed-glyphs--dragover': hasDragover}"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop">
    <div class="l-sacrificed-glyphs__help">
      <div>Drag Glyphs here or shift-click to Sacrifice.</div>
      <div>Ctrl-shift-click to Sacrifice without confirmation</div>
    </div>
    <div class="c-sacrificed-glyphs__header">Glyph Sacrifice Boosts:</div>
    <div
    <div v-if="teresaMult > 1">
      (Multiplied by {{ formatX(teresaMult, 2, 2) }}; Teresa last done at
      {{ format(lastRMTeresa, 2) }} Reality Machines)
    </div>
    <div v-if="anySacrifices">
      <template v-for="type in types">
        <type-sacrifice :type="type" :hasDragover="hasDragover"/>
      </template>
      <div v-if="hasAlteration">
        <br>
        <b>Altered Glyphs</b>
        <br>
        Glyph types will have one of their effects<br>
        improved when their Glyph Sacrifice values are above:
        <br><br>
        {{ format(addThreshold) }} - an additional secondary effect<br>
        {{ format(empowerThreshold) }} - formula drastically improved<br>
        {{ format(boostThreshold) }} - a boost depending on Glyph Sacrifice
        <br><br>
      </div>
    </div>
    <div v-else>
      You haven't Sacrificed any Glyphs yet!
    </div>
  </div>`,
});
