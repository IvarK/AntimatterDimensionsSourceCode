"use strict";

Vue.component("modal-enslaved-hints", {
  data() {
    return {
      currentStored: 0,
      nextHintCost: 0,
      shownEntries: [],
      realityHintsLeft: 0,
      glyphHintsLeft: 0,
    };
  },
  methods: {
    update() {
      this.currentStored = player.celestials.enslaved.stored;
      this.nextHintCost = Enslaved.nextHintCost;
      this.shownEntries = [];

      this.realityHintsLeft = Object.values(EnslavedProgress).length;
      for (const prog of Object.values(EnslavedProgress)) {
        if (prog.hasHint) {
          this.shownEntries.push([prog.hasProgress ? prog.config.progress : "(Unknown)", prog.config.hint]);
          this.realityHintsLeft--;
        }
      }

      const glyphHintCount = player.celestials.enslaved.glyphHintsGiven;
      for (let hintNum = 0; hintNum < glyphHintCount; hintNum++) {
        this.shownEntries.push(["", GameDatabase.celestials.enslaved.glyphHints[hintNum]]);
      }
      this.glyphHintsLeft = GameDatabase.celestials.enslaved.glyphHints.length - glyphHintCount;
    },
    spendTime() {
      if (this.currentStored < Enslaved.nextHintCost) return false;
      player.celestials.enslaved.stored -= this.nextHintCost;
      return true;
    },
    giveRealityHint() {
      if (!this.spendTime()) return;
      player.celestials.enslaved.realityHintsGiven++;
      Object.values(EnslavedProgress).filter(prog => !prog.hasHint).randomElement().giveHint();
    },
    giveGlyphHint(available) {
      if (available <= 0 || !this.spendTime()) return;
      player.celestials.enslaved.glyphHintsGiven++;
    }
  },
  computed: {
    hintCost() {
      return `${format(TimeSpan.fromMilliseconds(this.nextHintCost).totalYears, 1)} years`;
    },
    hasProgress(id) {
      return this.progressEntries.some(entry => entry.id === id);
    },
    timeEstimate() {
      const storeRate = Enslaved.isStoringGameTime
        ? Enslaved.currentBlackHoleStoreAmountPerMs
        : getGameSpeedupFactor();
      const timeToGoal = Math.clampMin((this.nextHintCost - this.currentStored) / storeRate, 0);
      return `${TimeSpan.fromMilliseconds(timeToGoal)}`;
    }
  },
  template: `
    <div class="c-reality-glyph-creation">
      <modal-close-button @click="emitClose"/>
      <div>
        This Reality seems to be resisting your efforts to complete it. So far you have done the following:
      </div><br>
      <div v-for="entry in shownEntries">
          <div v-if="entry[0]">
            <b>{{ entry[0] }}</b>
            <br>
            - {{ entry[1] }}
          </div>
          <div v-else>
            * <i>Glyph hint: {{ entry[1] }}</i>
          </div>
        </div>
      <br>
        You can spend some time looking for some more cracks in the Reality, but every hint you spend time on
        will permanently increase the time needed for the next by a factor of {{ formatInt(3) }}.
        <br>
        <br>
        The next hint requires {{ hintCost }} stored in your black hole, which will be used up. You can reach
        this by charging your black hole for {{ timeEstimate }}.
        <br>
        <br>
        <button class="o-primary-btn"
          :class="{ 'o-primary-btn--disabled': realityHintsLeft <= 0 }"
          v-on:click="giveRealityHint(realityHintsLeft)">
            Get a hint about the Reality itself ({{ formatInt(realityHintsLeft) }} left)
        </button>
        <button class="o-primary-btn"
          :class="{ 'o-primary-btn--disabled': glyphHintsLeft <= 0 }"
          v-on:click="giveGlyphHint(glyphHintsLeft)">
            Get a hint on what glyphs to use ({{ formatInt(glyphHintsLeft) }} left)
        </button>
    </div>`,
});

