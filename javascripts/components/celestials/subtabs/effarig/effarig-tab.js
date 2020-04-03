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
            <div v-for="description in descriptionLines">
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
      quoteIdx: 0,
      isRunning: false,
      vIsFlipped: false
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
        ? `All dimension multipliers, gamespeed, and tickspeed are severely lowered, like dilation. Infinity power
          reduces the production and gamespeed penalties and time shards reduce the tickspeed penalty. Glyph levels
          are temporarily capped to ${Effarig.glyphLevelCap}, rarity is unaffected.`
        : `Start Effarig's Reality; all dimension multipliers, gamespeed, and tickspeed are severely lowered, like
          dilation. Infinity power reduces the production and gamespeed penalties and time shards reduce the tickspeed
          penalty. Glyph levels are temporarily capped, rarity is unaffected.`;
    }
  },
  methods: {
    update() {
      this.relicShards = player.celestials.effarig.relicShards;
      this.shardRarityBoost = Effarig.maxRarityBoost;
      this.shardsGained = Effarig.shardsGained;
      this.quote = Effarig.quote;
      this.quoteIdx = player.celestials.effarig.quoteIdx;
      this.runUnlocked = EffarigUnlock.run.isUnlocked;
      this.isRunning = Effarig.isRunning;
      this.vIsFlipped = V.isFlipped;
    },
    startRun() {
      resetReality();
      Effarig.initializeRun();
    },
    createCursedGlyph() {
      if (Glyphs.freeInventorySpace === 0) {
        Modal.message.show("Inventory cannot hold new glyphs. Delete/sacrifice (shift-click) some glyphs.");
        return;
      }
      const cursedCount = player.reality.glyphs.active
        .concat(player.reality.glyphs.inventory)
        .filter(g => g !== null && g.type === "cursed")
        .length;
      if (cursedCount >= 5) {
        GameUI.notify.error("You don't need any more cursed glyphs!");
      } else {
        Glyphs.addToInventory(GlyphGenerator.cursedGlyph());
        GameUI.notify.error("Created a cursed glyph");
      }
      this.emitClose();
    }
  },
  template:
    `<div class="l-teresa-celestial-tab">
      <celestial-quote-history celestial="effarig"/>
      <div class="c-effarig-relics">
        You have {{ format(relicShards, 2, 0) }} Relic Shards, which increases <br>
        the rarity of new glyphs by up to +{{ format(shardRarityBoost, 2, 2) }}%.
      </div>
      <div class="c-effarig-relic-description">
        You will gain {{ format(shardsGained, 2, 0) }} Relic Shards next reality. More EP slightly increases <br>
        shards gained. More distinct glyph effects significantly increases shards gained.
      </div>
      <div class="l-effarig-shop-and-run">
        <div class="l-effarig-shop">
          <effarig-unlock-button
           v-for="(unlock, i) in shopUnlocks"
           :key="i"
           :unlock="unlock" />
          <effarig-unlock-button v-if="!runUnlocked" :unlock="runUnlock" />
          <button class="o-effarig-shop-button" @click="createCursedGlyph" v-if="vIsFlipped">
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
