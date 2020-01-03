"use strict";

Vue.component("ra-tab", {
  data() {
    return {
      expMults: [0, 0, 0, 0],
      currentExpGain: 0,
      showReality: false,
      showLaitela: false
    };
  },
  methods: {
    update() {
      this.expMults = this.pets.map(obj => obj.pet.expBoost);
      this.currentExpGain = Ra.pets.teresa.baseExp;
      this.showReality = Ra.pets.teresa.level > 2;
      this.showLaitela = Ra.pets.v.isUnlocked;
    },
    startRun() {
      Ra.startRun();
    },
    toggleMode() {
      Ra.toggleMode();
    }
  },
  computed: {
    laitelaUnlock: () => RA_LAITELA_UNLOCK,
    pets: () => [
      {
        pet: Ra.pets.teresa,
        scalingUpgradeText: () => `You can charge ${formatInt(Ra.totalCharges)} Infinity Upgrades.`,
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeText: level => `Glyph rarity +${level}% and +${formatInt(Math.floor(level / 5))}
          additional choices.`,
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeText: () => `Stored game time ^
          ${format(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.gameTimeAmplification(), 0, 2)}, stored real time efficiency
          +${formatPercents(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.realTimeEfficiency(), 0, 2)} and
          +${format(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.realTimeCap() / 1000 / 3600, 0, 1)} hours maximum.`,
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeText: level => `+${formatInt(level)} free achievements.`,
      }
    ]
  },
  template:
    `<div class="l-ra-celestial-tab">
      <div class="c-ra-memory-header">
        You will gain {{ format(this.currentExpGain, 2, 2) }}{{ showReality ? " base" : ""}}
        memories on Reality, based on glyph level.
      </div>
      <div>
        Mouse-over bolded numbers to see descriptions of upgrades you have already unlocked.
      </div>
      <div class="l-ra-all-pets-container">
        <ra-pet v-for="(pet, i) in pets" :key="i" :petConfig="pet" />
      </div>
      <div class="l-ra-non-pets">
        <button @click="startRun" class="l-ra-reality-container" v-if="showReality">
          <div class="l-ra-reality-inner">
            <h1> Start Ra's Reality</h1>
            <p> Rules: You can't dimension boost and tick reduction is forced to be 11%. </p>
            <br>
            <br>
            <h2> Memory multipliers: </h2>
            <div class="c-ra-rewards">
              <span class="c-ra-rewards-inner"> Teresa: {{formatX(expMults[0], 2, 2)}} </span>
              <span
                class="c-ra-rewards-inner"
                v-if="pets[1].pet.isUnlocked"> Effarig: {{formatX(expMults[1], 2, 2)}} </span>
            </div>
            <div class="c-ra-rewards">
              <span
                class="c-ra-rewards-inner"
                v-if="pets[2].pet.isUnlocked"> Enslaved: {{formatX(expMults[2], 2, 2)}} </span>
              <span
                class="c-ra-rewards-inner"
                v-if="pets[3].pet.isUnlocked"> V: {{formatX(expMults[3], 2, 2)}} </span>
            </div>
          </div>
        </button>
        <button class="l-ra-laitela-unlock" v-if="showLaitela">
          <div class="l-ra-laitela-unlock-inner">
            <h1> Lai'tela: </h1>
            <h2> The Celestial of Matter </h2>
            <p> Unlocked getting all four celestials to level {{ formatInt(20) }} </p>
          </div>
        </button>
      </div>
    </div>`
});
