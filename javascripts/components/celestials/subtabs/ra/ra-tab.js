"use strict";

Vue.component("ra-tab", {
  data() {
    return {
      memoriesPerChunk: 0,
      showReality: false,
      hasRecollection: false,
      showLaitela: false,
    };
  },
  methods: {
    update() {
      this.memoriesPerChunk = Ra.productionPerMemoryChunk();
      this.hasRecollection = Ra.has(RA_RECOLLECTION_UNLOCK);
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
        scalingUpgradeText: () => `You can charge ${formatInt(Ra.totalCharges)} 
          Infinity ${pluralize("Upgrade", Ra.totalCharges)}.`,
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeText: () => {
          const resources = AlchemyResources.all.filter(r => r.isUnlocked).length;
          return `You have unlocked ${formatInt(resources)} alchemy ${pluralize("resource", resources)}.`;
        },
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeText: () => `Stored game time 
          ${formatPow(RA_UNLOCKS.IMPROVED_STORED_TIME.effect.gameTimeAmplification(), 0, 2)}.`,
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeText: level => {
          const triadCount = Math.floor(level / 5);
          return `You have unlocked ${formatInt(triadCount)} triad ${pluralize("study", triadCount, "studies")}.`;
        },
      }
    ]
  },
  template:
    `<div class="l-ra-celestial-tab">
      <div class="c-ra-memory-header">
        Each memory chunk generates
        {{ format(memoriesPerChunk, 2, 2) }} {{ "memory" | pluralize(memoriesPerChunk, "memories") }}
        per second.
      </div>
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
            Inside of Ra's reality, some resources will generate memory chunks.
          </div>
        </button>
        <div class="l-ra-recollection-unlock">
          <div class="l-ra-recollection-unlock-inner" v-if="hasRecollection">
            Whichever celestial has recollection will get {{formatInt(2)}}x memory chunk gain.
            <br/>
            <table>
              <tr>
                <td><ra-pet-recollection-button :petConfig="pets[0]" /></td>
                <td><ra-pet-recollection-button :petConfig="pets[1]" /></td>
              </tr>
              <tr>
                <td><ra-pet-recollection-button :petConfig="pets[2]" /></td>
                <td><ra-pet-recollection-button :petConfig="pets[3]" /></td>
              </tr>
            </table>
          </div>
          <div class="l-ra-recollection-unlock-inner" v-else>
            <h1>Recollection</h1>
            <p>Unlocked by getting {{ formatInt(20) }} total celestial levels</p>
            <p>Recollection lets you choose a celestial to gain {{formatInt(2)}}x memory chunks.</p>
          </div>
        </div>
        <button class="l-ra-laitela-unlock" v-if="showLaitela">
          <div class="l-ra-laitela-unlock-inner">
            <h1> Lai'tela: </h1>
            <h2> The Celestial of Matter </h2>
            <p> Unlocked by getting {{ formatInt(80) }} total celestial levels</p>
          </div>
        </button>
      </div>
    </div>`
});
