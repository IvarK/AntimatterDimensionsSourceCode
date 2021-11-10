import "../reality/glyphs/glyph-set-preview.js";

Vue.component("glyph-sets-tab", {
  data() {
    return {
      recordGlyphInfo: [],
    };
  },
  methods: {
    update() {
      const bestReality = player.records.bestReality;
      this.recordGlyphInfo = [
        [true, Glyphs.copyForRecords(bestReality.RMminSet),
          `Best Reality Machines per minute: ${format(bestReality.RMmin, 2, 2)} RM/min`],
        [true, Glyphs.copyForRecords(bestReality.glyphLevelSet),
          `Best Glyph level: ${formatInt(bestReality.glyphLevel)}`],
        [true, Glyphs.copyForRecords(bestReality.bestEPSet),
          `Best Eternity Points: ${format(bestReality.bestEP, 2, 2)} Eternity Points`],
        [true, Glyphs.copyForRecords(bestReality.speedSet),
          `Fastest Reality (real time): ${TimeSpan.fromMilliseconds(bestReality.realTime).toStringShort()}`],
        [player.celestials.teresa.bestRunAM.gt(1), Glyphs.copyForRecords(player.celestials.teresa.bestAMSet),
          `Best Antimatter in Teresa: ${format(player.celestials.teresa.bestRunAM, 2, 2)} Antimatter`],
        [Currency.imaginaryMachines.gt(0), Glyphs.copyForRecords(bestReality.iMCapSet),
          `Imaginary Machine Cap: ${format(MachineHandler.currentIMCap, 2, 2)} iM`],
        [Laitela.isUnlocked, Glyphs.copyForRecords(bestReality.laitelaSet),
          `Lai'tela DM Multiplier: ${formatX(Laitela.realityReward, 2, 2)}`],
      ];
    },
  },
  template: `
    <div class="c-stats-tab">
      <div
        v-for="(set, idx) in recordGlyphInfo"
        :key="idx"
      >
        <glyph-set-preview
          :key="idx"
          :show="set[0]"
          :glyphs="set[1]"
          :text="set[2]"
        />
        <br>
      </div>
    </div>`
});
