"use strict";

Vue.component("modal-enslaved-hints", {
  data() {
    return {
      currentStored: 0,
      nextHintCost: 0,
      canGetHint: false,
      shownEntries: [],
      realityHintsLeft: 0,
      glyphHintsLeft: 0,
      hints: 0,
    };
  },
  methods: {
    update() {
      this.currentStored = player.celestials.enslaved.stored;
      this.nextHintCost = Enslaved.nextHintCost;
      this.canGetHint = this.currentStored >= this.nextHintCost;
      this.shownEntries = [];

      this.realityHintsLeft = Object.values(EnslavedProgress).length;
      for (const prog of Object.values(EnslavedProgress)) {
        if (prog.hasHint) {
          this.shownEntries.push([prog.hasProgress
            ? prog.config.progress
            : "(You haven't figured this hint out yet)", prog.config.hint]);
          this.realityHintsLeft--;
        }
      }

      const glyphHintCount = player.celestials.enslaved.glyphHintsGiven;
      for (let hintNum = 0; hintNum < glyphHintCount; hintNum++) {
        this.shownEntries.push(["", GameDatabase.celestials.enslaved.glyphHints[hintNum]]);
      }
      this.glyphHintsLeft = GameDatabase.celestials.enslaved.glyphHints.length - glyphHintCount;

      this.hints = Enslaved.hintCostIncreases;
    },
    giveRealityHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      Object.values(EnslavedProgress).filter(prog => !prog.hasHint).randomElement().giveHint();
    },
    giveGlyphHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      player.celestials.enslaved.glyphHintsGiven++;
    }
  },
  computed: {
    hintCost() {
      return `${format(TimeSpan.fromMilliseconds(this.nextHintCost).totalYears, 2)} years`;
    },
    hasProgress(id) {
      return this.progressEntries.some(entry => entry.id === id);
    },
    // Note: This calculation seems to behave extremely poorly if the goal has been raised more than 12 hints worth
    // of cost bumps and I'm not entirely sure why. There's probably a numerical issue I can't quite figure out, but
    // considering that much cost raising can't happen in practice I think I'm just going to leave it be.
    timeEstimate() {
      if (this.currentStored >= this.nextHintCost) return "";

      // Relevant values are stored as milliseconds, so multiply the rate by 1000 to get to seconds
      const storeRate = 1000 * (Enslaved.isStoringGameTime
        ? Enslaved.currentBlackHoleStoreAmountPerMs
        : getGameSpeedupFactor());
      const alreadyWaited = this.currentStored / storeRate;
      const decaylessTime = this.nextHintCost / storeRate;

      // Check if decay is irrelevant and don't do the hard calculations if so
      const minCostEstimate = (TimeSpan.fromYears(1e40).totalMilliseconds - this.currentStored) / storeRate;
      if (TimeSpan.fromSeconds(minCostEstimate).totalDays > this.hints) {
        return `${TimeSpan.fromSeconds(minCostEstimate).toStringShort(true)}`;
      }

      // Decay is 3x per day, but the math needs decay per second
      const K = Math.pow(3, 1 / 86400);
      const x = decaylessTime * Math.log(K) * Math.pow(K, alreadyWaited);
      const timeToGoal = productLog(x) / Math.log(K) - alreadyWaited;
      return `${TimeSpan.fromSeconds(timeToGoal).toStringShort(true)}`;
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
          <br>
        </div>
        <div v-if="realityHintsLeft + glyphHintsLeft > 0">
          You can spend some time looking for some more cracks in the Reality, but every hint you spend Stored Time on
          will increase the Stored Time needed for the next by a factor of {{ formatInt(3) }}. This cost bump will
          gradually go away over {{ formatInt(24) }} hours and figuring out what the hint means will immediately
          divide the cost by {{ formatInt(2) }}. The cost can't be reduced below {{ format(1e40) }} years.
          <br>
          <br>
          The next hint will cost {{ hintCost }} Stored Time.
          <span v-if="currentStored < nextHintCost">
            You will reach this if you charge your Black Hole for {{ timeEstimate }}.
          </span>
          <br>
          <br>
          <button class="o-primary-btn"
            :class="{ 'o-primary-btn--disabled': realityHintsLeft <= 0 || !canGetHint }"
            v-on:click="giveRealityHint(realityHintsLeft)">
              Get a hint about the Reality itself ({{ formatInt(realityHintsLeft) }} left)
          </button>
          <br>
          <button class="o-primary-btn"
            :class="{ 'o-primary-btn--disabled': glyphHintsLeft <= 0 || !canGetHint }"
            v-on:click="giveGlyphHint(glyphHintsLeft)">
              Get a hint on what glyphs to use ({{ formatInt(glyphHintsLeft) }} left)
          </button>
        </div>
        <div v-else>
          There are no more hints left!
        </div>
    </div>`,
});

Vue.component("enslaved-tab", {
  data: () => ({
    isStoringBlackHole: false,
    isStoringReal: false,
    autoStoreReal: false,
    canAdjustStoredTime: false,
    storedFraction: 0,
    isRunning: false,
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
      return this.isRunning
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
    },
    runButtonClassObject() {
      return {
        "c-enslaved-run-button__icon": true,
        "c-enslaved-run-button__icon--running": this.isRunning,
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
      this.isRunning = Enslaved.isRunning;
      this.completed = Enslaved.isCompleted;
      this.storedReal = player.celestials.enslaved.storedReal;
      this.storedRealEffiency = Enslaved.storedRealTimeEfficiency;
      this.storedRealCap = Enslaved.storedRealTimeCap;
      this.unlocks = Array.from(player.celestials.enslaved.unlocks);
      this.buyableUnlocks = Object.values(ENSLAVED_UNLOCKS).map(x => Enslaved.canBuy(x));
      this.quote = Enslaved.quote;
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
      if (!resetReality()) return;
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
  template: `
    <div class="l-enslaved-celestial-tab">
      <div class="c-subtab-option-container" v-if="canAdjustStoredTime">
        <primary-button-on-off
          v-model="autoRelease"
          class="o-primary-btn--subtab-option"
          text="Pulse Black Hole:"
        />
      </div>
      <div class="l-enslaved-celestial-tab--inner">
        <div class="l-enslaved-run-container">
          <div v-if="hasUnlock(unlocksInfo.RUN)">
            <div class="c-enslaved-run-button">
              <div class="c-enslaved-run-button__title">{{realityTitle}}</div>
              <div v-if="completed"><b>(Completed)</b></div>
              <div :class="runButtonClassObject" @click="startRun">
                <div class="c-enslaved-run-button__icon__sigil fas fa-link" />
                <div v-if="isRunning" v-for="x in 25" class="c-enslaved-run-button__icon__glitch"
                                    :style="glitchStyle(x)"/>
              </div>
              <p>Glyph levels will be boosted to a minimum of {{ formatInt(5000) }}</p>
              <p>Infinity, Time, and 8th Antimatter Dimension purchases are limited to {{ formatInt(1) }} each</p>
              <p>Antimatter Dimension multipliers are always Dilated (the glyph effect still only
                applies in actual Dilation)</p>
              <p>Time Study 192 (uncapped Replicanti) is locked</p>
              <p>The Black Hole is disabled</p>
              <p>Tachyon Particle production and Dilated Time production are severely reduced</p>
              <p>Time Theorem generation from Dilation glyphs is disabled</p>
              <p>Certain challenge goals have been increased</p>
              <p>Stored Time is discharged at a reduced effectiveness (exponent^{{ format(0.55, 2, 2) }})</p>
              <b>Reward: Unlock Tesseracts, which let you increase Infinity Dimension caps
              (see Infinity Dimension tab)</b>
            </div>
          </div>
        </div>
        <div class="l-enslaved-upgrades-column">
          <celestial-quote-history celestial="enslaved"/>
          <primary-button
            v-if="hintsUnlocked"
            class="o-primary-btn"
            onclick="Modal.enslavedHints.show()">
              Examine the Reality more closely...
          </primary-button>
          <div class="l-enslaved-top-container">
            <div class="l-enslaved-top-container__half">
              While charging, the Black Hole's speed boost is {{ canAdjustStoredTime ? "decreased" : "disabled" }},
              and the lost speed is converted into Stored Time. Discharging the Black Hole allows you to skip
              forward in time. Stored Time is also used to unlock certain upgrades.
              <button :class="['o-enslaved-mechanic-button',
                              {'o-enslaved-mechanic-button--storing-time': isStoringBlackHole }]"
                      @click="toggleStoreBlackHole">
                <div class="o-enslaved-stored-time">{{ timeDisplayShort(storedBlackHole) }}</div>
                <div>{{ isStoringBlackHole ? "Charging Black Hole": "Charge Black Hole" }}</div>
              </button>
              <button class="o-enslaved-mechanic-button" @click="useStored">
                Discharge Black Hole
                <p v-if="isRunning">{{timeDisplayShort(nerfedBlackHoleTime)}} in this Reality</p>
              </button>
            </div>
            <div class="l-enslaved-top-container__half">
              Storing real time completely halts all production, setting game speed to {{ formatInt(0) }}.
              You can use stored real time to "amplify" a Reality, simulating repeated runs of it.
              Amplified Realities give all the rewards that normal realities do.
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
              <div> Maximum stored real time: {{ storedRealCapDesc }} </div>
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
        </div>
      </div>
    </div>`
});
