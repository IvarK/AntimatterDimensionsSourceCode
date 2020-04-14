"use strict";

Vue.component("ra-tab", {
  data() {
    return {
      showReality: false,
      totalLevels: 0,
      hasRecollection: false,
      showLaitela: false,
      laitelaReq: 0,
      petWithRecollection: ""
    };
  },
  methods: {
    update() {
      this.totalLevels = Ra.totalPetLevel;
      this.hasRecollection = Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK);
      this.showLaitela = Ra.pets.v.isUnlocked;
      this.laitelaReq = RA_UNLOCKS.RA_LAITELA_UNLOCK.totalLevels;
      this.petWithRecollection = Ra.petWithRecollection;
    },
    startRun() {
      if (!resetReality()) return;
      Ra.initializeRun();
    },
    toggleMode() {
      Ra.toggleMode();
    }
  },
  computed: {
    laitelaUnlock: () => RA_UNLOCKS.RA_LAITELA_UNLOCK,
    pets: () => [
      {
        pet: Ra.pets.teresa,
        scalingUpgradeVisible: () => Ra.totalCharges > 0,
        scalingUpgradeText: () => `You can charge ${formatInt(Ra.totalCharges)} 
          Infinity ${pluralize("Upgrade", Ra.totalCharges)}.`,
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeVisible: () => AlchemyResources.all.filter(r => r.isUnlocked).length > 0,
        scalingUpgradeText: () => {
          const resources = AlchemyResources.all.filter(r => r.isUnlocked).length;
          return `You have unlocked ${formatInt(resources)} alchemy ${pluralize("resource", resources)}.`;
        },
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeVisible: () => Ra.has(RA_UNLOCKS.IMPROVED_STORED_TIME),
        scalingUpgradeText: () => `Stored game time 
          ${formatPow(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.gameTimeAmplification(), 0, 2)} and real time
          +${formatInt(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.realTimeCap() / (1000 * 3600))} hours`,
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeVisible: () => Math.clampMax(Math.floor(Ra.pets.v.level / 5), 4) > 0,
        scalingUpgradeText: level => {
          const triadCount = Math.clampMax(Math.floor(level / 5), 4);
          return `You have unlocked ${formatInt(triadCount)} triad ${pluralize("study", triadCount, "studies")}.`;
        },
      }
    ],
    petStyle() {
      return {
        color: (this.petWithRecollection === "")
          ? "white"
          : this.pets.find(pet => pet.pet.name === this.petWithRecollection).pet.color,
      };
    }
  },
  template: `
    <div class="l-ra-celestial-tab">
      <div>
        Hold shift to see progress on your current level.
      </div>
      <div>
        Mouse-over the icons below the bar to see descriptions of upgrades,
        <br>
        and mouse-over <i class="fas fa-question-circle"></i> icons for specific resource information.
      </div>
      <div class="l-ra-all-pets-container">
        <ra-pet v-for="(pet, i) in pets" :key="i" :petConfig="pet" />
      </div>
      <div class="l-ra-non-pets">
        <button @click="startRun" class="l-ra-reality-container">
          <div class="l-ra-reality-inner">
            <h2> Start Ra's Reality </h2>
            You can't dimension boost and tick reduction is fixed at 11%.
            <br>
            <br>
            Inside of Ra's reality, some resources will generate memories based on their amount.
          </div>
        </button>
        <div class="l-ra-recollection-unlock">
          <br>
          <h1 :style="petStyle">Recollection</h1>
          <span :style="petStyle">
            Whichever Celestial has recollection will gain memories in Ra's reality; the others will not.
          </span>
          <div class="l-ra-recollection-unlock-inner" v-if="hasRecollection">
            <ra-pet-recollection-button
              v-for="(pet, i) in pets"
              :key="i"
              :petConfig="pet" />
          </div>
          <div v-else class="l-ra-recollection-unlock-inner">
            Unlocked by unlocking more than one Celestial within Ra
          </div>
        </div>
        <button class="l-ra-laitela-unlock" v-if="showLaitela">
          <div class="l-ra-laitela-unlock-inner">
            <h1> Lai'tela: </h1>
            <h2> The Celestial of Dimensions </h2>
            <p>
              Unlocked by getting {{ formatInt(laitelaReq) }} total celestial levels
              <span v-if="totalLevels < laitelaReq">
                (you need {{formatInt(laitelaReq - totalLevels)}} more)
              </span>
            </p>
          </div>
        </button>
      </div>
    </div>
  `
});
