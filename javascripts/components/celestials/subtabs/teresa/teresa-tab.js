"use strict";

Vue.component("teresa-tab", {
  data() {
    return {
      pour: false,
      time: new Date().getTime(),
      rmStore: 0,
      rm: new Decimal(0),
      percentage: "",
      rmMult: 0,
      quote: "",
      quoteIdx: 0,
      unlocks: [],
      bestAM: new Decimal(0),
      runReward: 0,
      pp: 0,
      leakRate: 0
    };
  },
  computed: {
    unlockInfo: () => Teresa.unlockInfo,
    rmStoreMax: () => Teresa.rmStoreMax,
    upgrades() {
      return [
          PerkShopUpgrade.glyphLevel,
          PerkShopUpgrade.rmMult,
          PerkShopUpgrade.bulkDilation,
          PerkShopUpgrade.musicGlyph
      ];
    }
  },
  methods: {
    update() {
      const now = new Date().getTime();
      if (this.pour) {
        const diff = (now - this.time) / 1000;
        Teresa.pourRM(diff);
      }
      this.time = now;
      this.rmStore = player.celestials.teresa.rmStore;
      this.percentage = formatPercents(Teresa.fill, 2);
      this.rmMult = Teresa.rmMultiplier;
      this.quote = Teresa.quote;
      this.quoteIdx = player.celestials.teresa.quoteIdx;
      this.unlocks = Object.values(TERESA_UNLOCKS).map(info => Teresa.has(info)).filter(x => x);
      this.bestAM.copyFrom(player.celestials.teresa.bestRunAM);
      this.runReward = Teresa.runRewardMultiplier;
      this.pp = player.reality.pp;
      this.rm.copyFrom(player.reality.realityMachines);
      this.leakRate = this.unlocks[2] ? 0 : this.rmStore * (1 - Math.pow(0.98, 1 / 60));
    },
    nextQuote() {
      Teresa.nextQuote();
    },
    startRun() {
      Teresa.startRun();
    },
    unlockDescriptionStyle(unlockInfo) {
      const maxPrice = Teresa.unlockInfo[Teresa.lastUnlock].price;
      const pos = Math.log1p(unlockInfo.price) / Math.log1p(maxPrice);
      return {
         bottom: formatPercents(pos, 2),
      };
    },
  },
  template:
    `<div class="l-teresa-celestial-tab">
      <div class="o-teresa-quotes"> {{ quote }}</div><button class="o-quote-button" @click="nextQuote()" v-if="quoteIdx < 4 + unlocks.length">→</button>
      <div>You have {{shortenRateOfChange(rm)}} {{"Reality Machine" | pluralize(rm)}}.</div>
      <div class="l-mechanics-container">
        <div class="l-teresa-unlocks l-teresa-mechanic-container">
          <div class="c-teresa-unlock c-teresa-run-button" v-if="unlocks[0]" @click="startRun()">
            Start Teresa's Reality. Glyph TT generation is disabled and you gain less IP and EP (x^0.55).
            <br><br>
            Highest antimatter in Teresa's Reality: {{ shorten(bestAM, 2, 0) }}
          </div>
          <div class="c-teresa-unlock" v-if="unlocks[0]">
            Teresa Reality reward: Glyph sacrifice power {{ formatX(runReward, 2, 2) }}
          </div>
          <div class="c-teresa-unlock" v-if="unlocks[1]">You gain 1% of your peaked EP/min every second.</div>
          <div class="c-teresa-unlock" v-if="unlocks[2]">The container no longer leaks.</div>
          <div class="c-teresa-shop" v-if="unlocks[3]">
            <span class="o-teresa-pp"> You have {{ shorten(pp, 2, 0) }} {{"Perk Point" | pluralize(pp)}}.</span>
            <perk-shop-upgrade
              v-for="upgrade in upgrades"
              :key="upgrade.id"
              :upgrade="upgrade"
            />
          </div>
        </div>
        <div class="l-rm-container l-teresa-mechanic-container">
          <button class="o-primary-btn c-teresa-pour" 
            @mousedown="pour = true"
            @touchstart="pour = true"
            @mouseup="pour = false"
            @touchend="pour = false"
            @mouseleave="pour = false"
          >Pour RM</button>
          <div class="c-rm-store">
            <div class="c-rm-store-inner" :style="{ height: percentage}">
              <div class="c-rm-store-label"> {{ shortenRateOfChange(rmMult) }}x RM gain
                <br>{{ shortenRateOfChange(rmStore) }}/{{ shortenRateOfChange(rmStoreMax) }}
                <br v-if="leakRate > 0">Leaking {{ shorten(leakRate, 2, 2) }} RM/s</div>
            </div>
            <div v-for="unlockInfo in unlockInfo" class="c-teresa-unlock-description" :style="unlockDescriptionStyle(unlockInfo)" :id="unlockInfo.id">
              {{ shortenRateOfChange(unlockInfo.price) }}: {{ unlockInfo.description }}
            </div>
          </div>
        </div>
        <div class="c-unlock-descriptions l-teresa-mechanic-container"></div>
      </div>
    </div>`
});
