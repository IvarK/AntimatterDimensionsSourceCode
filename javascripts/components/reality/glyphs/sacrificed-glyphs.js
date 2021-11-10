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
          isColored: true,
          willSacrifice: false,
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
          if (!this.isColored) return { };
          return {
            color: this.typeConfig.color,
            "text-shadow": `-1px 1px 1px var(--color-text-base), 1px 1px 1px var(--color-text-base),
                            -1px -1px 1px var(--color-text-base), 1px -1px 1px var(--color-text-base),
                            0 0 3px ${this.typeConfig.color}`,
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
          const viewModel = this.$viewModel.tabs.reality;
          return viewModel.mouseoverGlyphInfo.type === ""
            ? viewModel.draggingGlyphInfo
            : viewModel.mouseoverGlyphInfo;
        },
        showNewSacrifice() {
          return this.currentSacrifice.type === this.type &&
            (this.hasDragover || (ui.view.shiftDown && this.willSacrifice));
        },
        formatNewAmount() {
          return format(this.currentSacrifice.sacrificeValue, 2, 2);
        },
        formatTotalAmount() {
          return format(this.amount + this.currentSacrifice.sacrificeValue, 2, 2);
        },
      },
      methods: {
        update() {
          this.amount = player.reality.glyphs.sac[this.type];
          this.effectValue = GlyphSacrifice[this.type].effectValue;
          this.isColored = player.options.glyphTextColors;
          this.willSacrifice = AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.SACRIFICE ||
            (AutoGlyphProcessor.sacMode === AUTO_GLYPH_REJECT.REFINE_TO_CAP &&
              this.currentSacrifice.refineValue === 0);
        }
      },
      template: `
        <div
          v-if="amount > 0"
          :style="style"
        >
          <div>
            <div class="l-sacrificed-glyphs__type-symbol c-sacrificed-glyphs__type-symbol">
              {{ symbol }}
            </div>
            <div class="l-sacrificed-glyphs__type-amount c-sacrificed-glyphs__type-amount">
              {{ formatAmount }}
              <span v-if="showNewSacrifice" class="c-sacrificed-glyphs__type-new-amount">
                + {{ formatNewAmount }} ➜ {{ formatTotalAmount }}
              </span>
            </div>
          </div>
          {{ description }}
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
      lastMachinesTeresa: new Decimal(0),
    };
  },
  computed: {
    types: () => GLYPH_TYPES.filter(type => type !== "cursed" && type !== "companion"),
    lastMachines() {
      return this.lastMachinesTeresa.lt(new Decimal("1e10000"))
        ? `${quantify("Reality Machine", this.lastMachinesTeresa, 2)}`
        : `${quantify("Imaginary Machine", this.lastMachinesTeresa.dividedBy(new Decimal("1e10000")), 2)}`;
    }
  },
  methods: {
    update() {
      this.anySacrifices = GLYPH_TYPES.some(e => player.reality.glyphs.sac[e] && player.reality.glyphs.sac[e] !== 0);
      this.hasAlteration = Ra.has(RA_UNLOCKS.ALTERED_GLYPHS);
      this.addThreshold = GlyphAlteration.additionThreshold;
      this.empowerThreshold = GlyphAlteration.empowermentThreshold;
      this.boostThreshold = GlyphAlteration.boostingThreshold;
      this.teresaMult = Teresa.runRewardMultiplier;
      this.lastMachinesTeresa.copyFrom(player.celestials.teresa.lastRepeatedMachines);
    },
    dragover(event) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      event.preventDefault();
      this.hasDragover = true;
    },
    dragleave(event) {
      if (
        !event.relatedTarget.classList ||
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
      GlyphSacrificeHandler.sacrificeGlyph(glyph, true);
      this.hasDragover = false;
    },
  },
  template: `
    <div
      class="c-current-glyph-effects l-current-glyph-effects"
      :class="{'c-sacrificed-glyphs--dragover': hasDragover}"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <div class="l-sacrificed-glyphs__help">
        <div>Drag Glyphs here or shift-click to Sacrifice.</div>
        <div>Ctrl-shift-click to Sacrifice without confirmation</div>
      </div>
      <div v-if="hasAlteration">
        <b>Altered Glyphs</b>
        <br>
        Glyph types will have one of their effects improved<br>
        when their glyph type's total sacrifice value is above:
        <br><br>
        {{ format(addThreshold) }} - an additional secondary effect<br>
        {{ format(empowerThreshold) }} - formula drastically improved<br>
        {{ format(boostThreshold) }} - a boost depending on Glyph Sacrifice
        <br><br>
      </div>
      <div class="c-sacrificed-glyphs__header">Glyph Sacrifice Boosts:</div>
      <div v-if="teresaMult > 1">
        (Multiplied by {{ formatX(teresaMult, 2, 2) }}; Teresa last done at {{ lastMachines }})
      </div>
      <div v-if="anySacrifices">
        <template v-for="type in types">
          <type-sacrifice :type="type" :hasDragover="hasDragover" />
        </template>
      </div>
      <div v-else>
        You haven't Sacrificed any Glyphs yet!
      </div>
    </div>`
});
