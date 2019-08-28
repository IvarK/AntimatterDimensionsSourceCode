"use strict";

Vue.component("normal-achievements-tab", {
  data() {
    return {
      achPower: new Decimal(0),
      achCountdown: 0,
      disableAutoAchieve: false,
    };
  },
  computed: {
    rows: () => Achievements.rows(1, 15)
  },
  methods: {
    update() {
      this.achPower.copyFrom(Player.achievementPower);
      this.achCountdown = Achievements.timeToNextAutoAchieve();
    },
    timeDisplay(value) {
      return timeDisplay(value);
    },
    timeDisplayNoDecimals(value) {
      return timeDisplayNoDecimals(value);
    },
    toggleAutoAchieve() {
      // Negated because it happens before the v-model
      player.reality.disableAutoAchieve = !this.disableAutoAchieve;
    }
  },
  created() {
    this.disableAutoAchieve = player.reality.disableAutoAchieve;
  },
  template:
    `<div>
      <div class="c-achievements-tab__header">
        Current achievement multiplier on each Dimension: {{ shorten(achPower, 2, 3) }}x
      </div>
      <div v-if="achCountdown > 0" class="c-achievements-tab__header">
        Next automatic achievement in {{timeDisplayNoDecimals(achCountdown)}}
        <input type="checkbox" name="autoAchieve" v-model="disableAutoAchieve" @click="toggleAutoAchieve()"/>
        <label for="autoAchieve">Disable auto achievements</label>
      </div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="(row, i) in rows" :key="i" :row="row" />
      </div>
    </div>`
});
