Vue.component("enslaved-tab", {
  data: () => ({
    isStoringBlackHole: false,
    isStoringReal: false,
    autoStoreReal: false,
    storedBlackHole: 0,
    storedReal: 0,
    storedRealEffiency: 0,
    storedRealCap: 0,
    enslavedInfinities: 0,
    unlocks: [],
    quote: "",
    quoteIdx: 0,
  }),
  computed: {
    storedRealEfficiencyDesc() {
      return Math.round((this.storedRealEffiency * 100)).toString() + "%";
    },
    storedRealCapDesc() {
      return timeDisplayShort(this.storedRealCap);
    },
    unlocksInfo() {
      return ENSLAVED_UNLOCKS;
    }
  },
  methods: {
    update() {
      this.isStoringBlackHole = player.celestials.enslaved.isStoring;
      this.storedBlackHole = player.celestials.enslaved.stored;
      this.isStoringReal = player.celestials.enslaved.isStoringReal;
      this.autoStoreReal = player.celestials.enslaved.autoStoreReal;
      this.storedReal = player.celestials.enslaved.storedReal;
      this.storedRealEffiency = Enslaved.storedRealTimeEfficiency;
      this.storedRealCap = Enslaved.storedRealTimeCap;
      this.enslavedInfinities = Enslaved.totalInfinities;
      this.unlocks = player.celestials.enslaved.unlocks;
      this.quote = Enslaved.quote;
      this.quoteIdx = player.celestials.enslaved.quoteIdx;
    },
    toggleStoreBlackHole() {
      Enslaved.toggleStoreBlackHole();
    },
    toggleStoreReal() {
      Enslaved.toggleStoreReal();
    },
    toggleAutoStoreReal() {
      Enslaved.toggleAutoStoreReal();
    },
    useStored() {
      Enslaved.useStoredTime();
    },
    timeDisplayShort(ms) {
      return timeDisplayShort(ms);
    },
    buyUnlock(info) {
      Enslaved.buyUnlock(info);
    },
    startRun() {
      Enslaved.startRun();
    },
    hasUnlock(info) {
      return Enslaved.has(info);
    },
    nextQuote() {
      Enslaved.nextQuote();
    },
    hasNextQuote() {
      return this.quoteIdx < Enslaved.maxQuoteIdx;
    }
  },
  template:
    `<div class="l-enslaved-celestial-tab">
      <div class="o-teresa-quotes"> {{ quote }}</div>
      <button class="o-quote-button" @click="nextQuote()" v-if="hasNextQuote()">→</button>
      <div class="l-enslaved-top-container">
        <div class="l-enslaved-top-container__half">
          <button :class="['o-enslaved-mechanic-button',
                           {'o-enslaved-mechanic-button--storing-time': isStoringBlackHole }]"
                  @click="toggleStoreBlackHole">
            <div class="o-enslaved-stored-time">{{ timeDisplayShort(storedBlackHole) }}</div>
            <div>{{ isStoringBlackHole ? "Storing black hole time": "Store black hole time" }}</div>
          </button>
          <button class="o-enslaved-mechanic-button" @click="useStored">Use stored black hole time</button>
        </div>
        <div class="l-enslaved-top-container__half">
          <button :class="['o-enslaved-mechanic-button',
                           {'o-enslaved-mechanic-button--storing-time': isStoringReal}]"
                  @click="toggleStoreReal">
            <div class="o-enslaved-stored-time">{{ timeDisplayShort(storedReal) }}</div>
            <div>{{ isStoringReal ? "Storing real time": "Store real time" }}</div>
          </button>
          <button :class="['o-enslaved-mechanic-button',
                           {'o-enslaved-mechanic-button--storing-time': autoStoreReal}]"
                  @click="toggleAutoStoreReal">
            <div>{{ autoStoreReal ? "Offline time stored": "Offline time used for production" }}</div>
          </button>
          <div> Efficiency: {{ storedRealEfficiencyDesc }} </div>
          <div> Maximum: {{ storedRealCapDesc }} </div>
        </div>
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