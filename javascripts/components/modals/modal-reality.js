"use strict";

Vue.component("modal-reality", {
  data() {
    return {
      firstPerk: false,
      glyphs: GlyphSelection.glyphList(GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false }),
      levelDifference: 0,
      selectedGlyph: undefined,
      canRefresh: false,
      level: 0,
      realities: 0,
      realityMachines: new Decimal(0),
    };
  },
  created() {
    // This refreshes the glyphs shown after every reality, and also doesn't
    // allow it to refresh if you're choosing glyphs (at that point,
    // your choices are your choices). This is technically incorrect since
    // while you're choosing glyphs the level might increase, and this code
    // stops it from increasing in the glyphs shown here, but with
    // the glyph choice popup open, you can't see the tooltips, so there's
    // no way for the player to notice that.
    this.on$(GAME_EVENT.GLYPH_CHOICES_GENERATED, () => {
      this.canRefresh = false;
    });
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
    this.getGlyphs();
    GlyphSelection.realityProps = getRealityProps(false, false);

  },
  computed: {
    firstReality() {
      return `Reality will reset everything except challenge records.
      Your Achievements are also reset, but you will automatically get one back every 30 minutes.
      You will also gain Reality Machines based on your Eternity Points, a
      Glyph with a power level based on your Eternity Points, Replicanti, and Dilated Time, a Perk Point to spend
      on quality of life upgrades, and unlock various upgrades.`;
    },
    canSacrifice() {
      return RealityUpgrade(19).isEffectActive;
    },
    selectInfo() {
      return `Selecting Confirm ${this.canSacrifice ? "or Sacrifice " : ""}
              without selecting a glyph will randomly select a glyph.`;
    }
  },
  methods: {
    update() {
      this.firstPerk = Perk.firstPerk.isEffectActive;
      this.level = gainedGlyphLevel().actualLevel;
      this.realities = simulatedRealityCount() + 1;
      this.realityMachines.copyFrom(gainedRealityMachines());
      if (!this.firstPerk) return;
      for (let i = 0; i < this.glyphs.length; ++i) {
        const currentGlyph = this.glyphs[i];
        const newGlyph = GlyphSelection.glyphList(
          GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false }
        )[i];
        if (currentGlyph.level === newGlyph.level) continue;
        currentGlyph.level = newGlyph.level;
        currentGlyph.effects = newGlyph.effects;
      }
      this.levelDifference = Math.abs(player.records.bestReality.glyphLevel - this.level);
    },
    glyphClass(index) {
      return {
        "l-modal-glyph-selection__glyph": true,
        "l-modal-glyph-selection__glyph--selected": this.selectedGlyph === index,
      };
    },
    gained() {
      return `You will gain
              ${format(this.realities, 2, 0)} ${pluralize("Reality", this.realities, "Realities")},
              ${format(this.realities, 2, 0)} Perk ${pluralize("Point", this.realities)} and
              ${format(this.realityMachines, 2, 0)}
              Reality ${pluralize("Machine", this.realityMachines)} on Reality.`;
    },
    levelStats() {
      const bestGlyphLevel = player.records.bestReality.glyphLevel;
      // Bit annoying to read due to needing >, <, and =, with = needing a different format.
      return `You will get a level ${formatInt(this.level)} Glyph on Reality, which is
              ${this.level === bestGlyphLevel ? "equal to" : `
                ${formatInt(this.levelDifference)} ${pluralize("level", this.levelDifference)}
                ${this.level > bestGlyphLevel ? "higher" : "lower"} than`
              } your best.`;
    },
    getGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.glyphList(
        GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false });
    },
    select(index) {
      this.selectedGlyph = index;
    },
    returnGlyph() {
      // If we have a glyph selected, send that along, otherwise pick one at random.
      return this.selectedGlyph || Math.floor(Math.random() * GlyphSelection.choiceCount);
    },
    confirmModal(sacrifice) {
      if (this.firstPerk) {
        // If we have firstPerk, we pick from 4+ glyphs, and glyph generation functions as normal.
        // Generation occurs here to prevent RNG from changing if you do more than one reality without firstPerk.
        GlyphSelection.generate(GlyphSelection.choiceCount);
        GlyphSelection.select(this.returnGlyph(), sacrifice);
      } else if (player.realities === 0) {
        // If this is our first Reality, give them the companion and the starting power glyph.
        Glyphs.addToInventory(GlyphGenerator.startingGlyph(gainedGlyphLevel()));
        Glyphs.addToInventory(GlyphGenerator.companionGlyph(player.eternityPoints));
      } else {
        // We can't get a random glyph directly here because that disturbs the RNG
        // (makes it depend on whether you got first perk or not).
        Glyphs.addToInventory(GlyphSelection.glyphList(1, gainedGlyphLevel(), { isChoosingGlyph: true })[0]);
      }
      // We've already gotten a glyph at this point, so the second value has to be true.
      // If we haven't sacrificed, we need to sort and purge glyphs, as applicable.
      triggerManualReality(getRealityProps(false, true));
      if (!sacrifice) Glyphs.processSortingAfterReality();
      this.emitClose();
    },
    cancelModal() {
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to Reality</h2>
      <div class="c-modal-message__text" v-if="!firstPerk">
        {{ firstReality }}
      </div>
      <div class="c-modal-message__text">
        {{ gained() }}
      </div>
      <br>
      <div class="l-glyph-selection__row" v-if="firstPerk">
        <glyph-component v-for="(glyph, index) in glyphs"
                        :class="glyphClass(index)"
                        :key="index"
                        :glyph="glyph"
                        :isInModal="true"
                        :noLevelOverride="true"
                        :showSacrifice="canSacrifice"
                        @click.native="select(index)"
                        />
      </div>
      <div v-if="firstPerk">
        {{ levelStats() }}
        <br>
        {{ selectInfo }}
      </div>
      <div class="l-options-grid__row">
        <primary-button
                class="o-primary-btn--width-medium c-modal-message__okay-btn"
                @click="cancelModal"
                >Cancel</primary-button>
        <primary-button
                class="o-primary-btn--width-medium c-modal-message__okay-btn"
                v-if="canSacrifice"
                @click="confirmModal(true)"
                >Sacrifice</primary-button>
        <primary-button
                class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
                @click="confirmModal(false)"
                >Confirm</primary-button>
      </div>
    </div>
  `
});
