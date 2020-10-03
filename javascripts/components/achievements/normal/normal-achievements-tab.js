"use strict";

Vue.component("normal-achievements-tab", {
  data() {
    return {
      achievementPower: 0,
      achCountdown: 0,
      showAutoAchieve: false,
      isAutoAchieveActive: false,
      hideCompletedRows: false,
      isCancer: 0,
      achMultToIDS: false,
      achMultToTDS: false,
      achMultToBH: false,
      canSwapImages: false
    };
  },
  computed: {
    rows: () => Achievements.allRows,
    swapImagesButton() {
      return Theme.current().name === "S4" || this.isCancer ? "😂" : ".";
    },
    achievementMultiplierText() {
      let text = "Current achievement multiplier to ";
      if (this.achMultToIDS && this.achMultToTDS && this.achMultToBH)
        text += "Black Hole power, Antimatter, Infinity, and Time";
      else if (this.achMultToTDS && this.achMultToIDS) text += "Antimatter, Infinity, and Time";
      else if (this.achMultToTDS) text += "Antimatter and Time";
      else if (this.achMultToIDS) text += "Antimatter and Infinity";
      else text += "Antimatter";
      text += " Dimensions:";
      return text;
    },
    imageSwapperStyleObject() {
      if (this.canSwapImages) {
        return { "cursor": "pointer" };
      }
      return {};
    }
  },
  watch: {
    isAutoAchieveActive(newValue) {
      player.reality.autoAchieve = newValue;
    },
    hideCompletedRows(newValue) {
      player.options.hideCompletedAchievementRows = newValue;
    }
  },
  methods: {
    update() {
      this.achievementPower = Achievements.power;
      this.achCountdown = Achievements.timeToNextAutoAchieve() / getGameSpeedupFactor();
      this.showAutoAchieve = player.realities > 0 && !Perk.achievementGroup6.isBought;
      this.isAutoAchieveActive = player.reality.autoAchieve;
      this.hideCompletedRows = player.options.hideCompletedAchievementRows;
      this.isCancer = player.secretUnlocks.cancerAchievements;
      this.achMultToIDS = Achievement(75).isUnlocked;
      this.achMultToTDS = EternityUpgrade.tdMultAchs.isBought;
      this.achMultToBH = V.has(V_UNLOCKS.ACHIEVEMENT_BH);
      this.canSwapImages = Themes.available().find(v => v.name === "S4") !== undefined && Theme.current().name !== "S4";
    },
    timeDisplay(value) {
      return timeDisplay(value);
    },
    timeDisplayNoDecimals(value) {
      return timeDisplayNoDecimals(value);
    },
    swapImages() {
      if (this.canSwapImages) {
        player.secretUnlocks.cancerAchievements = !player.secretUnlocks.cancerAchievements;
      }
    }
  },
  template: `
    <div class="l-achievements-tab">
      <div class="c-subtab-option-container">
        <primary-button-on-off
          v-model="hideCompletedRows"
          class="o-primary-btn--subtab-option"
          text="Hide completed rows:"
        />
        <primary-button-on-off
          v-if="showAutoAchieve"
          v-model="isAutoAchieveActive"
          class="o-primary-btn--subtab-option"
          text="Auto Achievements:"
        />
      </div>
      <div class="c-achievements-tab__header">
        <span>
          {{ achievementMultiplierText }} {{ formatX(achievementPower, 2, 3) }}<span 
          @click="swapImages()" :style="imageSwapperStyleObject">{{ swapImagesButton }}</span>
        </span>
      </div>
      <div v-if="achCountdown > 0" class="c-achievements-tab__header">
        Automatically gain the next missing Achievement in {{timeDisplayNoDecimals(achCountdown)}}.
        (left-to-right, top-to-bottom)
      </div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="(row, i) in rows" :key="i" :row="row" />
      </div>
    </div>`
});
