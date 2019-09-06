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
      const sumOfOtherAlchemyResources = AlchemyResources.all
        .filter(r => r !== AlchemyResource.reality)
        .map(r => r.amount)
        .sum();
      const highestLevelGlyph = player.reality.glyphs.active
        .concat(player.reality.glyphs.inventory)
        .map(glyph => glyph.level)
        .max();
      return [
        {
          desc: `At least ${shortenSmallInteger(5000)} Reality consumed for this glyph (Currently ` +
            `${shortenSmallInteger(AlchemyResource.reality.amount)})`,
          value: AlchemyResource.reality.amount >= 5000
        },
        {
          desc: `${shortenSmallInteger(150000)} total of all other alchemy resources (Currently ` +
            `${shortenSmallInteger(sumOfOtherAlchemyResources)})`,
          value: sumOfOtherAlchemyResources >= 150000
        },
        {
          desc: `${shorten(1e50, 0, 0)} relic shards (Currently ` +
            `${shorten(player.celestials.effarig.relicShards, 2, 2)})`,
          value: player.celestials.effarig.relicShards >= 1e50
        },
        {
          desc: `A glyph with a level of at least ${shortenSmallInteger(12000)}, which is not consumed (highest: ` +
            `${shortenSmallInteger(highestLevelGlyph)})`,
          value: highestLevelGlyph >= 12000
        }
      ];
    },
    createRealityGlyph() {
      if (!Player.hasFreeInventorySpace) {
        Modal.message.show("Inventory is full. Delete/sacrifice (shift-click) some glyphs.");
        return;
      }
      Glyphs.addToInventory(GlyphGenerator.realityGlyph(
        { actualLevel: this.realityGlyphLevel, rawLevel: this.realityGlyphLevel }, this.selectedEffects));
      AlchemyResources.resetAmount();
      // If the player leaves a choice open, don't spend shards
      if (player.celestials.effarig.relicShards >= 1e50 && (this.selectedEffects === this.calculateMaxEffects())) {
        player.celestials.effarig.relicShards -= 1e50;
      }
    },
    formatGlyphEffect(effect) {
      const config = GameDatabase.reality.glyphEffects[effect];
      const value = config.effect(this.realityGlyphLevel, rarityToStrength(100));
      const effectTemplate = typeof config.singleDesc === "function"
        ? config.singleDesc()
        : config.singleDesc;
      const effectText = effectTemplate
        .replace("{value}", config.formatEffect(value))
        .replace("[", "")
        .replace("]", "");
      if (config.conversion === undefined) return effectText;
      return effectText.replace("{value2}", config.formatEffect(config.conversion(value)));
    }
  },
  template: `
    <div class="c-alchemy-resource-info">
      <div>  
        Create a level {{ shortenSmallInteger(realityGlyphLevel) }} reality glyph. Rarity will always be 100% and level
        is unaffected by the glyph level cap. This will reset all alchemy resources.
      </div><br>
      <div>
        Reality glyphs always have {{ shortenSmallInteger(4) }} effects picked from any of the
        {{ shortenSmallInteger(5) }} basic glyph types; you can choose up to {{ shortenSmallInteger(maxEffects) }},
        based on how many of the below requirements you meet. The rest of the effects, if any, are chosen randomly.
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
