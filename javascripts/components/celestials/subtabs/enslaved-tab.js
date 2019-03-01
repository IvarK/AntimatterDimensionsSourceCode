Vue.component('enslaved-tab', {
  data: function() {
    return {
      isStoring: false,
      stored: 0,
      enslavedInfinities: 0,
      unlocks: [],
      quote: "",
      quoteIdx: 0,
    };
  },
  methods: {
    update() {
      this.isStoring = player.celestials.enslaved.isStoring
      this.stored = player.celestials.enslaved.stored
      this.enslavedInfinities = Enslaved.totalInfinities
      this.unlocks = player.celestials.enslaved.unlocks
      this.quote = Enslaved.quote
      this.quoteIdx = player.celestials.enslaved.quoteIdx
    },
    toggleStore() {
      Enslaved.toggleStore()
    },
    useStored() {
      Enslaved.useStoredTime()
    },
    timeDisplayShort(ms) {
      return timeDisplayShort(ms)
    },
    buyUnlock(info) {
      Enslaved.buyUnlock(info)
    },
    startRun() {
      Enslaved.startRun()
    },
    hasUnlock(info) {
      return Enslaved.has(info)
    },
    nextQuote() {
      Enslaved.nextQuote()
    },
    hasNextQuote() {
      return this.quoteIdx < Enslaved.maxQuoteIdx
    }
  },
  computed: {
    unlocksInfo() {
      return ENSLAVED_UNLOCKS
    }
  },
  template:
    `<div class="l-enslaved-celestial-tab">
      <div class="o-teresa-quotes"> {{ quote }}</div><button class="o-quote-button" @click="nextQuote()" v-if="hasNextQuote()">→</button>
      <div class="l-enslaved-top-container">
        <div class="o-enslaved-stored-time"> You have {{ timeDisplayShort(stored) }} stored</div>
        <button class="o-enslaved-mechanic-button" :class="{'o-enslaved-mechanic-button--storing-time': isStoring}" @click="toggleStore">{{ isStoring ? "Storing black hole time": "Store black hole time" }}</button>
        <button class="o-enslaved-mechanic-button" @click="useStored">Use all stored time in a single tick</button>
      </div>
      <div class="l-enslaved-shop-container">
        <button 
          v-for="unlock in unlocksInfo" 
          :key="unlock.id" 
          class="o-enslaved-shop-button" 
          @click="buyUnlock(unlock)"> {{ unlock.description }} <br> Costs: {{ timeDisplayShort(unlock.price) }}</button>
      </div>
      <div class="l-enslaved-unlocks-container" v-if="hasUnlock(unlocksInfo.RUN)">
        <button class="o-enslaved-run-button" @click="startRun">
          Start Enslaved One's Reality.<br>IDs, TDs, IP multipliers other than the 2x multiplier, and EP multipliers other than the 5x multiplier are disabled, but you gain a 3rd black hole. You also gain a bonus to dilated time production
          based on infinities gained in the last 10 seconds (real time).
        </button>
        <div class="o-enslaved-gained-infinities">You have gained <b>{{ shorten(enslavedInfinities) }}</b> infinities in the last 10 seconds.</div>
      </div>
    </div>`
});