<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";

export default {
  name: "GlyphSetRecordsTab",
  components: {
    GlyphSetPreview
  },
  data() {
    return {
      recordGlyphInfo: [],
    };
  },
  methods: {
    update() {
      const bestReality = player.records.bestReality;
      const laitelaDim = 8 - Laitela.difficultyTier;
      this.recordGlyphInfo = [
        [true, Glyphs.copyForRecords(bestReality.RMSet), "Best Reality Machines gained",
          `${format(bestReality.RM, 2, 2)} RM`],
        [true, Glyphs.copyForRecords(bestReality.RMminSet), "Best Reality Machines per minute",
          `${format(bestReality.RMmin, 2, 2)} RM/min`],
        [true, Glyphs.copyForRecords(bestReality.glyphLevelSet), "Best Glyph Level",
          `Level ${formatInt(bestReality.glyphLevel)}`],
        [true, Glyphs.copyForRecords(bestReality.bestEPSet), "Highest Eternity Points",
          `${format(bestReality.bestEP, 2, 2)} EP`],
        [true, Glyphs.copyForRecords(bestReality.speedSet), "Fastest Reality (real time)",
          `${TimeSpan.fromMilliseconds(bestReality.realTime).toStringShort()}`],
        [player.celestials.teresa.bestRunAM.gt(1), Glyphs.copyForRecords(player.celestials.teresa.bestAMSet),
          `Highest Antimatter in ${Teresa.possessiveName} Reality`,
          `${format(player.celestials.teresa.bestRunAM, 2, 2)} Antimatter`],
        [Currency.imaginaryMachines.gt(0), Glyphs.copyForRecords(bestReality.iMCapSet),
          "Highest Imaginary Machine cap",
          `${format(MachineHandler.currentIMCap, 2, 2)} iM`],
        [Laitela.isUnlocked, Glyphs.copyForRecords(bestReality.laitelaSet),
          `Best ${Laitela.displayName} Destabilization`,
          `${TimeSpan.fromSeconds(player.celestials.laitela.fastestCompletion).toStringShort()},
          ${laitelaDim} ${pluralize("Dimension", laitelaDim)} (${formatX(Laitela.realityReward, 2, 2)} DM)`],
      ];
    },
  }
};
</script>

<template>
  <div class="l-glyph-set-tab">
    <div
      v-for="(set, idx) in recordGlyphInfo"
      :key="idx"
    >
      <div
        v-if="set[0]"
        class="l-glyph-set-entry"
      >
        {{ set[2] }}:
        <GlyphSetPreview
          v-if="set[0]"
          :key="idx"
          :glyphs="set[1]"
          :text="set[2]"
          :text-hidden="true"
        />
        {{ set[3] }}
        <br>
      </div>
    </div>
  </div>
</template>
