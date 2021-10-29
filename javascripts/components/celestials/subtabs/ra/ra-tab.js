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
      petWithRecollection: "",
      isRunning: false,
      memoryBoosts: "",
    };
  },
  computed: {
    laitelaUnlock: () => Laitela.isUnlocked,
    pets: () => [
      {
        pet: Ra.pets.teresa,
        scalingUpgradeVisible: () => Ra.totalCharges > 0,
        scalingUpgradeText: () => `You can Charge ${quantifyInt("Infinity Upgrade", Ra.totalCharges)}.`,
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeVisible: () => AlchemyResources.all.filter(r => r.isUnlocked).length > 0,
        scalingUpgradeText: () => {
          const resources = AlchemyResources.all.filter(r => r.isUnlocked).length;
          return `You have unlocked ${quantifyInt("Alchemy Resource", resources)}.`;
        },
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeVisible: () => Ra.has(RA_UNLOCKS.IMPROVED_STORED_TIME),
        scalingUpgradeText: () => `Stored game time
          ${formatX(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.gameTimeAmplification(), 2)} and real time
          +${formatInt(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.realTimeCap() / (1000 * 3600))} hours`,
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeVisible: () => Math.clampMax(Math.floor(Ra.pets.v.level / 5), 4) > 0,
        scalingUpgradeText: level => {
          const triadCount = Math.clampMax(Math.floor(level / 5), 4);
          return `You have unlocked ${quantifyInt("Triad Study", triadCount)}.`;
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
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[4].description().replace(/^\w/u, c => c.toUpperCase()).split("\n");
    }
  },
  methods: {
    update() {
      this.memoriesPerChunk = Ra.productionPerMemoryChunk;
      this.isRaCapped = Ra.totalPetLevel === 100;
      this.totalLevels = Ra.totalPetLevel;
      this.showRecollection = Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK);
      this.hasRecollection = Ra.has(RA_UNLOCKS.RA_RECOLLECTION_UNLOCK);
      this.recollectionReq = RA_UNLOCKS.RA_RECOLLECTION_UNLOCK.totalLevels;
      this.recollectionMult = RA_UNLOCKS.RA_RECOLLECTION_UNLOCK.effect;
      this.petWithRecollection = Ra.petWithRecollection;
      this.isRunning = Ra.isRunning;
      this.memoryBoosts = Ra.memoryBoostResources;
    },
    startRun() {
      Modal.celestials.show({ name: "Ra's", number: 4 });
    },
    toggleMode() {
      Ra.toggleMode();
    }
  },
  template: `
    <div class="l-ra-celestial-tab">
      <div class="c-ra-memory-header">
        <celestial-quote-history celestial="ra" />
        <div v-if="!isRaCapped">
          Each Memory Chunk generates a base of one Memory per second, which has been increased to
<<<<<<< HEAD
          {{ quantify("Memory", memoriesPerChunk, 2, 3) }}
=======
          {{ "Memory" | quantify(memoriesPerChunk, 2, 3) }}
>>>>>>> Address idly PR comments
          per second.
          <span v-if="memoriesPerChunk > 1">
            <br>
            This is being increased due to {{ memoryBoosts }}.
          </span>
        </div>
        <div v-else>
          All Memories have been returned.
        </div>
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
          <h2>
            <span v-if="isRunning">You are in </span>
            <span v-else>Start </span>
            Ra's Reality
          </h2>
          <div :class="runButtonClassObject" @click="startRun">
            <span class="c-ra-run-button__icon__sigil fas fa-sun"></span>
          </div>
          <span v-for="line in runDescription">
            {{ line }}
          </span>
        </button>
        <div v-if="showRecollection && !isRaCapped" class="c-ra-recollection-unlock">
          <h1 :style="petStyle">Recollection</h1>
          <span :style="petStyle">
            Whichever Celestial has Recollection will get {{ formatX(recollectionMult) }} Memory Chunk gain.
          </span>
          <div class="c-ra-recollection-unlock-inner" v-if="hasRecollection">
            <ra-pet-recollection-button
              v-for="(pet, i) in pets"
              :key="i"
              :petConfig="pet"
            />
          </div>
          <div v-else class="c-ra-recollection-unlock-inner">
            Unlocked by getting {{ formatInt(recollectionReq) }} total Celestial Memory levels
            (you need {{ formatInt(recollectionReq - totalLevels) }} more)
          </div>
        </div>
      </div>
    </div>`
});
