"use strict";

Vue.component("normal-achievements-tab", {
  data() {
    return {
      achPower: new Decimal(0),
      achCountdown: 0,
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
  },
  template:
    `<div>
      <div class="c-achievements-tab__header">
        Current achievement multiplier on each Dimension: {{ shorten(achPower, 2, 3) }}x
      </div>
      <div v-if="achCountdown > 0" class="c-achievements-tab__header">
        Next automatic achievement in {{timeDisplayNoDecimals(achCountdown)}}
      </div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="(row, i) in rows" :key="i" :row="row" />
      </div>
    </div>`
});
