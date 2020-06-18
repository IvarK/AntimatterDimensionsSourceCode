"use strict";

Vue.component("normal-achievements-tab", {
  data() {
    return {
      achievementPower: 0,
      achCountdown: 0,
      showAutoAchieve: false,
      isAutoAchieveActive: false,
      isCancer: 0,
      achMultToIDS: false,
      achMultToTDS: false,
      achMultToBH: false
    };
  },
  computed: {
    rows: () => Achievements.allRows,
    swapImagesButton() {
      return Theme.current().name === "S4" || this.isCancer ? "😂" : ".";
    },
    achievementMultiplierText() {
      let text = "Current achievement multiplier on ";
      if (this.achMultToIDS && this.achMultToTDS && this.achMultToBH)
        text += "Black Hole power, Antimatter, Infinity, and Time";
      else if (this.achMultToTDS && this.achMultToIDS) text += "Antimatter, Infinity, and Time";
      else if (this.achMultToTDS) text += "Antimatter and Time";
      else if (this.achMultToIDS) text += "Antimatter and Infinity";
      else text += "Antimatter";
      text += " Dimensions:";
      return text;
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
      this.showAutoAchieve = player.realities > 0 && !Perk.achievementGroup6.isBought;
      this.isAutoAchieveActive = player.reality.autoAchieve;
      this.isCancer = player.secretUnlocks.cancerAchievements;
      this.achMultToIDS = Achievement(75).isUnlocked;
      this.achMultToTDS = EternityUpgrade.tdMultAchs.isBought;
      this.achMultToBH = V.has(V_UNLOCKS.ACHIEVEMENT_BH);
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
  template: `
    <div class="l-achievements-tab">
      <div class="c-subtab-option-container" v-if="showAutoAchieve">
        <primary-button-on-off
          v-model="isAutoAchieveActive"
          class="o-primary-btn--subtab-option"
          text="Auto achievement:"
        />
      </div>
      <div class="c-achievements-tab__header">
        <span>
          {{ achievementMultiplierText }} {{ formatX(achievementPower, 2, 3) }}<span 
          @click="swapImages()" style="cursor: pointer">{{ swapImagesButton }}</span>
        </span>
      </div>
      <div v-if="achCountdown > 0" class="c-achievements-tab__header">
        Automatically gain the next missing achievement in {{timeDisplayNoDecimals(achCountdown)}}.
        (left-to-right, top-to-bottom)
      </div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="(row, i) in rows" :key="i" :row="row" />
      </div>
    </div>`
});