Vue.component("enslaved-tab", {
  data: () => ({
    isStoringBlackHole: false,
    isStoringReal: false,
    autoStoreReal: false,
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
    buyableUnlocks: [],
    quote: "",
    quoteIdx: 0,
    currentSpeedUp: 0,
    hintsUnlocked: false
  }),
  computed: {
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
    storedTimeRate() {
      return formatPercents(this.storedFraction / 1000, 1);
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
  watch: {
    autoRelease(newValue) {
      player.celestials.enslaved.isAutoReleasing = newValue;
    }
  },
  methods: {
    update() {
      this.isStoringBlackHole = Enslaved.isStoringGameTime;
      this.storedBlackHole = player.celestials.enslaved.stored;
      this.isStoringReal = Enslaved.isStoringRealTime;
      this.autoStoreReal = player.celestials.enslaved.autoStoreReal;
      this.canAdjustStoredTime = Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME);
      this.inEnslaved = Enslaved.isRunning;
      this.completed = Enslaved.isCompleted;
      this.storedReal = player.celestials.enslaved.storedReal;
      this.storedRealEffiency = Enslaved.storedRealTimeEfficiency;
      this.storedRealCap = Enslaved.storedRealTimeCap;
      this.unlocks = Array.from(player.celestials.enslaved.unlocks);
      this.buyableUnlocks = Object.values(ENSLAVED_UNLOCKS).map(x => Enslaved.canBuy(x));
      this.quote = Enslaved.quote;
      this.quoteIdx = player.celestials.enslaved.quoteIdx;
      this.storedFraction = 1000 * player.celestials.enslaved.storedFraction;
      this.autoRelease = player.celestials.enslaved.isAutoReleasing;
      this.autoReleaseSpeed = Enslaved.isAutoReleasing ? Enslaved.autoReleaseSpeed : 0;
      this.currentSpeedUp = Enslaved.currentBlackHoleStoreAmountPerMs;
      this.hintsUnlocked = EnslavedProgress.hintsUnlocked.hasProgress;
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
      // This needs to be added here before the reset so that TD autobuyers don't buy too much on start
      player.celestials.enslaved.run = true;
      resetReality();
      Enslaved.initializeRun();
    },
    hasUnlock(info) {
      return Enslaved.has(info);
    },
    canBuyUnlock(info) {
      // This (rather than just using Enslaved.canBuy(info) and removing this.buyableUnlocks)
      // is needed for proper reactivity of button styles (e.g., if you get a level 5000 glyph
      // while on the Enslaved tab).
      return this.buyableUnlocks[info.id];
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
      <primary-button
        v-if="hintsUnlocked"
        class="o-primary-btn"
        onclick="Modal.enslavedHints.show()">
          Examine the Reality more closely...
      </primary-button>
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
      <div v-if="canAdjustStoredTime" class="l-enslaved-top-container__half">
        Black Hole charging rate: {{ storedTimeRate }}
        <br>
        <br>
        <ad-slider-component
            v-bind="sliderProps"
            :value="storedFraction"
            @input="adjustSlider($event)"
          />
      </div>
      <br>
      <div v-if="canAdjustStoredTime">
        <primary-button-on-off
          v-model="autoRelease"
          class="o-primary-btn"
          text="Pulse black hole:"
        />
      </div>
      <div class="l-enslaved-shop-container">
        <button
          v-for="unlock in unlocksInfo"
          :key="unlock.id"
          class="o-enslaved-shop-button"
          :class="unlockClassObject(unlock)"
          @click="buyUnlock(unlock)"> 
            {{ unlock.description() }}
            <br> 
            Costs: {{ timeDisplayShort(unlock.price) }}
            <br>
            <span v-if="isStoringBlackHole && !hasUnlock(unlock)">
              Time to obtain: {{ timeDisplayShort(timeUntilBuy(unlock.price)) }}
            </span>
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
          <b>Reward: Unlock Tesseracts, which let you increase Infinity Dimension caps (see Infinity Dimension tab)</b>
        </div>
      </div>
    </div>`
});
