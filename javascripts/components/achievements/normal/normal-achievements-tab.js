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
  },
  methods: {
    update() {
      this.achievementPower = Achievements.power;
      this.achTPeffect = RealityUpgrade(8).config.effect();
      this.achCountdown = Achievements.timeToNextAutoAchieve() / getGameSpeedupFactor();
      this.showAutoAchieve = PlayerProgress.realityUnlocked() && !Perk.achievementGroup6.isBought;
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
      <div class="c-achievements-tab__header">
        Your Achievements provide a multiplier to<swap-images-button />
        <div>
          <span>
            Antimatter<span v-if="achMultToTDS && achMultToIDS">, Infinity, and Time</span>
            <span v-else-if="achMultToTDS"> and Time</span>
            <span v-else-if="achMultToIDS"> and Infinity</span>
            Dimensions: {{ formatX(achievementPower, 2, 3) }}
          </span>
          <br>
          <span v-if="achMultToTP">
            Tachyon Particles: {{ formatX(achTPeffect, 2, 3) }}
          </span>
          <br>
          <span v-if="achMultToBH">
            Black Hole Power: {{ formatX(achievementPower, 2, 3) }}
          </span>
          <br>
          <span v-if="achMultToTT">
            Time Theorem production: {{ formatX(achievementPower, 2, 3) }}
          </span>
        </div>
      </div>
      <div v-if="achCountdown > 0" class="c-achievements-tab__header">
        Automatically gain the next missing Achievement in {{ timeDisplayNoDecimals(achCountdown) }}.
        (left-to-right, top-to-bottom)
      </div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="(row, i) in rows" :key="i" :row="row" />
      </div>
    </div>`
});
