"use strict";

const GLYPH_NAMES = {
  companion: { name: "Huggable" },
  reality: { name: "Real" },
  music: { major: "Melodic", middling: "Chordal", minor: "Tuned" },
  effarig: { both: "Meta", glyph: "Stable", rm: "Mechanical", none: "Fragmented" },
  cursed: { major: "Cursed", middling: "Hexed", minor: "Jinxed" },
  power: { major: "Power", middling: "Mastered", minor: "Potential" },
  infinity: { major: "Infinity", middling: "Boundless", minor: "Immense" },
  replication: { major: "Replicantion", middling: "Simulated", minor: "Replicated" },
  time: { major: "Time", middling: "Chronal", minor: "Temporal" },
  dilation: { major: "Dilation", middling: "Attenuated", minor: "Diluted" },
};

Vue.component("current-glyph-set-name", {
  data() {
    return {
      musicGlyphs: 0,
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
      let nameString = "";

      // Start with companion and reality, add those to the start
      if (this.calculateGlyphPercent("companion")) {
        nameString += `${GLYPH_NAMES.companion.name} `;
      }
      if (this.calculateGlyphPercent("reality")) {
        nameString += `${GLYPH_NAMES.reality.name} `;
      }

      // Music Glyphs are tricky to get, have to search .symbol === "key266b"
      if (this.musicGlyphs === 5) {
        nameString += `${GLYPH_NAMES.music.major} `;
      } else if (this.musicGlyphs >= 2) {
        nameString += `${GLYPH_NAMES.music.middling} `;
      } else if (this.musicGlyphs === 1) {
        nameString += `${GLYPH_NAMES.music.minor} `;
      }

      // Both, RM, Glyph, Neither each have unique results
      const effarigRM = getActiveGlyphEffects().some(i => i.id === "effarigrm");
      const effarigGlyph = getActiveGlyphEffects().some(i => i.id === "effarigglyph");
      if (this.calculateGlyphPercent("effarig")) {
        if (effarigRM && effarigGlyph) nameString += `${GLYPH_NAMES.effarig.both} `;
        else if (effarigRM) nameString += `${GLYPH_NAMES.effarig.rm} `;
        else if (effarigGlyph) nameString += `${GLYPH_NAMES.effarig.glyph} `;
        else nameString += `${GLYPH_NAMES.effarig.none} `;
      }

      // Cursed wants a different set than without Cursed
      if (this.calculateGlyphPercent("cursed")) {
        nameString += this.cursedName;
      } else if (this.multipleGlyphList[0].perc) {
        nameString += this.normalName;
      }
      return nameString;
    },
    cursedName() {
      const cursedCount = this.calculateGlyphPercent("cursed");
      const fir = this.multipleGlyphList[0];
      const sec = this.multipleGlyphList[1];
      const thr = this.multipleGlyphList[2];
      let adding = "";
      if (cursedCount === 100) {
        adding += "Fully ";
        adding += `${GLYPH_NAMES.cursed.major} `;
      } else if (cursedCount >= 80) {
        adding += `${GLYPH_NAMES.cursed.major} `;
        if (fir.perc) {
          adding += `${GLYPH_NAMES[fir.type].minor} `;
        }
      } else if (cursedCount >= 60) {
        adding += `${GLYPH_NAMES.cursed.middling} `;
        if (fir.perc) {
          adding += `${GLYPH_NAMES[fir.type].minor} `;
          if (sec.perc) {
            adding += `${GLYPH_NAMES[sec.type].minor} `;
          }
        }
      } else if (cursedCount >= 40) {
        adding += `${GLYPH_NAMES.cursed.middling} `;
        if (fir.perc >= 60) {
          adding += `${GLYPH_NAMES[fir.type].middling} `;
        } else if (fir.perc >= 40) {
          if (sec.perc) {
            adding += `${GLYPH_NAMES[sec.type].middling} `;
          }
          adding += `${GLYPH_NAMES[fir.type].major} `;
        } else if (fir.perc && sec.perc && thr.perc) {
          adding += "Irregularity";
        }
      } else if (cursedCount) {
        adding += `${GLYPH_NAMES.cursed.minor} `;
        adding += "Jumble";
      }
      return adding;
    },
    normalName() {
      const fir = this.multipleGlyphList[0];
      const sec = this.multipleGlyphList[1];
      const thr = this.multipleGlyphList[2];
      let adding = "";
      if (fir.perc === 100) {
        adding += "Full ";
        adding += `${GLYPH_NAMES[fir.type].major} `;
      } else if (fir.perc >= 80) {
        if (sec.perc) {
          adding += `${GLYPH_NAMES[sec.type].middling} `;
        }
        adding += `${GLYPH_NAMES[fir.type].major} `;
      } else if (fir.perc >= 60) {
        if (thr.perc) {
          adding += `${GLYPH_NAMES[sec.type].minor} `;
          adding += `${GLYPH_NAMES[thr.type].minor} `;
        } else if (sec.perc) {
          adding += `${GLYPH_NAMES[sec.type].middling} `;
        }
        adding += `${GLYPH_NAMES[fir.type].major} `;
      } else if (fir.perc >= 40) {
        if (sec.perc >= 40) {
          adding += `${GLYPH_NAMES[fir.type].minor} `;
          adding += `${GLYPH_NAMES[sec.type].minor} `;
          if (thr.perc) {
            adding += "Irregularity";
          }
        } else {
          adding += `${GLYPH_NAMES[fir.type].middling} `;
          if (thr.perc) {
            adding += "Blend";
          } else if (sec.perc) {
            adding += `${GLYPH_NAMES[sec.type].minor} `;
          }
        }
      } else if (fir.perc) {
        if (thr.perc) {
          if (!(this.calculateGlyphPercent("reality") && this.calculateGlyphPercent("effarig"))) {
            adding += "Irregular ";
          }
          adding += "Jumble";
        } else {
          adding += `${GLYPH_NAMES[fir.type].minor} `;
          if (sec.perc) {
            adding += `${GLYPH_NAMES[sec.type].minor} `;
          }
        }
      }
      return adding;
    },
    textColor() {
      let glyphName = GlyphTypes[this.multipleGlyphList[0].type];
      if (this.calculateGlyphPercent("cursed")) {
        glyphName = GlyphTypes.cursed;
      } else if (this.calculateGlyphPercent("reality")) {
        glyphName = GlyphTypes.reality;
      } else if (this.multipleGlyphList[0].perc >= 60) {
        glyphName = GlyphTypes[this.multipleGlyphList[0].type];
      } else if (this.calculateGlyphPercent("effarig")) {
        glyphName = GlyphTypes.effarig;
      } else if (this.calculateGlyphPercent("companion")) {
        glyphName = GlyphTypes.companion;
      }
      let nameColor = glyphName.color;
      if (glyphName.id === "cursed") nameColor = "#5151EC";
      else if (this.musicGlyphs >= 3) nameColor = "#FF80AB";
      else if (this.multipleGlyphList[1].perc && this.multipleGlyphList[2].perc &&
        this.multipleGlyphList[0].perc <= 20) {
        nameColor = "#C46200";
      }
      return {
        color: nameColor,
        "text-shadow": `-1px 1px 1px var(--color-text-inverted), 1px 1px 1px var(--color-text-inverted),
                        -1px -1px 1px var(--color-text-inverted), 1px -1px 1px var(--color-text-inverted),
                        0 0 3px ${nameColor}`,
        animation: glyphName.id === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    },
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    calculateGlyphPercent(name) {
      return (Glyphs.activeList.filter(i => i.type === name).length / Glyphs.activeSlotCount) * 100;
    },
    glyphsChanged() {
      this.musicGlyphs = Glyphs.activeList.filter(i => i.symbol === "key266b").length;
      this.multipleGlyphList.forEach(i => i.perc = this.calculateGlyphPercent(i.type));
      this.multipleGlyphList.sort((a, b) => (a.perc === b.perc
        ? this.defaultOrder.indexOf(a.type) - this.defaultOrder.indexOf(b.type)
        : b.perc - a.perc));
    }
  },
  template: `
    <div>
      <span :style="textColor" class="c-current-glyph-effects__header">{{ setName }}</span>
    </div>`
});
