"use strict";

Vue.component("effarig-tab", {
  components: {
    "run-unlock-reward": {
      props: {
        unlock: Object
      },
      data() {
        return {
          isUnlocked: false
        };
      },
      computed: {
        descriptionLines() {
          return this.unlock.config.description.split("\n");
        },
        symbol: () => GLYPH_SYMBOLS.effarig,
      },
      methods: {
        update() {
          this.isUnlocked = this.unlock.isUnlocked;
        }
      },
      template:
        `<div class="l-effarig-tab__reward">
          <div class="c-effarig-tab__reward-label">{{ unlock.config.label }}: </div>
          <div v-if="isUnlocked" class="l-effarig-tab__reward-descriptions">
            <div v-for="description in descriptionLines" class="c-effarig-tab__reward-description">
              <span class="c-effarig-tab__reward-symbol">{{symbol}}</span>{{description}}
            </div>
          </div>
          <span v-else class="c-effarig-tab__reward-symbol">?</span>
        </div>
      `
    }
  },
  data() {
    return {
      relicShards: 0,
      shardRarityBoost: 0,
      shardsGained: 0,
      runUnlocked: false,
      quote: "",
      isRunning: false,
      vIsFlipped: false,
      relicShardRarityAlwaysMax: false
    };
  },
  computed: {
    shopUnlocks: () => [
      EffarigUnlock.adjuster,
      EffarigUnlock.basicFilter,
      EffarigUnlock.advancedFilter
    ],
    runUnlock: () => EffarigUnlock.run,
    runUnlocks: () => [
      EffarigUnlock.infinity,
      EffarigUnlock.eternity,
      EffarigUnlock.reality
    ],
    symbol: () => GLYPH_SYMBOLS.effarig,
    runButtonOuterClass() {
      return this.isRunning ? "c-effarig-run-button--running" : "c-effarig-run-button--not-running";
    },
    runButtonInnerClass() {
      return this.isRunning ? "c-effarig-run-button__inner--running" : "c-effarig-run-button__inner--not-running";
    },
    runDescription() {
      return this.isRunning
        ? `All dimension multipliers, gamespeed, and tickspeed are severely lowered, like Dilation. Infinity power
          reduces the production and gamespeed penalties and Time Shards reduce the tickspeed penalty. Glyph levels
          are temporarily capped to ${Effarig.glyphLevelCap}, rarity is unaffected. You will exit Effarig's Reality
          when you complete a Layer of it for the first time.`
        : `Start Effarig's Reality; all dimension multipliers, gamespeed, and tickspeed are severely lowered, like
          Dilation. Infinity power reduces the production and gamespeed penalties and Time Shards reduce the tickspeed
          penalty. Glyph levels are temporarily capped, rarity is unaffected. You will exit Effarig's Reality when you
          complete a Layer of it for the first time.`;
    }
  },
  methods: {
    update() {
      this.relicShards = player.celestials.effarig.relicShards;
      this.shardRarityBoost = Effarig.maxRarityBoost;
      this.shardsGained = Effarig.shardsGained;
      this.quote = Effarig.quote;
      this.runUnlocked = EffarigUnlock.run.isUnlocked;
      this.isRunning = Effarig.isRunning;
      this.vIsFlipped = V.isFlipped;
      this.relicShardRarityAlwaysMax = Ra.has(RA_UNLOCKS.EXTRA_CHOICES_AND_RELIC_SHARD_RARITY_ALWAYS_MAX);
    },
    startRun() {
      if (!resetReality()) return;
      Effarig.initializeRun();
    },
    createCursedGlyph() {
      if (Glyphs.freeInventorySpace === 0) {
        Modal.message.show("Inventory cannot hold new glyphs. Sacrifice (shift-click) some glyphs.");
        return;
      }
      const cursedCount = player.reality.glyphs.active
        .concat(player.reality.glyphs.inventory)
        .filter(g => g !== null && g.type === "cursed")
        .length;
      if (cursedCount >= 5) {
        GameUI.notify.error(`You don't need more than ${format(5)} cursed glyphs!`);
      } else {
        Glyphs.addToInventory(GlyphGenerator.cursedGlyph());
        GameUI.notify.error("Created a cursed glyph");
      }
      this.emitClose();
    }
  },
  template: `
    <div class="l-teresa-celestial-tab">
      <celestial-quote-history celestial="effarig"/>
      <div class="l-effarig-shop-and-run">
        <div class="l-effarig-shop">
          <div class="c-effarig-relics">
            You have {{ format(relicShards, 2, 0) }} Relic Shards, which increases <br>
            the rarity of new glyphs by {{ relicShardRarityAlwaysMax ? "" : "up to" }}
            +{{ format(shardRarityBoost, 2, 2) }}%.
          </div>
          <div class="c-effarig-relic-description">
            You will gain {{ format(shardsGained, 2, 0) }} Relic Shards next Reality. More Eternity Points <br>
            slightly increases Relic Shards gained. More distinct glyph <br>
            effects significantly increases Relic Shards gained.
          </div>
          <effarig-unlock-button
           v-for="(unlock, i) in shopUnlocks"
           :key="i"
           :unlock="unlock" />
          <effarig-unlock-button v-if="!runUnlocked" :unlock="runUnlock" />
          <button
            class="c-effarig-shop-button c-effarig-shop-button--available"
            @click="createCursedGlyph"
            v-if="vIsFlipped"
            >
            Get a cursed glyph...
          </button>
        </div>
        <div v-if="runUnlocked" class="l-effarig-run">
          <div class="c-effarig-run-description">
            <div v-if="isRunning">
              You are in Effarig's Reality - give up?
            </div><br>
          {{runDescription}}
          </div>
          <div :class="['l-effarig-run-button', 'c-effarig-run-button', runButtonOuterClass]"
               @click="startRun">
            <div :class="runButtonInnerClass" :button-symbol="symbol">{{symbol}}</div>
          </div>
          <run-unlock-reward v-for="(unlock, i) in runUnlocks"
                             :key="i"
                             :unlock="unlock" />
        </div>
      </div>
    </div>`
});
