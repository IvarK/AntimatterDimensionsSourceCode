"use strict";

Vue.component("ra-tab", {
  data() {
    return {
      memoriesPerChunk: 0,
      showReality: false,
      isRaCapped: false,
      totalLevels: 0,
      showRecollection: false,
      hasRecollection: false,
      recollectionReq: 0,
      recollectionMult: 1,
      showLaitela: false,
      laitelaReq: 0,
      petWithRecollection: "",
      isRunning: false
    };
  },
  methods: {
    update() {
      this.memoriesPerChunk = Ra.productionPerMemoryChunk();
      this.isRaCapped = Ra.totalPetLevel === 100;
      this.totalLevels = Ra.totalPetLevel;
      this.showRecollection = Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK);
      this.hasRecollection = Ra.has(RA_UNLOCKS.RA_RECOLLECTION_UNLOCK);
      this.recollectionReq = RA_UNLOCKS.RA_RECOLLECTION_UNLOCK.totalLevels;
      this.recollectionMult = RA_UNLOCKS.RA_RECOLLECTION_UNLOCK.effect;
      this.showLaitela = Ra.pets.v.isUnlocked;
      this.laitelaReq = RA_UNLOCKS.RA_LAITELA_UNLOCK.totalLevels;
      this.petWithRecollection = Ra.petWithRecollection;
      this.isRunning = Ra.isRunning;
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
        scalingUpgradeText: () => `You can Charge ${formatInt(Ra.totalCharges)}
          Infinity ${pluralize("Upgrade", Ra.totalCharges)}.`,
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeVisible: () => AlchemyResources.all.filter(r => r.isUnlocked).length > 0,
        scalingUpgradeText: () => {
          const resources = AlchemyResources.all.filter(r => r.isUnlocked).length;
          return `You have unlocked ${formatInt(resources)} Alchemy ${pluralize("Resource", resources)}.`;
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
          return `You have unlocked ${formatInt(triadCount)} Triad ${pluralize("Study", triadCount, "Studies")}.`;
        },
      }
    ],
    petStyle() {
      return {
        color: (this.petWithRecollection === "")
          ? "white"
          : this.pets.find(pet => pet.pet.name === this.petWithRecollection).pet.color,
      };
    },
    runButtonClassObject() {
      return {
        "c-ra-run-button__icon": true,
        "c-ra-run-button__icon--running": this.isRunning,
      };
    }
  },
  template: `
    <div class="l-ra-celestial-tab">
      <div class="c-ra-memory-header" v-if=!isRaCapped>
        Each Memory Chunk generates a base of
        {{ format(memoriesPerChunk, 2, 3) }} {{ "Memory" | pluralize(memoriesPerChunk, "Memories") }}
        per second.
      </div>
      <div class="c-ra-memory-header" v-else>
        All Memories have been returned.
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
        <button class="c-ra-run-button">
          <h2> Start Ra's Reality </h2>
          <div :class="runButtonClassObject" @click="startRun">
            <span class="c-ra-run-button__icon__sigil fas fa-sun"></span>
          </div>
          You can't Dimension Boost, and the Tickspeed purchase multiplier is fixed at {{ formatX(1.1245, 0, 3) }}.
          <br>
          <br>
          Inside of Ra's reality, some resources will generate Memory Chunks based on their amount.
        </button>
        <div v-if="showRecollection && !isRaCapped" class="c-ra-recollection-unlock">
          <h1 :style="petStyle">Recollection</h1>
          <span :style="petStyle">
            Whichever Celestial is has Recollection will get {{formatX(recollectionMult)}} Memory Chunk gain.
          </span>
          <div class="c-ra-recollection-unlock-inner" v-if="hasRecollection">
            <ra-pet-recollection-button
              v-for="(pet, i) in pets"
              :key="i"
              :petConfig="pet" />
          </div>
          <div v-else class="c-ra-recollection-unlock-inner">
            Unlocked by getting {{ formatInt(recollectionReq) }} total Celestial Memory levels
            (you need {{formatInt(recollectionReq - totalLevels)}} more)
          </div>
        </div>
        <div class="c-ra-laitela-unlock" v-if="showLaitela">
          <h1> Lai'tela: </h1>
          <h2> The Celestial of Dimensions </h2>
          <p>
            Unlocked by getting {{ formatInt(laitelaReq) }} total Celestial Memory levels
            <span v-if="totalLevels < laitelaReq">
              (you need {{formatInt(laitelaReq - totalLevels)}} more)
            </span>
          </p>
        </div>
      </div>
    </div>
  `
});
