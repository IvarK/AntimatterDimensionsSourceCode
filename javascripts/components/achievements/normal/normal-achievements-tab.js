"use strict";

Vue.component("normal-achievements-tab", {
  components: {
    "swap-images-button": {
      data() {
        return {
          canSwapImages: false,
          isCancerImages: false,
        };
      },
      computed: {
        swapImagesButton() {
          return this.isCancerImages ? "😂" : ":";
        },
        imageSwapperStyleObject() {
          if (this.canSwapImages) {
            return { "cursor": "pointer" };
          }
          return {};
        }
      },
      methods: {
        update() {
          const isCancerTheme = Theme.current().name === "S4";
          this.canSwapImages = Themes.find("S4").isAvailable() && !isCancerTheme;
          this.isCancerImages = player.secretUnlocks.cancerAchievements || isCancerTheme;
        },
        swapImages() {
          if (this.canSwapImages) {
            player.secretUnlocks.cancerAchievements = !player.secretUnlocks.cancerAchievements;
          }
        }
      },
      template: `
        <span @click="swapImages" :style="imageSwapperStyleObject">{{ swapImagesButton }}</span>`
    }
  },
  data() {
    return {
      achievementPower: 0,
      achTPeffect: 0,
      achCountdown: 0,
      totalCountdown: 0,
      missingAchievements: 0,
      showAutoAchieve: false,
      isAutoAchieveActive: false,
      hideCompletedRows: false,
      achMultBreak: false,
      achMultToIDS: false,
      achMultToTDS: false,
      achMultToBH: false,
      achMultToTP: false,
      achMultToTT: false,
    };
  },
  watch: {
    isAutoAchieveActive(newValue) {
      player.reality.autoAchieve = newValue;
    },
    hideCompletedRows(newValue) {
      player.options.hideCompletedAchievementRows = newValue;
    }
  },
  computed: {
    rows: () => Achievements.allRows,
    boostText() {
      const boostList = [];

      const dimMultList = [];
      dimMultList.push("Antimatter");
      if (this.achMultToIDS) dimMultList.push("Infinity");
      if (this.achMultToTDS) dimMultList.push("Time");
      const dimMult = `Dimensions: ${formatX(this.achievementPower, 2, 3)}`;
      switch (dimMultList.length) {
        case 1:
          boostList.push(`${dimMultList[0]} ${dimMult}`);
          break;
        case 2:
          boostList.push(`${dimMultList[0]} and ${dimMultList[1]} ${dimMult}`);
          break;
        default:
          boostList.push(`${dimMultList.slice(0, -1).join(", ")},
            and ${dimMultList[dimMultList.length - 1]} ${dimMult}`);
      }

      if (this.achMultToTP) boostList.push(`Tachyon Particles: ${formatX(this.achTPeffect, 2, 3)}`);
      if (this.achMultToBH) boostList.push(`Black Hole Power: ${formatX(this.achievementPower, 2, 3)}`);
      if (this.achMultToTT) boostList.push(`Time Theorem production: ${formatX(this.achievementPower, 2, 3)}`);
      return `${boostList.join("<br>")}`;
    },
  },
  methods: {
    update() {
      this.achievementPower = Achievements.power;
      this.achTPeffect = RealityUpgrade(8).config.effect();
      this.achCountdown = Achievements.timeToNextAutoAchieve / getGameSpeedupFactor();
      this.totalCountdown = ((Achievements.preReality.countWhere(a => !a.isUnlocked) - 1) * Achievements.period +
        Achievements.timeToNextAutoAchieve) / getGameSpeedupFactor();
      this.missingAchievements = Achievements.preReality.countWhere(a => !a.isUnlocked);
      this.showAutoAchieve = PlayerProgress.realityUnlocked() && !Perk.achievementGroup5.isBought;
      this.isAutoAchieveActive = player.reality.autoAchieve;
      this.hideCompletedRows = player.options.hideCompletedAchievementRows;
      this.achMultBreak = BreakInfinityUpgrade.achievementMult.canBeApplied;
      this.achMultToIDS = Achievement(75).isUnlocked;
      this.achMultToTDS = EternityUpgrade.tdMultAchs.isBought;
      this.achMultToTP = RealityUpgrade(8).isBought;
      this.achMultToBH = V.has(V_UNLOCKS.ACHIEVEMENT_BH);
      this.achMultToTT = Ra.has(RA_UNLOCKS.TT_ACHIEVEMENT);
    },
    timeDisplay(value) {
      return timeDisplay(value);
    },
    timeDisplayNoDecimals(value) {
      return timeDisplayNoDecimals(value);
    },
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
      <div class="c-achievements-tab__header c-achievements-tab__header--multipliers">
        Your Achievements provide a multiplier to<swap-images-button />
        <div v-html="boostText" />
      </div>
      <div v-if="showAutoAchieve" class="c-achievements-tab__header">
        <div v-if="achCountdown > 0">
          Automatically gain the next missing Achievement in
          {{ timeDisplayNoDecimals(achCountdown) }}<span v-if="!isAutoAchieveActive"> once Auto is turned on</span>.
          (left-to-right, top-to-bottom)
        </div>
        <div v-else-if="missingAchievements !== 0">
          Automatically gain the next missing Achievement as soon as you enable Auto Achievements.
          (left-to-right, top-to-bottom)
        </div>
        <div v-if="totalCountdown > 0">
          You will regain all remaining achievements after {{ timeDisplayNoDecimals(totalCountdown) }} if Auto
          Achievement stays enabled.
        </div>
        <br>
      </div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="(row, i) in rows" :key="i" :row="row" />
      </div>
    </div>`
});
