"use strict";

Vue.component("enslaved-tab", {
  data: () => ({
    isStoringBlackHole: false,
    isStoringReal: false,
    autoStoreReal: false,
    hasAmplifyStoredReal: false,
    canAdjustStoredTime: false,
    storedFraction: 0,
    inEnslaved: false,
    completed: false,
    storedBlackHole: 0,
    storedReal: 0,
    storedRealEffiency: 0,
    storedRealCap: 0,
    autoRelease: false,
    autoReleaseSpeed: 0,
    unlocks: [],
    quote: "",
    quoteIdx: 0,
    currentSpeedUp: 0
  }),
  computed: {
    amplifiedGameDesc() {
      return `${formatPow(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.gameTimeAmplification(), 2, 2)}`;
    },
    storedRealEfficiencyDesc() {
      return formatPercents(this.storedRealEffiency);
    },
    storedRealCapDesc() {
      return timeDisplayShort(this.storedRealCap);
    },
    unlocksInfo() {
      return ENSLAVED_UNLOCKS;
    },
    nerfedBlackHoleTime() {
      return Enslaved.storedTimeInsideEnslaved(this.storedBlackHole);
    },
    realityTitle() {
      return this.inEnslaved
        ? "You're inside Enslaved Ones' Reality"
        : "Start Enslaved One's Reality";
    },
    sliderProps() {
      return {
        min: 0,
        max: 1000,
        interval: 1,
        show: true,
        width: "60rem",
        tooltip: false
      };
    }
  },
  methods: {
    update() {
      this.isStoringBlackHole = player.celestials.enslaved.isStoring;
      this.storedBlackHole = player.celestials.enslaved.stored;
      this.isStoringReal = player.celestials.enslaved.isStoringReal;
      this.autoStoreReal = player.celestials.enslaved.autoStoreReal;
      this.hasAmplifyStoredReal = Ra.has(RA_UNLOCKS.IMPROVED_STORED_TIME);
      this.canAdjustStoredTime = Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME);
      this.inEnslaved = Enslaved.isRunning;
      this.completed = Enslaved.isCompleted;
      this.storedReal = player.celestials.enslaved.storedReal;
      this.storedRealEffiency = Enslaved.storedRealTimeEfficiency;
      this.storedRealCap = Enslaved.storedRealTimeCap;
      this.unlocks = Array.from(player.celestials.enslaved.unlocks);
      this.quote = Enslaved.quote;
      this.quoteIdx = player.celestials.enslaved.quoteIdx;
      this.storedFraction = 1000 * player.celestials.enslaved.storedFraction;
      this.autoRelease = player.celestials.enslaved.isAutoReleasing;
      this.autoReleaseSpeed = Enslaved.isAutoReleasing ? Enslaved.autoReleaseSpeed : 0;
      this.currentSpeedUp = Enslaved.currentBlackHoleStoreAmountPerMs;
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
      Enslaved.useStoredTime(false);
    },
    timeDisplayShort(ms) {
      return timeDisplayShort(ms);
    },
    timeUntilBuy(price) {
      return Math.max((price - this.storedBlackHole) / this.currentSpeedUp, 0);
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
    canBuyUnlock(info) {
      return Enslaved.canBuy(info);
    },
    nextQuote() {
      Enslaved.nextQuote();
    },
    hasNextQuote() {
      return this.quoteIdx < Enslaved.maxQuoteIdx;
    },
    unlockClassObject(info) {
      return {
        "o-enslaved-shop-button--bought": this.hasUnlock(info),
        "o-enslaved-shop-button--available": this.canBuyUnlock(info)
      };
    },
    adjustSlider(value) {
      this.storedFraction = value;
      player.celestials.enslaved.storedFraction = value / 1000;
    },
    toggleAutoRelease() {
      player.celestials.enslaved.isAutoReleasing = !player.celestials.enslaved.isAutoReleasing;
    },
    glitchStyle(x) {
      const xScale = 15 / 27;
      const yScale = 5;
      const dx = (x - 13) * xScale + (Math.random() * 2 - 1) * 0.85;
      const dy = (Math.random() * 2 - 1) * yScale;
      const height = (Math.pow(Math.random(), 1.5) + 0.25) * 3 * yScale;
      return {
        transform: `translate(${dx}rem, ${dy}rem)`,
        height: `${height}rem`,
      };
    }
  },
  template:
    `<div class="l-enslaved-celestial-tab">
      <celestial-quote-history celestial="enslaved"/>
      <div class="l-enslaved-top-container">
        <div class="l-enslaved-top-container__half">
          Charging your black hole 
          {{ canAdjustStoredTime ? "reduces your black hole speed" : "sets your game speed to 1" }}. You can use
          time from charging to unlock Enslaved upgrades. You can also discharge it all in a single "supertick"
          which acts as if it was the duration of all of your stored time.
          <button :class="['o-enslaved-mechanic-button',
                           {'o-enslaved-mechanic-button--storing-time': isStoringBlackHole }]"
                  @click="toggleStoreBlackHole">
            <div class="o-enslaved-stored-time">{{ timeDisplayShort(storedBlackHole) }}</div>
            <div>{{ isStoringBlackHole ? "Charging black hole": "Charge black hole" }}</div>
          </button>
          <button class="o-enslaved-mechanic-button" @click="useStored">
            Discharge black hole
            <p v-if="inEnslaved">{{timeDisplayShort(nerfedBlackHoleTime)}} in this reality</p>
          </button>
          <div v-if="hasAmplifyStoredReal"> Amplified: {{ amplifiedGameDesc }} </div>
        </div>
        <div class="l-enslaved-top-container__half">
          Storing real time completely halts all production, setting game speed to 0. You can use stored real time to
          "amplify" a reality, simulating repeated runs of it. Amplified realities give all the rewards that normal
          realities do.
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
      <div v-if="canAdjustStoredTime" class="l-enslaved-shop-container">
        <ad-slider-component
            v-bind="sliderProps"
            :value="storedFraction"
            @input="adjustSlider($event)"
          />
      </div>
      <br>
      <div v-if="canAdjustStoredTime">
        <input type="checkbox"
          id="autoReleaseBox"
          v-model="autoRelease"
          :value="autoRelease"
          @input="toggleAutoRelease()">
        <label for="autoReleaseBox">Pulse black hole (uses 1% every 5 ticks)</label>
      </div>
      <div class="l-enslaved-shop-container">
        <button
          v-for="unlock in unlocksInfo"
          :key="unlock.id"
          class="o-enslaved-shop-button"
          :class="unlockClassObject(unlock)"
          @click="buyUnlock(unlock)"> 
            {{ unlock.description }} <br> 
            Costs: {{ timeDisplayShort(unlock.price) }}<br>
            <span v-if="isStoringBlackHole && !hasUnlock(unlock)">Time to obtain:
            {{ timeDisplayShort(timeUntilBuy(unlock.price)) }}</span>
          </button>
      </div>
      <div class="l-enslaved-unlocks-container" v-if="hasUnlock(unlocksInfo.RUN)">
        <div class="o-enslaved-run-box">
          <div class="o-enslaved-run-box__title">{{realityTitle}}</div>
          <div v-if="completed"><b>(Completed)</b></div>
          <div class="o-enslaved-run-button" @click="startRun">
            <div class="o-enslaved-run-button__sigil fas fa-link" />
            <div v-for="x in 25" class="o-enslaved-run-button__glitch"
                                :style="glitchStyle(x)"/>
          </div>
          <p>Glyph levels will be boosted to a minimum of 5000</p>
          <p>Infinity, time, and 8th dimension purchases are limited to 1 each.</p>
          <p>Normal dimension multipliers are always dilated (the glyph effect still only
             applies in actual dilation)</p>
          <p>Time study 192 (uncapped replicanti) is locked</p>
          <p>The black hole is disabled</p>
          <p>Tachyon production and dilated time production are severely reduced</p>
          <p>Time theorem generation from dilation glyphs is disabled</p>
          <p>Certain challenge goals have been increased</p>
          <p>Stored time is effectively dilated (exponent^0.5)</p>
          <b>Reward: ID purchase caps are increased by 1000 for every 1000 free tickspeed upgrades you have</b>
        </div>
      </div>
    </div>`
});
