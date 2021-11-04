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
          return this.canSwapImages ? { "cursor": "pointer" } : {};
        }
      },
      methods: {
        update() {
          const isCancerTheme = Theme.current().name === "S4";
          this.canSwapImages = !isCancerTheme && Themes.find("S4").isAvailable();
          this.isCancerImages = isCancerTheme || player.secretUnlocks.cancerAchievements;
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
      achTPEffect: 0,
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
      renderedRows: []
    };
  },
  watch: {
    isAutoAchieveActive(newValue) {
      player.reality.autoAchieve = newValue;
    },
    hideCompletedRows(newValue) {
      player.options.hideCompletedAchievementRows = newValue;
      this.startRowRendering();
    }
  },
  computed: {
    rows: () => Achievements.allRows,
    boostText() {
      const achievementPower = formatX(this.achievementPower, 2, 3);
      const achTPEffect = formatX(this.achTPEffect, 2, 3);

      const boostList = [];

      const dimMultList = [];
      dimMultList.push("Antimatter");
      if (this.achMultToIDS) dimMultList.push("Infinity");
      if (this.achMultToTDS) dimMultList.push("Time");
      boostList.push(`${makeEnumeration(dimMultList)} Dimensions: ${achievementPower}`);

      if (this.achMultToTP) boostList.push(`Tachyon Particles: ${achTPEffect}`);
      if (this.achMultToBH) boostList.push(`Black Hole Power: ${achievementPower}`);
      if (this.achMultToTT) boostList.push(`Time Theorem production: ${achievementPower}`);
      return `${boostList.join("<br>")}`;
    },
  },
  methods: {
    update() {
      const gameSpeedupFactor = getGameSpeedupFactor();
      this.achievementPower = Achievements.power;
      this.achTPEffect = RealityUpgrade(8).config.effect();
      this.achCountdown = Achievements.timeToNextAutoAchieve / gameSpeedupFactor;
      this.totalCountdown = ((Achievements.preReality.countWhere(a => !a.isUnlocked) - 1) * Achievements.period +
        Achievements.timeToNextAutoAchieve) / gameSpeedupFactor;
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
    startRowRendering() {
      const unlockedRows = [];
      const lockedRows = [];
      for (let i = 0; i < this.rows.length; i++) {
        const targetArray = this.rows[i].every(a => a.isUnlocked) ? unlockedRows : lockedRows;
        targetArray.push(i);
      }
      const renderedLockedRows = lockedRows.filter(row => this.renderedRows.includes(row));
      const nonRenderedLockedRows = lockedRows.filter(row => !this.renderedRows.includes(row));
      let rowsToRender;
      if (player.options.hideCompletedAchievementRows) {
        this.renderedRows = unlockedRows.concat(renderedLockedRows);
        rowsToRender = nonRenderedLockedRows;
      } else {
        this.renderedRows = renderedLockedRows;
        rowsToRender = unlockedRows.concat(nonRenderedLockedRows);
      }
      const stepThroughRendering = () => {
        const ROWS_PER_FRAME = 2;
        for (let i = 0; i < ROWS_PER_FRAME; i++) {
          if (rowsToRender.length === 0) {
            return;
          }
          this.renderedRows.push(rowsToRender.shift());
        }
        this.renderAnimationId = requestAnimationFrame(stepThroughRendering);
      };
      stepThroughRendering();
    },
    isRendered(row) {
      return this.renderedRows.includes(row);
    },
    timeDisplay,
    timeDisplayNoDecimals,
  },
  created() {
    this.startRowRendering();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderAnimationId);
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
        <normal-achievement-row v-for="(row, i) in rows" v-if="isRendered(i)" :key="i" :row="row" />
      </div>
    </div>`
});
