"use strict";

Vue.component('effarig-tab', {
  components: {
    "run-unlock-reward": {
      props: {
        unlock: Object
      },
      data: function() {
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
      template: /*html*/`
        <div class="l-effarig-tab__reward">
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
  data: function() {
    return {
      relicShards: 0,
      shardsGained: 0,
      autosacrificeUnlocked: false,
      adjusterUnlocked: false,
      autopickerUnlocked: false,
      runUnlocked: false,
      quote: "",
      quoteIdx: 0,
      isRunning: false,
    };
  },
  computed: {
    shopUnlocks: () => [
      EffarigUnlock.adjuster,
      EffarigUnlock.autosacrifice,
      EffarigUnlock.autopicker
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
        ? "You are in Effarig's Reality - give up?"
        : `Start Effarig's Reality; all production, gamespeed, and tickspeed are severely lowered,
          infinity power reduces the production and gamespeed penalties and time shards reduce the 
          tickspeed penalty. Glyph levels are temporarily capped.`;
    }
  },
  methods: {
    update() {
      this.relicShards = player.celestials.effarig.relicShards;
      this.shardsGained = Effarig.shardsGained;
      this.quote = Effarig.quote;
      this.quoteIdx = player.celestials.effarig.quoteIdx;
      this.runUnlocked = EffarigUnlock.run.isUnlocked;
      this.autosacrificeUnlocked = EffarigUnlock.autosacrifice.isUnlocked;
      this.adjusterUnlocked = EffarigUnlock.adjuster.isUnlocked;
      this.autopickerUnlocked = EffarigUnlock.autopicker.isUnlocked;
      this.isRunning = Effarig.isRunning;
    },
    startRun() {
      if (!this.isRunning) Effarig.startRun();
      else startRealityOver();
    },
    nextQuote() {
      Effarig.nextQuote()
    },
    hasNextQuote() {
      return this.quoteIdx < Effarig.maxQuoteIdx
    }
  },
  template:
    `<div class="l-effarig-celestial-tab">
      <div class="o-teresa-quotes"> {{ quote }}</div><button class="o-quote-button" @click="nextQuote()" v-if="hasNextQuote()">→</button>
      <div class="c-effarig-relics">You have {{ shortenRateOfChange(relicShards) }} Relic Shards.</div>
      <div class="c-effarig-relic-description">You will gain {{ shortenRateOfChange(shardsGained) }} Shards next reality, based on different kinds of glyph effects you have equipped and EP.</div>
      <div class="l-effarig-shop-and-run">
        <div class="l-effarig-shop">
          <effarig-unlock-button
           v-for="(unlock, i) in shopUnlocks"
           :key="i"
           :unlock="unlock" />
          <effarig-unlock-button v-if="!runUnlocked" :unlock="runUnlock" />
        </div>
        <div v-if="runUnlocked" class="l-effarig-run">
          <div class="c-effarig-run-description">{{runDescription}}</div>
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