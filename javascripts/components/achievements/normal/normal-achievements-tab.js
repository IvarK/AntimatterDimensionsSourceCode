"use strict";

Vue.component("normal-achievements-tab", {
  data() {
    return {
      achievementPower: 0,
      achCountdown: 0,
      showAutoAchieve: false,
      isAutoAchieveActive: false,
      isCancer: 0
    };
  },
  computed: {
    rows: () => Achievements.allRows,
    swapImagesButton() {
      return Theme.current().name === "S4" || this.isCancer ? "😂" : ".";
    }
  },
  watch: {
    isAutoAchieveActive(newValue) {
      player.reality.autoAchieve = newValue;
    }
  },
  methods: {
    update() {
      this.achievementPower = Achievements.power;
      this.achCountdown = Achievements.timeToNextAutoAchieve() / getGameSpeedupFactor();
      this.showAutoAchieve = player.realities > 0 && !Perk.achievementRowGroup6.isBought;
      this.isAutoAchieveActive = player.reality.autoAchieve;
      this.isCancer = player.secretUnlocks.cancerAchievements;
    },
    timeDisplay(value) {
      return timeDisplay(value);
    },
    timeDisplayNoDecimals(value) {
      return timeDisplayNoDecimals(value);
    },
    swapImages() {
      if (Themes.available().find(v => v.name === "S4") !== undefined && Theme.current().name !== "S4") {
        player.secretUnlocks.cancerAchievements = !player.secretUnlocks.cancerAchievements;
      }
    }
  },
  template:
    `<div>
      <div class="c-achievements-tab__header">
        Current achievement multiplier on each Dimension: {{ format(achievementPower, 2, 3) }}x
        <span @click="swapImages()" style="cursor: pointer">{{ swapImagesButton }}</span>
      </div>
      <div v-if="achCountdown > 0" class="c-achievements-tab__header">
        Next automatic achievement in {{timeDisplayNoDecimals(achCountdown)}}.
      </div>
      <div v-if="showAutoAchieve">
        <primary-button-on-off
          v-model="isAutoAchieveActive"
          class="o-primary-btn"
          text="Auto achievement:"
        />
        <br>
        <br>
      </div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="(row, i) in rows" :key="i" :row="row" />
      </div>
    </div>`
});
