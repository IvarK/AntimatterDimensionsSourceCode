"use strict";

// This code is mostly just an amalgamation of glyph-peek and glyph selection. There's no new fancy ideas here at all.

Vue.component("modal-reality", {
  components: {
    "effect-desc": GlyphTooltipEffect
  },
  data() {
    return {
      glyphs: [],
      levelDifference: 0,
      selectedGlyph: undefined,
      level: 0,
      canPeek: false,
      isVisible: false,
      canRefresh: false,
      effects: GameDatabase.reality.glyphEffects,
      grabbedEffects: [],
      types: [],
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
    GlyphSelection.realityProps = getRealityProps(false, false);
    GlyphSelection.active = true;
  },
  destroyed() {
    GlyphSelection.active = false;
  },
  computed: {
    message() {
      return `Reality will reset everything except challenge records. Your Achievements are also reset, 
      but you will automatically get one back every 30 minutes. 
      You will also gain Reality Machines based on your Eternity Points, a
      Glyph with a power level based on your Eternity Points, Replicanti, and Dilated Time, a Perk Point to spend 
      on quality of life upgrades, and unlock various upgrades.`;
    },
    gained() {
      return `You will gain ${format(gainedRealityMachines(), 2, 0)} Reality Machines
      and ${format(simulatedRealityCount() + 1, 2, 0)} Perk 
      ${pluralize("Point", simulatedRealityCount() + 1, "Points")} on Reality.
      ${Achievement(154).isUnlocked ? `You also have a ${formatPercents(0.1)} 
      chance to multiply gained Perk Points by ${formatX(2)} due to Achievement 154.` : ""}`;
    },
    direction() {
      if (this.glyphs[0].level > player.records.bestReality.glyphLevel) return "higher";
      return "lower";
    },
    confirmationOn() {
      return player.options.confirmations.reality;
    },
    canSacrifice() {
      return RealityUpgrade(19).isEffectActive;
    }
  },
  methods: {
    getGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.glyphList(
        GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false });
      this.level = gainedGlyphLevel().actualLevel;
      this.grabEffects();
    },
    handleYesClick(isSacrificing) {
      if (isSacrificing) {
        GlyphSelection.select(this.glyphs[Math.floor(Math.random() * GlyphSelection.choiceCount)], true);
        triggerManualReality(getRealityProps(false, true));
        this.emitClose();
      } else if (this.selectedGlyph === undefined && !isSacrificing) {
        GameUI.notify.error("Please select a Glyph.");
      } else if (!isSacrificing && this.selectedGlyph !== undefined) {
        GlyphSelection.select(this.glyphs[this.selectedGlyph], false);
        triggerManualReality(getRealityProps(false, true));
        this.emitClose();
      }
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
      this.levelDifference = Math.abs(player.records.bestReality.glyphLevel - this.glyphs[0].level);
    },
    select(index) {
      this.selectedGlyph = index;
    },
    trashGlyphs() {
      if (!player.options.confirmations.glyphSacrifice ||
        confirm("Are you sure you want to sacrifice a random one of these glyphs?")) {
        this.handleYesClick(true);
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
        this.types.push(this.glyphs[i].type);
      }
    }
  },
  template: 
  `<div class="l-modal-content--centered c-modal-message">
      <h2>You are about to Reality</h2>
      <div v-if="confirmationOn">
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <br>
      <div class="c-modal-message__text">
        {{ gained }}
      </div>
      </div>
      <div class="l-glyph-selection__row">
        <glyph-component v-for="(glyph, index) in glyphs"
                        class="l-glyph-selection__glyph"
                        :key="index"
                        :glyph="glyph"
                        :noLevelOverride="true"
                        :showSacrifice="canSacrifice"
                        @click.native="select(index)"
                        />
      </div>
      <div style="font-size: 1rem">(click a Glyph to choose it)</div>
      <div style="font-size: 1rem">You will get a level {{ format(this.level) }} Glyph on Reality</div>
     <div class="l-glyph-tooltip__effects">
     <div v-for="glyph in grabbedEffects">
     <div>Glyph {{ grabbedEffects.indexOf(glyph) + 1 }}
     <br> Type: {{ types[grabbedEffects.indexOf(glyph)].capitalize() }}</div>
     <br>
      <effect-desc v-for="e in glyph"
                   :key="e.id"
                   :effect="e.id"
                   :value="e.value"/>
    </div>
    </div>
    <div class="l-options-grid__row">
      <button class="o-primary-btn o-primary-btn--glyph-trash"
        v-if="canSacrifice"
        v-on:click="trashGlyphs()">
          I don't want any of these Glyphs,
          <br>
          pick and Sacrifice one at random.
          <br>
          (these are {{ formatInt(levelDifference) }} {{"level" | pluralize(levelDifference)}}
          {{ direction }} than your best)
          <br>
          <span style="font-size: 0.75rem">
          This button triggers reality!
          </span>
      </button>
      </div>
        <div class="l-options-grid__row">
          <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
          >Cancel</primary-button>
          <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click.native="handleYesClick(false)"
          >Reality</primary-button>
        </div>
    </div>
    </div>`
});

