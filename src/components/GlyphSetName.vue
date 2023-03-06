<script>
const GLYPH_NAMES = {
  companion: {
    adjective: "Huggable",
    noun: "Companion"
  },
  reality: {
    adjective: "Real",
    noun: "Reality"
  },
  music: {
    adjective: { high: "Melodic", mid: "Chordal", low: "Tuned" },
    // This noun is only used in the case of a single companion reskinned as music (resulting in "Huggable Music");
    // otherwise the set's noun will always come from an actual glyph type instead of music
    noun: "Music"
  },
  effarig: {
    adjective: { both: "Meta", glyph: "Stable", rm: "Mechanical", none: "Fragmented" },
    noun: { both: "Effarig", glyph: "Stability", rm: "Mechanism", none: "Fragmentation" }
  },
  cursed: {
    adjective: { high: "Cursed", mid: "Hexed", low: "Jinxed" },
    noun: "Curse"
  },
  power: {
    adjective: { high: "Powerful", mid: "Mastered", low: "Potential" },
    noun: "Power"
  },
  infinity: {
    adjective: { high: "Infinite", mid: "Boundless", low: "Immense" },
    noun: "Infinity"
  },
  replication: {
    adjective: { high: "Replicated", mid: "Simulated", low: "Duplicated" },
    noun: "Replication"
  },
  time: {
    adjective: { high: "Temporal", mid: "Chronal", low: "Transient" },
    noun: "Time"
  },
  dilation: {
    adjective: { high: "Dilated", mid: "Attenuated", low: "Diluted" },
    noun: "Dilation"
  },
};

