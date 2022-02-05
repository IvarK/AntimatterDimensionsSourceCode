<script>
import { DC } from "../../../../javascripts/core/constants";
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
      addThreshold: 0,
      empowerThreshold: 0,
      boostThreshold: 0,
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
  },
  methods: {
    update() {
      this.anySacrifices = GLYPH_TYPES.some(e => player.reality.glyphs.sac[e] && player.reality.glyphs.sac[e] !== 0);
      this.hasAlteration = Ra.has(RA_UNLOCKS.ALTERED_GLYPHS);
      this.hideAlteration = player.options.hideAlterationEffects;
      this.addThreshold = GlyphAlteration.additionThreshold;
      this.empowerThreshold = GlyphAlteration.empowermentThreshold;
      this.boostThreshold = GlyphAlteration.boostingThreshold;
      this.maxSacrifice = GlyphSacrificeHandler.maxSacrificeForEffects;
      this.teresaMult = Teresa.runRewardMultiplier;
      this.lastMachinesTeresa.copyFrom(player.celestials.teresa.lastRepeatedMachines);
    },
    dragover(event) {
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      event.preventDefault();
      this.hasDragover = true;
    },
    dragleave(event) {
      if (
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
      if (!event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) return;
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      GlyphSacrificeHandler.sacrificeGlyph(glyph, true);
      this.hasDragover = false;
    },
    toggleAlteration() {
      player.options.hideAlterationEffects = !player.options.hideAlterationEffects;
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
      <div>Drag Glyphs here or shift-click to Sacrifice.</div>
      <div>The confirmation can be disabled in Options or by holding Ctrl.</div>
    </div>
    <div v-if="hasAlteration">
      <span @click="toggleAlteration">
        <b>Altered Glyphs</b>
        <i :class="dropDownIconClass" />
      </span>
      <br>
      <div v-if="hideAlteration">
        (Details hidden, click to unhide)
      </div>
      <div v-else>
        Glyph types will have one of their effects improved<br>
        when their glyph type's total sacrifice value is above:
        <br><br>
        {{ format(addThreshold) }} - an additional secondary effect<br>
        {{ format(empowerThreshold) }} - formula drastically improved<br>
        {{ format(boostThreshold) }} - a boost depending on Glyph Sacrifice
        <br><br>
        All effects from Glyph Sacrifice can no longer be increased once they reach {{ format(maxSacrifice) }}.
      </div>
    </div>
    <br>
    <div class="c-sacrificed-glyphs__header">
      Glyph Sacrifice Boosts:
    </div>
    <div v-if="teresaMult > 1">
      Glyph sacrifice values are multiplied by {{ formatX(teresaMult, 2, 2) }};
      Teresa was last done at {{ lastMachines }}.
    </div>
    <div v-if="anySacrifices">
      <template v-for="type in types">
        <TypeSacrifice
          :key="type"
          :type="type"
          :has-dragover="hasDragover"
        />
      </template>
    </div>
    <div v-else>
      You haven't Sacrificed any Glyphs yet!
    </div>
  </div>
</template>

<style scoped>

</style>
