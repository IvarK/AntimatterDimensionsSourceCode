"use strict";

Vue.component("ra-tab", {
  data() {
    return {
      fillPercentage: "",
      exp: 0,
      expRequired: 0,
      level: 0,
      totalCharges: 0,
      unlocks: [],
      realityReward: 0,
      activeMode: false
    };
  },
  methods: {
    update() {
      this.fillPercentage = `${Ra.percentageToNextLevel * 100}%`;
      this.exp = player.celestials.ra.exp;
      this.expRequired = Ra.requiredExp;
      this.level = player.celestials.ra.level;
      this.totalCharges = Ra.totalCharges;
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
    }
  },
  template:
    `<div class="l-ra-celestial-tab">
      <div class="l-ra-teresa-container">
        <h2>Teresa</h2>
        <p>Level {{ level }}</p>
        <div class="c-ra-teresa-experience">
          <div class="c-ra-teresa-experience-inner" :style="{ 'width': fillPercentage }">
            <b class="o-ra-exp-display">{{ shortenSmallInteger(exp) }}/{{ shortenSmallInteger(expRequired) }}</b>
          </div>
        </div>
        <div class="c-ra-teresa-switch-container" @click="toggleMode()" v-if="has(2)">
          <div class="o-ra-teresa-switch o-ra-teresa-switch-active" :class="{ 'o-ra-teresa-switch-active-on': activeMode }">Active</div>
          <div class="o-ra-teresa-switch o-ra-teresa-switch-idle" :class="{ 'o-ra-teresa-switch-idle-on': !activeMode }">Idle</div>
        </div>
        <div v-if="has(2)">{{ activeMode ? "You gain 4x memories from manual realities" : "You gain 2x memories from automatic realities"}}</div>
      </div>
      <div>You can charge {{ totalCharges }} Infinity {{ "Upgrade" | pluralize(totalCharges) }}.</div>
      <div class="l-ra-unlocks-container">
        <div class="c-ra-unlock" v-for="unlock in raUnlocks" :class="{'c-ra-unlock-unlocked': has(unlock.id)}">
          <b>{{ unlock.description }}</b>
          <p>Reward: {{ unlock.reward }}</p>
        </div>
      </div>
      <button v-if="has(1)" @click="startRun()" class="o-v-run-button">
        Start Ra's Reality, you can't dimension boost and tick reduction is forced to be 11%.
        <br><br>
        Multiply Teresa memory gain based on highest EP reached, Currently: {{ shorten(realityReward, 2, 2)}}x
      </button>
    </div>`
});