<script>
import BlackHoleChargingSliders from "@/components/tabs/black-hole/BlackHoleChargingSliders";
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "EnslavedTab",
  components: {
    CelestialQuoteHistory,
    PrimaryButton,
    PrimaryToggleButton,
    BlackHoleChargingSliders
  },
  data: () => ({
    isStoringBlackHole: false,
    isStoringReal: false,
    autoStoreReal: false,
    offlineEnabled: false,
    canAdjustStoredTime: false,
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
    hintsUnlocked: false,
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
      if (this.isRunning) return "You're inside Enslaved Ones' Reality";
      return "Start Enslaved One's Reality";
    },
    runButtonClassObject() {
      return {
        "c-enslaved-run-button__icon": true,
        "c-enslaved-run-button__icon--running": this.isRunning,
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[2].effects().split("\n");
    },
    realTimeButtonText() {
      if (!this.offlineEnabled) return "Offline Progress is disabled";
      if (this.autoStoreReal) return "Offline time stored";
      return "Offline time used for production";
    },
    // Use this here since Enslaved has a fairly non-standard character, and SFCs don't support using \uf0c1
    enslavedSymbol: () => Enslaved.symbol,
    isDoomed: () => Pelle.isDoomed,
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
      this.offlineEnabled = player.options.offlineProgress;
      this.canAdjustStoredTime = Ra.unlocks.adjustableStoredTime.canBeApplied;
      this.isRunning = Enslaved.isRunning;
      this.completed = Enslaved.isCompleted && !this.isDoomed;
      this.storedReal = player.celestials.enslaved.storedReal;
      this.storedRealEffiency = Enslaved.storedRealTimeEfficiency;
      this.storedRealCap = Enslaved.storedRealTimeCap;
      this.unlocks = Array.from(player.celestials.enslaved.unlocks);
      this.buyableUnlocks = Object.values(ENSLAVED_UNLOCKS).map(x => Enslaved.canBuy(x));
      this.quote = Enslaved.quote;
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
      if (!this.offlineEnabled) return;
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
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "The Enslaved Ones'", number: 2 });
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
};
</script>

<template>
  <div class="l-enslaved-celestial-tab">
    <div
      v-if="canAdjustStoredTime"
      class="c-subtab-option-container"
    >
      <PrimaryToggleButton
        v-model="autoRelease"
        class="o-primary-btn--subtab-option"
        label="Pulse Black Hole:"
      />
    </div>
    <div class="l-enslaved-celestial-tab--inner">
      <div class="l-enslaved-run-container">
        <div v-if="hasUnlock(unlocksInfo.RUN)">
          <div class="c-enslaved-run-button">
            <div
              class="c-enslaved-run-button__title"
              :class="{ 'o-pelle-disabled': isDoomed }"
            >
              {{ realityTitle }}
            </div>
            <div v-if="completed">
              <b>(Completed)</b>
            </div>
            <div
              :class="runButtonClassObject"
              @click="startRun"
            >
              <div class="c-enslaved-run-button__icon__sigil">
                {{ enslavedSymbol }}
              </div>
              <div
                v-for="x in (isRunning ? 25 : 0)"
                :key="x"
                class="c-enslaved-run-button__icon__glitch"
                :style="glitchStyle(x)"
              />
            </div>
            <div
              v-for="line in runDescription"
              :key="line"
              class="c-enslaved-run-description-line"
            >
              {{ line }}
            </div>
            <b>Reward: Unlock Tesseracts, which let you increase Infinity Dimension caps
              (see Infinity Dimension tab)</b>
          </div>
        </div>
      </div>
      <div class="l-enslaved-upgrades-column">
        <CelestialQuoteHistory celestial="enslaved" />
        <PrimaryButton
          v-if="hintsUnlocked"
          class="o-primary-btn"
          onclick="Modal.enslavedHints.show()"
        >
          Examine the Reality more closely...
        </PrimaryButton>
        <div class="l-enslaved-top-container">
          <div class="l-enslaved-top-container__half">
            While charging, the Black Hole's speed boost is {{ canAdjustStoredTime ? "decreased" : "disabled" }},
            and the lost speed is converted into stored game time. Discharging the Black Hole allows you to skip
            forward in time. Stored game time is also used to unlock certain upgrades.
            <button
              :class="['o-enslaved-mechanic-button',
                       {'o-enslaved-mechanic-button--storing-time': isStoringBlackHole }]"
              @click="toggleStoreBlackHole"
            >
              <div class="o-enslaved-stored-time">
                {{ timeDisplayShort(storedBlackHole) }}
              </div>
              <div>
                {{ isStoringBlackHole ? "Charging Black Hole": "Charge Black Hole" }}
              </div>
            </button>
            <button
              class="o-enslaved-mechanic-button"
              @click="useStored"
            >
              <span :class="{ 'o-pelle-disabled': isDoomed }">Discharge Black Hole</span>
              <p v-if="isRunning">
                {{ timeDisplayShort(nerfedBlackHoleTime) }} in this Reality
              </p>
            </button>
          </div>
          <div class="l-enslaved-top-container__half">
            Storing real time completely halts all production, setting game speed to {{ formatInt(0) }}.
            You can use stored real time to "amplify" a Reality, simulating repeated runs of it.
            Amplified Realities give all the rewards that normal Realities do.
            <button
              :class="['o-enslaved-mechanic-button', {'o-enslaved-mechanic-button--storing-time': isStoringReal}]"
              @click="toggleStoreReal"
            >
              <div class="o-enslaved-stored-time">
                {{ timeDisplayShort(storedReal) }}
              </div>
              <div>
                {{ isStoringReal ? "Storing real time": "Store real time" }}
              </div>
            </button>
            <button
              :class="['o-enslaved-mechanic-button',
                       {'o-enslaved-mechanic-button--storing-time': autoStoreReal && offlineEnabled}]"
              @click="toggleAutoStoreReal"
            >
              {{ realTimeButtonText }}
            </button>
            <div>
              Efficiency: {{ storedRealEfficiencyDesc }}
            </div>
            <div>
              Maximum stored real time: {{ storedRealCapDesc }}
            </div>
          </div>
        </div>
        <BlackHoleChargingSliders />
        <br>
        <div class="l-enslaved-shop-container">
          <button
            v-for="unlock in unlocksInfo"
            :key="unlock.id"
            class="o-enslaved-shop-button"
            :class="unlockClassObject(unlock)"
            @click="buyUnlock(unlock)"
          >
            {{ unlock.description() }}
            <div v-if="!hasUnlock(unlock)">
              Costs: {{ timeDisplayShort(unlock.price) }}
            </div>
            <span v-if="isStoringBlackHole && !hasUnlock(unlock) && timeUntilBuy(unlock.price) > 0">
              Time to obtain: {{ timeDisplayShort(timeUntilBuy(unlock.price)) }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.o-celestial-quote-history {
  width: 60rem;
  margin: 1rem;
}

.c-enslaved-run-description-line {
  margin-bottom: 1rem;
}
</style>