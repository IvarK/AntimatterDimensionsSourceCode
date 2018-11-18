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
      quoteLength: 0, // I'm going to add quotes to the array on certain breakpoints, so this value will change
      unlocks: []
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
      this.quoteLength = effarigQuotes.length
      this.unlocks = Object.values(Effarig.unlocks).map(id => Effarig.has(id))
    },
    nextQuote() {
      Effarig.nextQuote()
    },
    startRun() {
      Effarig.startRun()
    }
  },
  template: // Style: bottom is to align the bottom of the unlock with a specific amount, formula to get the percentage is amount^0.15 / 1e15^0.15 * 100
    `<div class="l-effarig-celestial-tab">
      <div class="o-effarig-quotes"> {{ quote }}</div><button class="o-quote-button" @click="nextQuote()" v-if="quoteIdx < quoteLength - 1">→</button>
      <div class="l-mechanics-container">
        <div class="l-effarig-unlocks">
          <div class="c-effarig-unlock" v-if="unlocks[0]" @click="startRun()">Start a new reality, all IP multipliers and TT generation is disabled. The further you get the better the reward.</div>
        </div>
        <div class="l-rm-container">
          <button class="o-primary-btn c-effarig-pour" 
            @mousedown="pour = true"
            @mouseup="pour = false"
            @mouseleave="pour = false"
          >Pour RM</button>
          <div class="c-rm-store">
            <div class="c-rm-store-inner" :style="{ height: percentage}">
              <div class="c-rm-store-label"> {{ shorten(rmMult) }}x RM gain<br>{{ shorten(rmStore) }}/{{ shorten(1e15) }}</div>
            </div>
            <div class="c-effarig-unlock-description" style="bottom: 45.169%">{{ shorten(5e12) }}: unlock Effarig's reality.</div>
          </div>
        </div>

        <div class="c-unlock-descriptions"></div>
      </div>
    </div>`
});