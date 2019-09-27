"use strict";

Vue.component("normal-achievements-tab", {
  data() {
    return {
      achPower: new Decimal(0),
      achCountdown: 0,
      disableAutoAchieve: false,
      isCancer: 0
    };
  },
  computed: {
    rows: () => Achievements.rows(1, 15),
    swapImagesButton() {
      return Theme.current().name === "S4" || this.isCancer ? "😂" : ".";
    }
  },
  methods: {
    update() {
      this.achPower.copyFrom(Player.achievementPower);
      this.achCountdown = Achievements.timeToNextAutoAchieve();
      this.isCancer = player.secretUnlocks.cancerAchievements;
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
    },
    swapImages() {
      if (Themes.available().find(v => v.name === "S4") !== undefined && Theme.current().name !== "S4") {
        player.secretUnlocks.cancerAchievements = !player.secretUnlocks.cancerAchievements;
      }
    }
  },
  created() {
    this.disableAutoAchieve = player.reality.disableAutoAchieve;
  },
  template:
    `<div>
      <div class="c-achievements-tab__header">
        Current achievement multiplier on each Dimension: {{ shorten(achPower, 2, 3) }}x
        <span @click="swapImages()" style="cursor: pointer">{{ swapImagesButton }}</span>
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
