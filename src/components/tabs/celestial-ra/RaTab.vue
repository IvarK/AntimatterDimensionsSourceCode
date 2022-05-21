<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import RaPet from "./RaPet";
import RaPetRecollectionButton from "./RaPetRecollectionButton";

export default {
  name: "RaTab",
  components: {
    RaPet,
    RaPetRecollectionButton,
    CelestialQuoteHistory
  },
  data() {
    return {
      isDoomed: false,
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
        scalingUpgradeVisible: () => Ra.unlocks.chargedInfinityUpgrades.isUnlocked,
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
        scalingUpgradeVisible: () => Ra.unlocks.improvedStoredTime.isUnlocked,
        scalingUpgradeText: () => `Stored game time
          ${formatX(Ra.unlocks.improvedStoredTime.effects.gameTimeAmplification.effectOrDefault(1), 2)} and real time
          +${formatInt(Ra.unlocks.improvedStoredTime.effects.realTimeCap.effectOrDefault(0) / (1000 * 3600))} hours`,
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeVisible: () => Ra.unlocks.unlockHardV.isUnlocked,
        scalingUpgradeText: () => {
          const triadCount = Ra.unlocks.unlockHardV.effectOrDefault(0);
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
      this.isDoomed = Pelle.isDoomed;
      this.memoriesPerChunk = Ra.productionPerMemoryChunk;
      this.isRaCapped = Ra.totalPetLevel === 100;
      this.totalLevels = Ra.totalPetLevel;
      this.showRecollection = Ra.unlocks.effarigUnlock.canBeApplied;
      this.hasRecollection = Ra.recollection.isUnlocked;
      this.recollectionReq = Ra.recollection.requiredLevels;
      this.recollectionMult = Ra.recollection.multiplier;
      this.petWithRecollection = Ra.petWithRecollection;
      this.isRunning = Ra.isRunning;
      this.memoryBoosts = Ra.memoryBoostResources;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Ra's", number: 4 });
    },
    toggleMode() {
      Ra.toggleMode();
    }
  },
};
</script>

<template>
  <div class="l-ra-celestial-tab">
    <div class="c-ra-memory-header">
      <CelestialQuoteHistory celestial="ra" />
      <div v-if="!isRaCapped">
        Each Memory Chunk generates a base of one Memory per second, which has been increased to
        {{ quantify("Memory", memoriesPerChunk, 2, 3) }}
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
      and mouse-over <i class="fas fa-question-circle" /> icons for specific resource information.
    </div>
    <div class="l-ra-all-pets-container">
      <RaPet
        v-for="(pet, i) in pets"
        :key="i"
        :pet-config="pet"
      />
    </div>
    <div class="l-ra-non-pets">
      <button class="c-ra-run-button">
        <h2>
          <span v-if="isDoomed">You can't start<br></span>
          <span v-else-if="isRunning">You are in </span>
          <span v-else>Start </span>
          Ra's Reality
        </h2>
        <div
          :class="runButtonClassObject"
          @click="startRun"
        >
          <span class="c-ra-run-button__icon__sigil fas fa-sun" />
        </div>
        <span
          v-for="(line, lineId) in runDescription"
          :key="lineId + '-ra-run-desc'"
        >
          {{ line }}
        </span>
      </button>
      <div
        v-if="showRecollection && !isRaCapped"
        class="c-ra-recollection-unlock"
      >
        <h1 :style="petStyle">
          Recollection
        </h1>
        <span :style="petStyle">
          Whichever Celestial has Recollection will get {{ formatX(recollectionMult) }} Memory Chunk gain.
        </span>
        <div
          v-if="hasRecollection"
          class="c-ra-recollection-unlock-inner"
        >
          <RaPetRecollectionButton
            v-for="(pet, i) in pets"
            :key="i"
            :pet-config="pet"
          />
        </div>
        <div
          v-else
          class="c-ra-recollection-unlock-inner"
        >
          Unlocked by getting {{ formatInt(recollectionReq) }} total Celestial Memory levels
          (you need {{ formatInt(recollectionReq - totalLevels) }} more)
        </div>
      </div>
    </div>
  </div>
</template>
