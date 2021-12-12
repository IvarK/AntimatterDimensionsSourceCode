import PrimaryButton from "@/components/PrimaryButton";
import GlyphComponent from "@/components/GlyphComponent";

Vue.component("modal-reality", {
  components: {
    PrimaryButton,
    GlyphComponent
  },
  data() {
    return {
      showReality: false,
      showGlyphSelection: false,
      firstPerk: false,
      hasFilter: false,
      glyphs: GlyphSelection.glyphList(GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false }),
      bestLevel: 0,
      levelDifference: 0,
      selectedGlyph: undefined,
      canRefresh: false,
      level: 0,
      simRealities: 0,
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
      return `Reality will reset everything except Challenge records and anything under the General header on the
        Statistics tab. Your Achievements are also reset, but you will automatically get one back every
        ${timeDisplayNoDecimals(30 * 60000)}. You will also gain Reality Machines based on your Eternity Points, a
        Glyph with a power level based on your Eternity Points, Replicanti, and Dilated Time, a Perk Point to spend
        on quality of life upgrades, and unlock various upgrades.`;
    },
    canSacrifice() {
      return RealityUpgrade(19).isEffectActive;
    },
    selectInfo() {
      return `Selecting Confirm ${this.canSacrifice ? "or Sacrifice " : ""}
        without selecting a Glyph will
        ${this.hasFilter ? "choose a Glyph based on your filter settings" : "randomly select a Glyph"}.`;
    },
    gained() {
      return `You will gain
        ${quantifyInt("Reality", this.simRealities)},
        ${quantifyInt("Perk Point", this.simRealities)} and
        ${quantify("Reality Machine", this.realityMachines, 2)} on Reality.`;
    },
    levelStats() {
      // Bit annoying to read due to needing >, <, and =, with = needing a different format.
      return `You will get a level ${formatInt(this.level)} Glyph on Reality, which is
        ${this.level === this.bestLevel ? "equal to" : `
        ${quantifyInt("level", this.levelDifference)}
        ${this.level > this.bestLevel ? "higher" : "lower"} than`} your best.`;
    },
  },
  methods: {
    update() {
      this.showReality = player.options.confirmations.reality;
      this.showGlyphSelection = player.options.confirmations.glyphSelection;
      this.firstPerk = Perk.firstPerk.isEffectActive;
      this.hasFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.level = gainedGlyphLevel().actualLevel;
      this.simRealities = 1 + simulatedRealityCount(false);
      const simRMGained = MachineHandler.gainedRealityMachines.times(this.simRealities);
      this.realityMachines.copyFrom(simRMGained.clampMax(MachineHandler.distanceToRMCap));
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
      this.bestLevel = player.records.bestReality.glyphLevel;
      this.levelDifference = Math.abs(this.bestLevel - this.level);
    },
    glyphClass(index) {
      return {
        "l-modal-glyph-selection__glyph": true,
        "l-modal-glyph-selection__glyph--selected": this.selectedGlyph === index,
      };
    },
    getGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.glyphList(
        GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false });
    },
    select(index) {
      this.selectedGlyph = index;
    },
    confirmModal(sacrifice) {
      processManualReality(sacrifice, this.selectedGlyph);
      this.emitClose();
    },
    cancelModal() {
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to Reality</h2>
      <span v-if="showReality">
        <div class="c-modal-message__text" v-if="!firstPerk">
          {{ firstReality }}
        </div>
        <div class="c-modal-message__text">
          {{ gained }}
        </div>
      </span>
      <div class="l-glyph-selection__row" v-if="firstPerk && showGlyphSelection">
        <GlyphComponent
          v-for="(glyph, index) in glyphs"
          :class="glyphClass(index)"
          :key="index"
          :glyph="glyph"
          :isInModal="true"
          :ignoreModifiedLevel="true"
          :showSacrifice="canSacrifice"
          @click.native="select(index)"
        />
      </div>
      <div v-if="firstPerk">
        {{ levelStats }}
        <br>
        <span v-if="showGlyphSelection">{{ selectInfo }}</span>
      </div>
      <div v-if="simRealities > 1">
        <br>
        After choosing this glyph the game will simulate the rest of your Realities,
        <br>
        automatically choosing another {{ quantifyInt("Glyph", simRealities - 1) }}
        based on your Glyph filter settings.
      </div>
      <div class="l-options-grid__row">
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="cancelModal"
        >
          Cancel
        </PrimaryButton>
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          v-if="canSacrifice"
          @click="confirmModal(true)"
        >
          Sacrifice
        </PrimaryButton>
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="confirmModal(false)"
        >
          Confirm
        </PrimaryButton>
      </div>
    </div>`
});
