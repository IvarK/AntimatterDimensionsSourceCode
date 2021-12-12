<script>
// If you change this, try to keep the syntaxes and tenses the same to avoid solecisms
const GLYPH_NAMES = {
  companion: { name: "Huggable" },
  reality: { name: "Real" },
  music: { major: "Melodic", middling: "Chordal", minor: "Tuned" },
  effarig: { both: "Meta", glyph: "Stable", rm: "Mechanical", none: "Fragmented" },
  cursed: { major: "Cursed", middling: "Hexed", minor: "Jinxed" },
  power: { major: "Power", middling: "Mastered", minor: "Potential" },
  infinity: { major: "Infinity", middling: "Boundless", minor: "Immense" },
  replication: { major: "Replication", middling: "Simulated", minor: "Replicated" },
  time: { major: "Time", middling: "Chronal", minor: "Temporal" },
  dilation: { major: "Dilation", middling: "Attenuated", minor: "Diluted" },
};

export default {
  props: {
    glyphSet: {
      type: Array,
      required: true
    },
    forceColor: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isColored: true,
      defaultOrder: ["power", "infinity", "replication", "time", "dilation"],
      multipleGlyphList: [
        { type: "power", perc: 0 },
        { type: "infinity", perc: 0 },
        { type: "replication", perc: 0 },
        { type: "time", perc: 0 },
        { type: "dilation", perc: 0 }
      ],
    };
  },
  computed: {
    setName() {
      this.sortGlyphList();
      let nameString = "";

      // Start with Companion and Reality, add those to the start
      if (this.calculateGlyphPercent("companion")) {
        nameString += `${GLYPH_NAMES.companion.name} `;
      }
      if (this.calculateGlyphPercent("reality")) {
        nameString += `${GLYPH_NAMES.reality.name} `;
      }

      // Now on to Music Glyphs - seperate from the others as they can be both Music and [type]
      if (this.musicGlyphPercent() === 100) {
        nameString += `${GLYPH_NAMES.music.major} `;
      } else if (this.musicGlyphPercent() >= 40) {
        nameString += `${GLYPH_NAMES.music.middling} `;
      } else if (this.musicGlyphPercent()) {
        nameString += `${GLYPH_NAMES.music.minor} `;
      }

      // Both, RM, Glyph, Neither each have unique results
      const effarigRM = this.glyphSet.some(i => getSingleGlyphEffectFromBitmask("effarigrm", i));
      const effarigGlyph = this.glyphSet.some(i => getSingleGlyphEffectFromBitmask("effarigglyph", i));
      if (this.calculateGlyphPercent("effarig")) {
        if (effarigRM && effarigGlyph) nameString += `${GLYPH_NAMES.effarig.both} `;
        else if (effarigRM) nameString += `${GLYPH_NAMES.effarig.rm} `;
        else if (effarigGlyph) nameString += `${GLYPH_NAMES.effarig.glyph} `;
        else nameString += `${GLYPH_NAMES.effarig.none} `;
      }

      // Cursed needs a special additional method of generating its names
      if (this.calculateGlyphPercent("cursed")) nameString += this.cursedName;
      else if (this.multipleGlyphList[0].perc) nameString += this.normalName;

      return nameString;
    },
    cursedName() {
      const cursedPerc = this.calculateGlyphPercent("cursed");
      const main = GLYPH_NAMES.cursed;
      const fir = this.multipleGlyphList[0];
      const sec = this.multipleGlyphList[1];
      const thr = this.multipleGlyphList[2];
      if (cursedPerc === 100) {
        // All Cursed Glyphs should get something special.
        return `Fully ${main.major}`;
      }
      if (cursedPerc >= 75) {
        // Mostly Cursed Glyphs, but should mention the other.
        return `${main.major} ${this.getName(fir, "minor")}`;
      }
      if (cursedPerc >= 60) {
        // Have less Cursed Glyphs, so the name's changed, and might have a second now so need a case for that.
        return `${main.middling} ${this.getName(fir, "minor")}${this.getName(sec, "minor")}`;
      }
      if (cursedPerc >= 40) {
        // If we have a third normal Glyph, lets call it an Irregularity, otherwise specify the types.
        if (fir.perc >= 40) {
          return `${main.middling} ${this.getName(sec, "middling")}${this.getName(fir, "major")}`;
        }
        if (thr.perc) {
          return `${main.middling} Irregularity`;
        }
      }
      // If we only have the one Cursed Glyph, lets just add the normal name to it and avoid repetition.
      return `${main.minor} ${this.normalName}`;
    },
    normalName() {
      const fir = this.multipleGlyphList[0];
      const sec = this.multipleGlyphList[1];
      const thr = this.multipleGlyphList[2];
      if (fir.perc === 100) {
        // The only Glyph here is the one type so it should get a special name.
        return `Full ${this.getName(fir, "major")}`;
      }
      if (fir.perc >= 75) {
        // Two Glyphs, but its mainly the one type.
        return `${this.getName(sec, "middling")}${this.getName(fir, "major")}`;
      }
      if (fir.perc >= 60) {
        // Room for 2 other Glyphs off the main, so theres a case for each of them.
        return `${thr.perc
          ? `${this.getName(sec, "minor")}${this.getName(thr, "minor")}`
          : `${this.getName(sec, "middling")}`
        }${this.getName(fir, "major")}`;
      }
      if (fir.perc >= 40) {
        if (sec.perc >= 40) {
          if (thr.perc) {
            // If we have a 3rd type, lets also call it an Irregularity
            return `${this.getName(fir, "minor")}${this.getName(sec, "minor")}Irregularity`;
          }
          // Essentially means the same amount for both, so give them the same name.
          return `${this.getName(fir, "minor")}${this.getName(sec, "minor")}`;
        }
        // Second Glyph is less than the first meaning a different name, and if we also have a third, call it Blend.
        return `${this.getName(fir, "middling")}${thr.perc ? "Blend" : `${this.getName(sec, "minor")}`}`;
      }
      if (thr.perc) {
        // This means we have 3 different Glyphs, with only one Glyph of each.
        if (!(this.calculateGlyphPercent("reality") || this.calculateGlyphPercent("effarig") ||
          this.calculateGlyphPercent("cursed"))) {
          // If it doesn't have Reality, Effarig, or Cursed Glyphs, call it Irregular Jumble, otherwise call it Jumble.
          return "Irregular Jumble";
        }
        return "Jumble";
      }
      // This means we don't have 3 different Glyphs, but dont have 2 of one type.
      return `${this.getName(fir, "minor")}${this.getName(sec, "minor")}`;
    },
    mainGlyphName() {
      // This returns the type of Glyph that we want for color determinations.
      // The priority is Cursed > Companion > Reality > 60% or more of normal Glyphs > Effarig > any normal Glyph.
      if (this.calculateGlyphPercent("cursed")) return GlyphTypes.cursed;
      if (this.calculateGlyphPercent("companion")) return GlyphTypes.companion;
      if (this.calculateGlyphPercent("reality")) return GlyphTypes.reality;
      if (this.multipleGlyphList[0].perc >= 60) return GlyphTypes[this.multipleGlyphList[0].type];
      if (this.calculateGlyphPercent("effarig")) return GlyphTypes.effarig;
      return GlyphTypes[this.multipleGlyphList[0].type];
    },
    textColor() {
      // If its cursed, we want its color to be #5151EC, because by default its black, which can be unreadable.
      // If we have greater than or equal to 60% of our Glyphs as Music Glyphs, give us the Music Glyph color.
      // If we have 3 types of Glyphs, and none of them have more than 25% total, lets get a copper color.
      // And if we have none of the above (which is most common), lets get the color of the main Glyph.
      if (this.mainGlyphName.id === "cursed") return "#5151EC";
      if (this.musicGlyphPercent() >= 60) return "#FF80AB";
      if (this.multipleGlyphList[1].perc && this.multipleGlyphList[2].perc && this.multipleGlyphList[0].perc <= 25) {
        return "#C46200";
      }
      return this.mainGlyphName.color;
    },
    textStyle() {
      this.$recompute("mainGlyphName");
      // If you have the player option to not show color enabled, and this isn't a special case forcing color, return {}
      if (!this.isColored && !this.forceColor) return {};
      // Otherwise, lets set the shadow to be 4, each offset to a different corner, and bluring by 1px,
      // then bluring by 3px with no offset with the same color as the text.
      // If its a Reality Glyph, assign it Reality Glyph's animation.
      return {
        color: this.textColor,
        "text-shadow": `-1px 1px 1px var(--color-text-base), 1px 1px 1px var(--color-text-base),
                        -1px -1px 1px var(--color-text-base), 1px -1px 1px var(--color-text-base),
                        0 0 3px ${this.textColor}`,
        animation: this.mainGlyphName.id === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.sortGlyphList);
    this.sortGlyphList();
  },
  methods: {
    update() {
      this.isColored = player.options.glyphTextColors;
    },
    calculateGlyphPercent(name) {
      // Take the amount of a type of glyph in the set, divide by the maximum number of glyphs, then * 100 to get %
      return (this.glyphSet.filter(i => i.type === name).length / Glyphs.activeSlotCount) * 100;
    },
    musicGlyphPercent() {
      // Music Glyphs are tricky to get, have to search .symbol === "key266b"
      return (this.glyphSet.filter(i => i.symbol === "key266b").length / Glyphs.activeSlotCount) * 100;
    },
    sortGlyphList() {
      // Get the percent for each type, then sort it based on type and then default order, to make it consistent
      this.$recompute("textColor");
      this.multipleGlyphList.forEach(i => i.perc = this.calculateGlyphPercent(i.type));
      this.multipleGlyphList.sort((a, b) => (a.perc === b.perc
        ? this.defaultOrder.indexOf(a.type) - this.defaultOrder.indexOf(b.type)
        : b.perc - a.perc));
    },
    getName(position, type) {
      // If the position.perc is 0, return an empty string, and if it does, return a string from GLYPH_NAMES
      if (!position.perc) return ``;
      return `${GLYPH_NAMES[position.type][type]} `;
    },
  }
};
</script>

<template>
  <div>
    <span
      :style="textStyle"
      class="c-current-glyph-effects__header"
    >
      {{ setName }}
    </span>
  </div>
</template>
