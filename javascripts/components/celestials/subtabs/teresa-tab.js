Vue.component('teresa-tab', {
  data: function() {
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
      runReward: 0,
      glyphUpg: {
        cost: 1,
        mult: 1
      },
      rmUpg: 1, // Cost and mult are the same
      pp: 0
    };
  },
  computed: {
    unlockInfo: () => Teresa.unlockInfo,
    rmStoreMax: () => Teresa.rmStoreMax,
  },
  methods: {
    update() {
      let now = new Date().getTime()
      if (this.pour) {
        let diff = (now - this.time)/1000
        Teresa.pourRM(diff)
      }
      this.time = now
      this.rmStore = player.celestials.teresa.rmStore
      this.percentage = (Teresa.fill * 100) + "%"
      this.rmMult = Teresa.rmMultiplier
      this.quote = Teresa.quote
      this.quoteIdx = player.celestials.teresa.quoteIdx
      this.unlocks = Object.values(TERESA_UNLOCKS).map(info => Teresa.has(info)).filter((x) => x)
      this.runReward = Teresa.runRewardMultiplier,
      this.glyphUpg.cost = Math.pow( 2, Math.log(player.celestials.teresa.glyphLevelMult) / Math.log(1.05) )
      this.glyphUpg.mult = player.celestials.teresa.glyphLevelMult
      this.rmUpg = player.celestials.teresa.rmMult
      this.dtBulk = player.celestials.teresa.dtBulk
      this.pp = player.reality.pp
      this.rm = player.reality.realityMachines
    },
    nextQuote() {
      Teresa.nextQuote()
    },
    startRun() {
      Teresa.startRun()
    },
    buyRmMult() {
      Teresa.buyRmMult()
    },
    buyGlyphMult() {
      Teresa.buyGlyphLevelPower()
    },
    buyDtBulk() {
      Teresa.buyDtBulk()
    },
    unlockDescriptionStyle: function(unlockInfo) {
      let maxPrice = Teresa.unlockInfo[Teresa.lastUnlock].price;
      let pos = Math.log1p(unlockInfo.price) / Math.log1p(maxPrice) * 100;
      return {
         bottom: pos.toFixed(2) + "%",
      };
    },
  },
  template:
    `<div class="l-teresa-celestial-tab">
      <div class="o-teresa-quotes"> {{ quote }}</div><button class="o-quote-button" @click="nextQuote()" v-if="quoteIdx < 4 + unlocks.length">→</button>
      <div>You have {{shortenRateOfChange(rm)}} Reality Machines.</div>
      <div class="l-mechanics-container">
        <div class="l-teresa-unlocks l-teresa-mechanic-container">
          <div class="c-teresa-unlock c-teresa-run-button" v-if="unlocks[0]" @click="startRun()">Start a new reality. TT generation is disabled and you gain less IP and EP (x^0.6). The further you get the better the reward.<br><br>Multiplies power gained from glyph sacrifice by {{ shortenRateOfChange(runReward) }}x, based on realities.</div>
          <div class="c-teresa-unlock" v-if="unlocks[1]">You gain 1% of your peaked EP/min every second.</div>
          <div class="c-teresa-unlock" v-if="unlocks[2]">The container no longer leaks.</div>
          <div class="c-teresa-shop" v-if="unlocks[3]">
            <span class="o-teresa-pp"> You have {{ shorten(pp, 2, 2) }} Perk Points.</span>
            <button class="o-teresa-shop-button" @click="buyGlyphMult()">Glyph levels are 5% bigger.<br>Currently {{ shortenRateOfChange(glyphUpg.mult )}}x, Costs: {{ shortenCosts(glyphUpg.cost) }} PP</button>
            <button class="o-teresa-shop-button" @click="buyRmMult()">Gain 2 times more RM.<br>Currently {{ shortenRateOfChange(rmUpg ) }}x, Costs: {{ shortenCosts(rmUpg) }} PP</button>
            <button class="o-teresa-shop-button" @click="buyDtBulk()">Bulk buy 2 times more DT upgrades at once.<br>Currently {{ shortenRateOfChange(dtBulk ) }}x, Costs: {{ shortenCosts(dtBulk * 100) }} PP</button>
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
              <div class="c-rm-store-label"> {{ shortenRateOfChange(rmMult) }}x RM gain<br>{{ shortenRateOfChange(rmStore) }}/{{ shortenRateOfChange(rmStoreMax) }}</div>
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
