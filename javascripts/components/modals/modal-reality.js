"use strict";

// This code is mostly just an amalgamation of glyph-peek and glyph selection. There's no new fancy ideas here at all.

Vue.component("modal-reality", {
  components: {
    "glyph-tooltip": GlyphTooltipComponent,
  },
  data() {
    return {
      glyphs: [],
      canSacrifice: false,
      levelDifference: 0,
      selectedGlyph: Number,
      level: 0,
      canPeek: false,
      isVisible: false,
      canRefresh: false,
      effects: GameDatabase.reality.glyphEffects,
      grabbedEffects: [],
      sortedEffects: [],
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
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.refreshGlyphs);
    this.getGlyphs();
  },
  computed: {
    message() {
      return `Reality will reset everything except challenge records. Your Achievements are also reset, 
      but you will automatically get one back every 30 minutes. 
      You will also gain Reality Machines based on your Eternity Points, a Glyph with a power 
      level based on your Eternity Points, Replicanti, and Dilated Time, a Perk Point to spend 
      on quality of life upgrades, and unlock various upgrades.`;
    },
    gained() {
      return `You will gain ${format(gainedRealityMachines(), 2, 0)} Reality Machines 
      and ${format(simulatedRealityCount() + 1, 2, 0)} Perk 
      ${pluralize("Point", simulatedRealityCount() + 1, "Points")} on Reality.
      ${Achievement(154).isUnlocked ? `You also have a ${formatPercents(0.1)} 
      chance to multiply gained Perk Points due to Achievement 154.` : ""}`;
    },
    can() {
      return isRealityAvailable();
    },
    direction() {
      if (this.glyphs[0].level > player.records.bestReality.glyphLevel) return "higher";
      return "lower";
    }
  },
  methods: {
    getGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.glyphList(
        GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false });
      this.level = gainedGlyphLevel().actualLevel;
      console.log(this.glyphs);
      this.grabEffects();
    },
    handleYesClick() {
      requestManualReality();
      GlyphSelection.select(this.selectedGlyph, false);
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
    update() {
      if (!GlyphSelection.glyphs.length) return;
      for (let i = 0; i < this.glyphs.length; ++i) {
        const currentGlyph = this.glyphs[i];
        const newGlyph = GlyphSelection.glyphs[i];
        if (currentGlyph.level === newGlyph.level) continue;
        currentGlyph.level = newGlyph.level;
        currentGlyph.effects = newGlyph.effects;
      }
      this.canSacrifice = RealityUpgrade(19).isEffectActive;
      this.levelDifference = Math.abs(player.records.bestReality.glyphLevel - this.glyphs[0].level);
      
      // Hide this before first reality since then it'll confuse the player,
      // and due to pre-selected first glyph might well be incorrect anyway.
      this.isVisible = player.realities > 0 && TimeStudy.reality.isBought;
      this.canPeek = player.realities > 0;
    },
    select(index) {
      this.selectedGlyph = index;

    },
    trashGlyphs() {
      if (!player.options.confirmations.glyphSacrifice ||
        confirm("Are you sure you want to sacrifice a random one of these glyphs?")) {
        GlyphSelection.select(Math.floor(Math.random() * GlyphSelection.choiceCount), true);
      }
    },
    grabEffects() {
      if (!this.glyphs.length >= 4) return;
      for (let i = 0; i < this.glyphs.length; i++) {
        this.grabbedEffects.push(getGlyphEffectValuesFromBitmask(this.glyphs[i].effects,
          this.level,
          this.glyphs[i].strength)
          // eslint-disable-next-line no-loop-func
          .filter(effect =>
            GameDatabase.reality.glyphEffects[effect.id].isGenerated === generatedTypes.includes(this.glyphs[i].type)));
      }
    }
  },
  template: 
  `<div class="l-modal-content--centered c-modal-message">
      <h2>You are about to Reality</h2>
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <br>
      <div class="c-modal-message__text">
        {{ gained }}
      </div>
      <div class="l-modal-glyph-selection__row">
        <glyph-component v-for="(glyph, index) in glyphs"
                        class="l-modal-glyph-selection__glyph"
                        :key="index"
                        :glyph="glyph"
                        :noLevelOverride="true"
                        :showSacrifice="canSacrifice"
                        @click.native="select(index)"
                        />
      </div>
      <div v-for="glyph in glyphs">
      <glyph-tooltip
        v-bind="glyph"
         />
      </div>
      <button class="o-primary-btn o-primary-btn--glyph-trash"
        v-if="canSacrifice"
        v-on:click="trashGlyphs()">
          I don't want any of these Glyphs,
          <br>
          pick and Sacrifice one at random.
          <br>
          (these are {{ formatInt(levelDifference) }} {{"level" | pluralize(levelDifference)}}
          {{ direction }} than your best)
      </button>
        <div class="l-options-grid__row">
          <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
          >Cancel</primary-button>
          <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click.native="handleYesClick"
          :enabled="can"
          >Reality</primary-button>
        </div>
    </div>`
});

