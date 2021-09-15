"use strict";

Vue.component("antimatter-dim-tab-progress-bar", {
  data() {
    return {
      fill: 0,
      tooltip: ""
    };
  },
  computed: {
    displayPercents() {
      return formatPercents(this.fill, 2);
    },
    progressBarStyle() {
      return {
        width: `${(this.fill * 100).toFixed(2)}%`
      };
    }
  },
  methods: {
    update() {
      const setProgress = (current, goal, tooltip) => {
        this.fill = Math.clampMax(current.pLog10() / Decimal.log10(goal), 1);
        this.tooltip = tooltip;
      };
      if (Player.isInAntimatterChallenge) {
        setProgress(Currency.antimatter.value, Player.antimatterChallenge.goal, "Percentage to challenge goal");
      } else if (!player.break) {
        setProgress(Currency.antimatter.value, Decimal.NUMBER_MAX_VALUE, "Percentage to Infinity");
      } else if (Enslaved.isCompleted) {
        setProgress(Currency.infinityPoints.value, Tesseracts.nextCost, "Percentage to next Tesseract");
      } else if (PlayerProgress.dilationUnlocked()) {
        setProgress(Currency.eternityPoints.value, new Decimal("1e4000"), "Percentage to Reality");
      } else if (InfinityDimension(8).isUnlocked) {
        setProgress(
          Currency.infinityPoints.value,
          Player.eternityGoal,
          EternityChallenge.isRunning ? "Percentage to Eternity Challenge goal" : "Percentage to Eternity"
        );
      } else {
        setProgress(
          Currency.antimatter.value,
          InfinityDimensions.next().requirement,
          "Percentage to next dimension unlock");
      }
    }
  },
  template: `
    <div class="c-progress-bar">
      <div :style="progressBarStyle" class="c-progress-bar__fill">
        <span v-tooltip="tooltip" class="c-progress-bar__percents">{{ displayPercents }}</span>
      </div>
    </div>`
});
