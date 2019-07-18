"use strict";

Vue.component("ra-tab", {
  data() {
    return {
      unlocks: [],
      realityReward: 0,
      activeMode: false,
      expMultis: [0, 0, 0, 0],
    };
  },
  methods: {
    update() {
      this.unlocks = player.celestials.ra.unlocks;
      this.realityReward = Ra.realityReward;
      this.activeMode = player.celestials.ra.activeMode;
      this.expMultis = this.pets.map(obj => obj.pet.expBoost);
    },
    has(id) {
      return this.unlocks.includes(id);
    },
    startRun() {
      Ra.startRun();
    },
    toggleMode() {
      Ra.toggleMode();
    }
  },
  computed: {
    raUnlocks() {
      return RA_UNLOCKS;
    },
    laitelaUnlock() {
      return this.raUnlocks.LAITELA_UNLOCK;
    },
    pets: () => [
      {
        pet: Ra.pets.teresa,
        scalingUpgradeText: level => `You can charge ${Math.floor(level / 2)} Infinity Upgrades.`,
        unlocks: raUnlocks => Object.entries(raUnlocks).filter(([, value]) => value.id <= 5)
          .map(([, value]) => value)
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeText: level => `Glyph rarity +${level}% and +${Math.floor(level / 5)} additional choices.`,
        unlocks: raUnlocks => Object.entries(raUnlocks).filter(([, value]) => value.id > 5 && value.id <= 11)
        .map(([, value]) => value)
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeText: level => `Stored game time ^${(1 + 0.01 * Math.floor(level)).toFixed(2)}, ` +
          `stored real time efficiency +${level}% and +${level / 2} hours maximum.`,
        unlocks: raUnlocks => Object.entries(raUnlocks).filter(([, value]) => value.id > 11 && value.id <= 17)
        .map(([, value]) => value)
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeText: level => `+${Math.floor(level)} free achievements.`,
        unlocks: raUnlocks => Object.entries(raUnlocks).filter(([, value]) => value.id > 17 && value.id <= 23)
        .map(([, value]) => value)
      }
    ]
  },
  template:
    `<div class="l-ra-celestial-tab">
      <div class="l-ra-all-pets-container">
        <ra-pet v-for="(pet, i) in pets" :key="i" :petConfig="pet" />
      </div>
      <div class="l-ra-non-pets">
        <button @click="startRun()" class="l-ra-reality-container">
          <div class="l-ra-reality-inner">
            <h1> Start Ra's Reality</h1
            <p> Rules: you can't dimension boost and tick reduction is forced to be 11%. </p>
            <br>
            <br>
            <h2> Rewards: </h2>
            <h3> Teresa: {{this.shorten(expMultis[0], 2, 2)}}x</h3>
            <h3> Effarig: {{this.shorten(expMultis[1], 2, 2)}}x</h3>
            <h3> Enslaved: {{this.shorten(expMultis[2], 2, 2)}}x</h3>
            <h3> V: {{this.shorten(expMultis[3], 2, 2)}}x</h3>
          </div>
        </button>
        <button class="l-ra-laitela-unlock">
          <div class="l-ra-laitela-unlock-inner">
            <h1> Lai'tela: </h1>
            <h2> The Celestial of Matter </h2>
            <p> Unlocked getting all four celestials to level 20 </p>
          </div>
        </button>
      </div>
    </div>`
});