export default {
  name: "GlyphSetName",
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
      // Adjectives are added in descending order of adjOrder (basic glyphs are handled together)
      glyphTypeList: [
        { type: "power", perc: 0, adjOrder: 1 },
        { type: "infinity", perc: 0, adjOrder: 1 },
        { type: "replication", perc: 0, adjOrder: 1 },
        { type: "time", perc: 0, adjOrder: 1 },
        { type: "dilation", perc: 0, adjOrder: 1 },
        { type: "effarig", perc: 0, adjOrder: 2 },
        { type: "music", perc: 0, adjOrder: 3 },
        { type: "reality", perc: 0, adjOrder: 4 },
        { type: "companion", perc: 0, adjOrder: 5 },
        { type: "cursed", perc: 0, adjOrder: 6 },
      ],
      sortedGlyphs: [],
      slotCount: 0
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    setName() {
      this.sortGlyphList();
      if (this.sortedGlyphs.length === 0) return "Void";
      if (this.sortedGlyphs.length === 1) return this.singletonName;

      // Figure out the noun part of the name first. If we have basic glyphs, this is generated through examining those
      // specifically. Otherwise, we take the lowest-priority special glyph and turn it into its noun form
      let adjList, nounPhrase;
      if (this.sortedGlyphs.some(t => t.adjOrder === 1)) {
        adjList = this.sortedGlyphs.filter(t => t.adjOrder !== 1);
        nounPhrase = this.basicTypePhrase;
      } else {
        adjList = [...this.sortedGlyphs];
        nounPhrase = this.getNoun(adjList.pop());
      }

      const adjectives = [];
      for (const listEntry of adjList) adjectives.push(this.getAdjective(listEntry));
      return `${adjectives.join(" ")} ${nounPhrase}`;
    },
    basicTypePhrase() {
      const basicGlyphList = this.sortedGlyphs.filter(t => BASIC_GLYPH_TYPES.includes(t.type) && t.perc !== 0);
      switch (basicGlyphList.length) {
        case 1:
          return GLYPH_NAMES[basicGlyphList[0].type].noun;
        case 2:
          // Call it a mixture if they're equal and apply adjectives of appropriate magnitude
          if (basicGlyphList[0].perc === basicGlyphList[1].perc) {
            return [this.getAdjective(basicGlyphList[0]),
              this.getAdjective(basicGlyphList[1]),
              "Mixture"
            ].join(" ");
          }
          // Otherwise, give it a noun from the largest component
          return `${this.getAdjective(basicGlyphList[1])} ${this.getNoun(basicGlyphList[0])}`;
        case 3:
          // Give it a noun if there's a clear majority
          if (basicGlyphList[0].perc > basicGlyphList[1].perc) {
            return [this.getAdjective(basicGlyphList[1]),
              this.getAdjective(basicGlyphList[2]),
              this.getNoun(basicGlyphList[0]),
            ].join(" ");
          }
          // This is relatively rare; we have 1/1/1, which means that we may also already have 3 other adjectives.
          // In this case we make an exception and shorten the name instead of providing another 4 words
          if (basicGlyphList[0].perc === basicGlyphList[2].perc) return "Mixed Irregularity";
          // The only case left is 2/2/1, where we have plenty of room for words
          return [this.getAdjective(basicGlyphList[0]),
            this.getAdjective(basicGlyphList[1]),
            this.getAdjective(basicGlyphList[2]),
            "Irregularity"
          ].join(" ");
        case 4:
          // Don't bother filling the name with excessive adjectives if we have an equal proportion (1/1/1/1),
          // otherwise we take the largest component and ignore all the others (2/1/1/1)
          if (basicGlyphList[0].perc === basicGlyphList[1].perc) return "Irregular Jumble";
          return `${this.getAdjective(basicGlyphList[0])} Jumble`;
        case 5:
          // This is in reference to the achievement name, and can only occur with exactly one of every basic glyph.
          // Due to music glyphs doubling-up contributions, this may result in a "Melodic Royal Flush" or similar
          return "Royal Flush";
        default:
          throw new Error("Unexpected glyph set configuration in GlyphSetName");
      }
    },
    // Check for single-type sets and give them a special name based on how much of the full equipped slots they take up
    singletonName() {
      if (this.sortedGlyphs[0].type === "effarig") return GLYPH_NAMES.effarig.noun[this.getEffarigProp()];
      const singleGlyphTypes = ["reality", "companion"];
      for (const key of singleGlyphTypes) {
        if (this.sortedGlyphs[0].type === key) return GLYPH_NAMES[key].noun;
      }

      // We want a bit of additional flavor for partially-filled sets
      const word = GLYPH_NAMES[this.sortedGlyphs[0].type].noun;
      const perc = this.sortedGlyphs[0].perc;
      if (this.isDoomed) return `Doomed ${word}`;
      if (perc === 100) return `Full ${word}`;
      if (perc >= 75) return `Strengthened ${word}`;
      if (perc >= 40) return `Partial ${word}`;
      return `Weak ${word}`;
    },
    mainGlyphName() {
      // This returns the type of Glyph that we want for color determinations.
      // The priority is Empty > Cursed > Companion > Reality > 50% or more normal Glyphs > Effarig > any normal Glyph
      if (this.sortedGlyphs.length === 0) return { id: "none", currentColor: { border: "#888888" } };
      if (this.calculateGlyphPercent("cursed")) return CosmeticGlyphTypes.cursed;
      if (this.calculateGlyphPercent("companion")) return CosmeticGlyphTypes.companion;
      if (this.calculateGlyphPercent("reality")) return CosmeticGlyphTypes.reality;
      if (this.calculateGlyphPercent("music") >= 50) return CosmeticGlyphTypes.music;
      const primaryType = this.sortedGlyphs.filter(t => t.adjOrder === 1)[0];
      if (primaryType?.perc >= 50) return CosmeticGlyphTypes[primaryType.type];
      if (this.calculateGlyphPercent("effarig")) return CosmeticGlyphTypes.effarig;
      return CosmeticGlyphTypes[primaryType.type];
    },
    textColor() {
      // If it's the singular equipped glyph in Doomed, we color it crimson
      // If its cursed, we give it the celestial color because the default (without cosmetics) black is often unreadable
      // If we have 3 types of Glyphs, and none of them have more than 30% total, lets get a copper color.
      // And if we have none of the above (which is most common), lets get the color of the main Glyph.
      if (this.isDoomed && this.glyphSet.length === 1) return "var(--color-pelle--base)";
      if (this.mainGlyphName.id === "cursed") return "var(--color-celestials)";
      if (this.mainGlyphName.id === "music") return CosmeticGlyphTypes.music.currentColor.border;
      if (this.sortedGlyphs.length >= 3 && this.sortedGlyphs[0].perc <= 30) return "#C46200";
      return this.mainGlyphName.currentColor.border;
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
      // Without max, Doomed may retroactively zero the slot count of older sets in records and mess up their names
      // This can retroactively change names on old sets when gaining new slots in reality upgrades, but this is
      // probably acceptable since the old names may have become unattainable with the new slot count anyway
      this.slotCount = Math.max(Glyphs.activeSlotCount, this.glyphSet.length);
    },
    getEffarigProp() {
      const effarigRM = this.glyphSet.some(i => getSingleGlyphEffectFromBitmask("effarigrm", i));
      const effarigGlyph = this.glyphSet.some(i => getSingleGlyphEffectFromBitmask("effarigglyph", i));
      if (effarigRM && effarigGlyph) return "both";
      if (effarigRM) return "rm";
      if (effarigGlyph) return "glyph";
      return "none";
    },
    calculateGlyphPercent(name) {
      const percentPerGlyph = this.slotCount ? 100 / this.slotCount : 0;
      if (name === "music") return this.glyphSet.filter(i => Glyphs.isMusicGlyph(i)).length * percentPerGlyph;
      // Take the amount of a type of glyph in the set, divide by the maximum number of glyphs, then * 100 to get %
      return this.glyphSet.filter(i => i.type === name).length * percentPerGlyph;
    },
    sortGlyphList() {
      this.$recompute("textColor");
      this.glyphTypeList.forEach(t => t.perc = this.calculateGlyphPercent(t.type));
      this.sortedGlyphs = this.glyphTypeList.filter(t => t.perc !== 0);
      // This composite function is required in order to ensure consistent names with equal percentages, as JS doesn't
      // guarantee .sort() operations are stable sorts. Sorts by adjOrder, followed by perc, followed by alphabetical.
      const sortFn = t => 100 * t.adjOrder + t.perc + t.type.charCodeAt(0) / 1000;
      this.sortedGlyphs.sort((a, b) => sortFn(b) - sortFn(a));
    },
    getAdjective(listEntry) {
      if (listEntry.type === "effarig") return GLYPH_NAMES.effarig.adjective[this.getEffarigProp()];
      const adjFn = val => {
        if (val >= 60) return "high";
        if (val >= 40) return "mid";
        return "low";
      };
      const adj = GLYPH_NAMES[listEntry.type].adjective;
      return typeof adj === "string" ? adj : adj[adjFn(listEntry.perc)];
    },
    getNoun(listEntry) {
      if (listEntry.type === "effarig") return GLYPH_NAMES.effarig.noun[this.getEffarigProp()];
      return GLYPH_NAMES[listEntry.type].noun;
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
