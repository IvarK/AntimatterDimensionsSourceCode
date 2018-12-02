Vue.component('effarig-tab', {
  data: function() {
    return {
      pour: false,
      time: new Date().getTime(),
      rmStore: 0,
      percentage: "",
      rmMult: 0,
      quote: "",
      quoteIdx: 0,
      unlocks: [],
      runReward: new Decimal(0)
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
      this.unlocks = Object.values(EFFARIG_UNLOCKS).map(id => Effarig.has(id))
      this.runReward = Effarig.runRewardMultiplier
    },
    nextQuote() {
      Effarig.nextQuote()
    },
    startRun() {
      Effarig.startRun()
    }
  },
  template:
    `<div class="l-effarig-celestial-tab">
      <div class="o-effarig-quotes"> {{ quote }}</div><button class="o-quote-button" @click="nextQuote()" v-if="quoteIdx < 4 + unlocks.length">→</button>
      <div class="l-mechanics-container">
        <div class="l-effarig-unlocks l-effarig-mechanic-container">
          <div class="c-effarig-unlock" v-if="unlocks[0]" @click="startRun()">Start a new reality, all IP multipliers, EP multipliers and TT generation is disabled. The further you get the better the reward.<br><br>Multiplies power gained from glyph sacrifice by {{ shorten(runReward) }}x, based on realities.</div>
        </div>
        <div class="l-rm-container l-effarig-mechanic-container">
          <button class="o-primary-btn c-effarig-pour" 
            @mousedown="pour = true"
            @mouseup="pour = false"
            @mouseleave="pour = false"
          >Pour RM</button>
          <div class="c-rm-store">
            <div class="c-rm-store-inner" :style="{ height: percentage}">
              <div class="c-rm-store-label"> {{ shorten(rmMult) }}x RM gain<br>{{ shorten(rmStore) }}/{{ shorten(1e15) }}</div>
            </div>
            <div class="c-effarig-unlock-description" id="effarig-run-description">{{ shorten(5e12) }}: unlock Effarig's reality.</div>
          </div>
        </div>

        <div class="c-unlock-descriptions l-effarig-mechanic-container"></div>
      </div>
    </div>`
});