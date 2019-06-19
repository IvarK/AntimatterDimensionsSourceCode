"use strict";

Vue.component("ra-tab", {
  data() {
    return {
      unlocks: [],
      realityReward: 0,
      activeMode: false
    };
  },
  methods: {
    update() {
      this.unlocks = player.celestials.ra.unlocks;
      this.realityReward = Ra.realityReward;
      this.activeMode = player.celestials.ra.activeMode;
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
    pets: () => [
      {
        pet: Ra.pets.teresa,
        scalingUpgradeText: level => `You can charge ${Math.floor(level / 2)} Infinity Upgrades.`
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeText: level => `Glyph rarity +${level}% and +${Math.floor(level / 5)} additional choices.`
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeText: level => `Stored game time ^${(1 + 0.01 * Math.floor(level)).toFixed(2)}, ` +
          `stored real time efficiency +${level}% and +${level / 2} hours maximum.`
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeText: level => `+${Math.floor(level)} free achievements.`
      }
    ]
  },
  template:
    `<div class="l-ra-celestial-tab">
      <ra-pet v-for="(pet, i) in pets" :key="i" :petConfig="pet" />
      <div class="l-ra-unlocks-container">
        <div class="c-ra-unlock" v-for="unlock in raUnlocks" :class="{'c-ra-unlock-unlocked': has(unlock.id)}">
          <b>{{ unlock.description }}</b>
          <p>Reward: {{ unlock.reward }}</p>
        </div>
      </div>
      <button v-if="has(1)" @click="startRun()" class="o-v-run-button">
        Start Ra's Reality, you can't dimension boost and tick reduction is forced to be 11%.
        <br><br>
        Reward: Increased memories based on values reached in your most recent completion of Ra's Reality.
      </button>
    </div>`
});
