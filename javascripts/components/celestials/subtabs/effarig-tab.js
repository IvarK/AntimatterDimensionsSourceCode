Vue.component('effarig-tab', {
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
      runReward: new Decimal(0),
      glyphUpg: {
        cost: 1,
        mult: 1
      },
      rmUpg: 1, // Cost and mult are the same
      pp: 0
    };
  },
  methods: {
    update() {
      let now = new Date().getTime()
      if (this.pour) {
        let diff = (now - this.time)/1000
        Effarig.pourRM(diff)
      }
      this.time = now
      this.rmStore = player.celestials.effarig.rmStore
      this.percentage = (Effarig.fill * 100) + "%"
      this.rmMult = Effarig.rmMultiplier
      this.quote = Effarig.quote
      this.quoteIdx = player.celestials.effarig.quoteIdx
      this.unlocks = Object.values(EFFARIG_UNLOCKS).map(id => Effarig.has(id)).filter((x) => x)
      this.runReward = Effarig.runRewardMultiplier,
      this.glyphUpg.cost = Math.pow( 2, Math.log(player.celestials.effarig.glyphLevelMult) / Math.log(1.05) )
      this.glyphUpg.mult = player.celestials.effarig.glyphLevelMult
      this.rmUpg = player.celestials.effarig.rmMult
      this.pp = player.reality.pp
      this.rm = player.reality.realityMachines
    },
    nextQuote() {
      Effarig.nextQuote()
    },
    startRun() {
      Effarig.startRun()
    },
    buyRmMult() {
      Effarig.buyRmMult()
    },
    buyGlyphMult() {
      Effarig.buyGlyphLevelPower()
    }
  },
  template:
    `<div class="l-effarig-celestial-tab">
      <div class="o-effarig-quotes"> {{ quote }}</div><button class="o-quote-button" @click="nextQuote()" v-if="quoteIdx < 4 + unlocks.length">→</button>
      <div>You have {{shorten(rm)}} Reality Machines.</div>
      <div class="l-mechanics-container">
        <div class="l-effarig-unlocks l-effarig-mechanic-container">
          <div class="c-effarig-unlock c-effarig-run-button" v-if="unlocks[0]" @click="startRun()">Start a new reality, all IP multipliers, EP multipliers and TT generation is disabled. The further you get the better the reward.<br><br>Multiplies power gained from glyph sacrifice by {{ shorten(runReward) }}x, based on realities.</div>
          <div class="c-effarig-unlock" v-if="unlocks[1]">You gain 1% of your peaked EP/min every second.</div>
          <div class="c-effarig-unlock" v-if="unlocks[2]">The container no longer leaks.</div>
          <div class="c-effarig-shop" v-if="unlocks[3]">
            <span class="o-effarig-pp"> You have {{ pp }} Perk Points.</span>
            <button class="o-effarig-shop-button" @click="buyGlyphMult()">Glyph levels are 5% bigger.<br>Currently {{ shorten(glyphUpg.mult )}}x, Costs: {{ shortenCosts(glyphUpg.cost) }} PP</button>
            <button class="o-effarig-shop-button" @click="buyRmMult()">Gain 2 times more RM.<br>Currently {{ shorten(rmUpg ) }}x, Costs: {{ shortenCosts(rmUpg) }} PP</button>
          </div>
        </div>
        <div class="l-rm-container l-effarig-mechanic-container">
          <button class="o-primary-btn c-effarig-pour" 
            @mousedown="pour = true"
            @mouseup="pour = false"
            @mouseleave="pour = false"
          >Pour RM</button>
          <div class="c-rm-store">
            <div class="c-rm-store-inner" :style="{ height: percentage}">
              <div class="c-rm-store-label"> {{ shorten(rmMult) }}x RM gain<br>{{ shorten(rmStore) }}/{{ shorten(1e24) }}</div>
            </div>
            <div class="c-effarig-unlock-description" id="effarig-run-description">{{ shorten(5e12) }}: unlock Effarig's reality.</div>
            <div class="c-effarig-unlock-description" id="effarig-epgen-description">{{ shorten(1e15) }}: unlock Effarig's EP generation.</div>
            <div class="c-effarig-unlock-description" id="effarig-teresa-description">{{ shorten(1e18) }}: unlock Teresa, Celestial of Glyphs.</div>
            <div class="c-effarig-unlock-description" id="effarig-shop-description">{{ shorten(1e24) }}: unlock Perk Point Shop.</div>
          </div>
        </div>

        <div class="c-unlock-descriptions l-effarig-mechanic-container"></div>
      </div>
    </div>`
});