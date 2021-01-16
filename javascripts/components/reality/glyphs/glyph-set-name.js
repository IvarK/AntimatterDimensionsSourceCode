"use strict";

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

Vue.component("glyph-set-name", {
  props: {
    glyphSet: Array,
    forceColor: Boolean,
  },
  data() {
    return {
      notColored: false,
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

      // Start with companion and reality, add those to the start
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

      // Cursed wants a different method of generating names
      if (this.calculateGlyphPercent("cursed")) {
        nameString += this.cursedName;
      } else if (this.multipleGlyphList[0].perc) {
        nameString += this.normalName;
      }
      return nameString;
    },
    cursedName() {
      const cursedPerc = this.calculateGlyphPercent("cursed");
      const fir = this.multipleGlyphList[0];
      const sec = this.multipleGlyphList[1];
      const thr = this.multipleGlyphList[2];
      let adding = "";
      if (cursedPerc === 100) {
        adding += `Fully ${GLYPH_NAMES.cursed.major}`;
      } else if (cursedPerc >= 80) {
        adding += `${GLYPH_NAMES.cursed.major} ${this.getName(fir, "minor")}`;
      } else if (cursedPerc >= 60) {
        adding += `${GLYPH_NAMES.cursed.middling} ${this.getName(fir, "minor")}${this.getName(sec, "minor")}`;
      } else if (cursedPerc >= 40) {
        adding += `${GLYPH_NAMES.cursed.middling} `;
        if (fir.perc >= 60) {
          adding += `${this.getName(fir, "middling")}`;
        } else if (fir.perc >= 40) {
          adding += `${this.getName(sec, "middling")}${this.getName(fir, "major")}`;
        } else if (thr.perc) {
          adding += "Irregularity";
        }
      } else {
        adding += `${GLYPH_NAMES.cursed.minor} ${this.normalName}`;
      }
      return adding;
    },
    normalName() {
      const fir = this.multipleGlyphList[0];
      const sec = this.multipleGlyphList[1];
      const thr = this.multipleGlyphList[2];
      let adding = "";
      if (fir.perc === 100) {
        adding += `Full ${this.getName(fir, "major")}`;
      } else if (fir.perc >= 80) {
        adding += `${this.getName(sec, "middling")}${this.getName(fir, "major")}`;
      } else if (fir.perc >= 60) {
        adding += thr.perc
          ? `${this.getName(sec, "minor")}${this.getName(thr, "minor")}`
          : `${this.getName(sec, "middling")}`;
        adding += `${this.getName(fir, "major")}`;
      } else if (fir.perc >= 40) {
        if (sec.perc >= 40) {
          adding += `${this.getName(fir, "minor")}${this.getName(sec, "minor")}`;
          if (thr.perc) {
            adding += "Irregularity";
          }
        } else {
          adding += `${this.getName(fir, "middling")}`;
          adding += thr.perc
            ? "Blend"
            : `${this.getName(sec, "minor")}`;
        }
      } else if (thr.perc) {
          if (!(this.calculateGlyphPercent("reality") || this.calculateGlyphPercent("effarig") ||
                this.calculateGlyphPercent("cursed"))) {
            adding += "Irregular ";
          }
          adding += "Jumble";
        } else {
          adding += `${this.getName(fir, "minor")}${this.getName(sec, "minor")}`;
        }
      return adding;
    },
    mainGlyphName() {
      if (this.calculateGlyphPercent("cursed")) return GlyphTypes.cursed;
      if (this.calculateGlyphPercent("reality")) return GlyphTypes.reality;
      if (this.multipleGlyphList[0].perc >= 60) return GlyphTypes[this.multipleGlyphList[0].type];
      if (this.calculateGlyphPercent("effarig")) return GlyphTypes.effarig;
      if (this.calculateGlyphPercent("companion")) return GlyphTypes.companion;
      return GlyphTypes[this.multipleGlyphList[0].type];
    },
    textColor() {
      if (this.notColored && !this.forceColor) return {};

      let nameColor = this.mainGlyphName.color;
      if (this.mainGlyphName.id === "cursed") nameColor = "#5151EC";
      else if (this.musicGlyphPercent() >= 60) nameColor = "#FF80AB";
      else if (this.multipleGlyphList[1].perc && this.multipleGlyphList[2].perc &&
        this.multipleGlyphList[0].perc <= 20) {
        nameColor = "#C46200";
      }
      return {
        color: nameColor,
        "text-shadow": `-1px 1px 1px var(--color-text-base), 1px 1px 1px var(--color-text-base),
                        -1px -1px 1px var(--color-text-base), 1px -1px 1px var(--color-text-base),
                        0 0 3px ${nameColor}`,
        animation: this.mainGlyphName.id === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    },

  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.sortGlyphList);
    this.sortGlyphList();
  },
  methods: {
    update() {
      this.notColored = player.options.glyphTextColors;
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
      this.multipleGlyphList.forEach(i => i.perc = this.calculateGlyphPercent(i.type));
      this.multipleGlyphList.sort((a, b) => (a.perc === b.perc
        ? this.defaultOrder.indexOf(a.type) - this.defaultOrder.indexOf(b.type)
        : b.perc - a.perc));
    },
    getName(position, type) {
      if (!position.perc) return ``;
      return `${GLYPH_NAMES[position.type][type]} `;
    },
  },
  template: `
    <div>
      <span :style="textColor" class="c-current-glyph-effects__header">{{ setName }}</span>
    </div>`
});
