<script>
import { DC } from "@/core/constants";

import TypeSacrifice from "./TypeSacrifice";

export default {
  name: "SacrificedGlyphs",
  components: {
    TypeSacrifice
  },
  data() {
    return {
      anySacrifices: false,
      hasDragover: false,
      hasAlteration: false,
      hideAlteration: false,
      maxSacrifice: 0,
      teresaMult: 0,
      lastMachinesTeresa: new Decimal(0),
    };
  },
  computed: {
    types: () => GLYPH_TYPES.filter(type => type !== "cursed" && type !== "companion"),
    lastMachines() {
      return this.lastMachinesTeresa.lt(DC.E10000)
        ? `${quantify("Reality Machine", this.lastMachinesTeresa, 2)}`
        : `${quantify("Imaginary Machine", this.lastMachinesTeresa.dividedBy(DC.E10000), 2)}`;
    },
    dropDownIconClass() {
      return this.hideAlteration ? "far fa-plus-square" : "far fa-minus-square";
    },
    isDoomed() {
      return Pelle.isDoomed;
    },
    addThreshold() {
      return GlyphAlteration.additionThreshold;
    },
    empowerThreshold() {
      return GlyphAlteration.empowermentThreshold;
    },
    boostThreshold() {
      return GlyphAlteration.boostingThreshold;
    },
    cosmeticTypes: () => CosmeticGlyphTypes,
    addStyle() {
      return { color: GlyphAlteration.baseAdditionColor() };
    },
    empowerStyle() {
      return { color: GlyphAlteration.baseEmpowermentColor() };
    },
    boostStyle() {
      return { color: GlyphAlteration.baseBoostColor() };
    },
    hasSeenRealityGlyph() {
      return player.reality.glyphs.createdRealityGlyph;
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPH_VISUAL_CHANGE, () => {
      this.$recompute("cosmeticTypes");
    });
  },
  methods: {
    update() {
      this.anySacrifices = GameCache.logTotalGlyphSacrifice !== 0;
      this.hasAlteration = Ra.unlocks.alteredGlyphs.canBeApplied;
      this.hideAlteration = player.options.hideAlterationEffects;
      this.maxSacrifice = GlyphSacrificeHandler.maxSacrificeForEffects;
      this.teresaMult = Teresa.runRewardMultiplier;
      this.lastMachinesTeresa.copyFrom(player.celestials.teresa.lastRepeatedMachines);
    },
    dragover(event) {
      if (Pelle.isDoomed) return;
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      event.preventDefault();
      this.hasDragover = true;
    },
    dragleave(event) {
      if (
        this.isDoomed ||
        !event.relatedTarget ||
        !event.relatedTarget.classList ||
        event.relatedTarget.classList.contains("c-current-glyph-effects") ||
        event.relatedTarget.classList.contains("c-sacrificed-glyphs__header") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type-symbol") ||
        event.relatedTarget.classList.contains("l-sacrificed-glyphs__type-amount") ||
        event.relatedTarget.classList.contains("c-sacrificed-glyphs__type-new-amount") ||
        event.relatedTarget.classList.length === 0) return;
      this.hasDragover = false;
    },
    drop(event) {
      if (this.isDoomed || !event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      GlyphSacrificeHandler.sacrificeGlyph(glyph, true);
      this.hasDragover = false;
    },
    toggleAlteration() {
      player.options.hideAlterationEffects = !player.options.hideAlterationEffects;
    },
    glyphSymbol(type) {
      return this.cosmeticTypes[type].currentSymbol.symbol;
    }
  }
};
</script>

<template>
  <div
    class="c-current-glyph-effects l-current-glyph-effects"
    :class="{'c-sacrificed-glyphs--dragover': hasDragover}"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <div class="l-sacrificed-glyphs__help">
      <span
        v-if="isDoomed"
        class="pelle-current-glyph-effects"
      >
        You cannot sacrifice Glyphs while Doomed.
      </span>
      <span v-else>
        <div>Drag Glyphs here or shift-click to Sacrifice.</div>
        <div>The confirmation can be disabled in Options or by holding Ctrl.</div>
      </span>
    </div>
    <div v-if="hasAlteration">
      <span
        class="c-altered-glyphs-toggle-button"
        @click="toggleAlteration"
      >
        <i :class="dropDownIconClass" />
        <b> Altered Glyphs</b>
      </span>
      <br>
      <div v-if="hideAlteration">
        (Details hidden, click to unhide)
      </div>
      <div v-else>
        Glyph types will have one of their effects improved<br>
        when their Glyph type's total sacrifice value is above:
        <br><br>
        <b>
          <span :style="addStyle">{{ format(addThreshold) }} - an additional secondary effect</span>
          <br>
          <span :style="empowerStyle">{{ format(empowerThreshold) }} - formula drastically improved</span>
          <br>
          <span :style="boostStyle">{{ format(boostThreshold) }} - a boost depending on Glyph Sacrifice</span>
        </b>
        <br><br>
        All effects from Glyph Sacrifice can no longer be increased once they reach {{ format(maxSacrifice) }}.
      </div>
    </div>
    <br>
    <div class="c-sacrificed-glyphs__header">
      Glyph Sacrifice Boosts:
    </div>
    <div v-if="anySacrifices && !isDoomed">
      <div v-if="teresaMult > 1">
        Glyph sacrifice values are multiplied by {{ formatX(teresaMult, 2, 2) }};
        Teresa was last done at {{ lastMachines }}.
        <span v-if="hasSeenRealityGlyph">
          Reality Glyphs are unaffected by this multiplier and have no altered effects.
        </span>
      </div>
      <template v-for="type in types">
        <TypeSacrifice
          :key="type + glyphSymbol(type)"
          :type="type"
          :has-dragover="hasDragover"
        />
      </template>
    </div>
    <div
      v-else-if="isDoomed"
      class="pelle-current-glyph-effects"
    >
      All boosts from Glyph Sacrifice are disabled while Doomed, including changes to effects due to Altered Glyphs.
    </div>
    <div v-else>
      You haven't Sacrificed any Glyphs yet!
    </div>
  </div>
</template>

<style scoped>

</style>
