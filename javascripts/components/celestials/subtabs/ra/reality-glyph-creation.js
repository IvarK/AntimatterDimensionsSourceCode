"use strict";

Vue.component("reality-glyph-creation", {
  data() {
    return {
      realityGlyphLevel: 0,
      possibleEffects: [],
      selectedEffects: [],
      maxEffects: 0,
      effectCriteria: []
    };
  },
  methods: {
    update() {
      this.realityGlyphLevel = AlchemyResource.reality.effectValue;
      this.possibleEffects = orderedEffectList.filter(effect => !effect.match("effarig*"));
      this.maxEffects = this.calculateMaxEffects();
      this.effectCriteria = this.effectCriteriaList();
    },
    calculateMaxEffects() {
      return this.effectCriteriaList().filter(c => c.value).length;
    },
    effectCriteriaList() {
      return [
        {
          desc: `At least ${shortenSmallInteger(5000)} Reality consumed for this glyph (Currently ` +
            `${AlchemyResource.reality.amount.toFixed(1)})`,
          value: AlchemyResource.reality.amount >= 5000
        },
        {
          desc: `${shortenSmallInteger(150000)} total of all other alchemy resources (Currently ` +
            `${this.sumOfOtherAlchemyResources().toFixed(1)})`,
          value: this.sumOfOtherAlchemyResources() >= 150000
        },
        {
          desc: `${shorten(1e30, 0, 0)} relic shards (Currently ` +
            `${shorten(player.celestials.effarig.relicShards, 2, 2)})`,
          value: player.celestials.effarig.relicShards >= 1e30
        },
        {
          desc: `A glyph with a level of at least ${shortenSmallInteger(12000)}, which is not consumed (highest: ` +
            `${shortenSmallInteger(this.highestLevelGlyph())})`,
          value: this.highestLevelGlyph() >= 12000
        }
      ];
    },
    sumOfOtherAlchemyResources() {
      return AlchemyResources.all
        .filter(r => r.name !== "Reality")
        .map(r => r.amount)
        .sum();
    },
    highestLevelGlyph() {
      return player.reality.glyphs.active
        .concat(player.reality.glyphs.inventory)
        .map(glyph => glyph.level)
        .max();
    },
    createRealityGlyph() {
      if (!Player.hasFreeInventorySpace) {
        alert("Inventory is full. Delete/sacrifice (shift-click) some glyphs.");
        return;
      }
      Glyphs.addToInventory(GlyphGenerator.realityGlyph(
        { actualLevel: this.realityGlyphLevel, rawLevel: this.realityGlyphLevel }, this.selectedEffects));
      Ra.resetAlchemyResources();
      if (player.celestials.effarig.relicShards >= 1e30) {
        player.celestials.effarig.relicShards -= 1e30;
      }
    },
    formatGlyphEffect(effect) {
      const config = GameDatabase.reality.glyphEffects[effect];
      const value = config.effect(this.realityGlyphLevel, rarityToStrength(100));
      return config.singleDesc
        .replace("{value}", config.formatEffect(value))
        .replace("<br>", "");
    }
  },
  template: `
    <div class="c-alchemy-resource-info">
      <div>  
        Create a level {{ shortenSmallInteger(realityGlyphLevel) }} reality glyph.  Rarity will always be 100% and level
        is unaffected by the glyph level cap.  This will reset all alchemy resources.
      </div><br>
      <div>
        Reality glyphs always have 4 effects picked from any of the 5 basic glyph types; you can choose up to
        {{ maxEffects }}, based on how many of the below requirements you meet.  The rest of the effects, if any, are
        chosen randomly.
        <div v-for="criterion in effectCriteria">
          <span v-if="criterion.value">+</span>
          <span v-else>-</span>
          {{ criterion.desc }}
        </div><br>
      </div>
      <div>
        Possible Effects:
      </div>
      <div v-for="effect in possibleEffects">
        <input type="checkbox"
          :value="effect"
          :disabled="selectedEffects.length >= maxEffects && !selectedEffects.includes(effect)"
          v-model="selectedEffects">
        {{ formatGlyphEffect(effect) }}
      </div><br>
      <div id="example-1">
        <button v-on:click="createRealityGlyph()">Create a Reality glyph!</button>
      </div>
    </div>`,
});
