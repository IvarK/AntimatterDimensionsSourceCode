"use strict";

Vue.component("normal-dim-tab-progress-bar", {
  data() {
    return {
      fill: new Decimal(0),
      tooltip: ""
    };
  },
  computed: {
    percents() {
      return `${this.fill.toFixed(2)}%`;
    },
    progressBarStyle() {
      return {
        width: this.percents
      };
    }
  },
  methods: {
    update() {
      const setProgress = (current, goal, tooltip) => {
        this.fill.copyFrom(Decimal.min(current.pLog10() / Decimal.log10(goal) * 100, 100));
        this.tooltip = tooltip;
      };
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      if (challenge) {
        setProgress(player.antimatter, challenge.goal, "Percentage to challenge goal");
      } else if (!player.break) {
        setProgress(player.antimatter, Decimal.MAX_NUMBER, "Percentage to Infinity");
      } else if (Enslaved.isCompleted) {
        setProgress(player.infinityPoints, Enslaved.tesseractCost, "Percentage to next Tesseract");
      } else if (PlayerProgress.dilationUnlocked()) {
        setProgress(player.eternityPoints, new Decimal("1e4000"), "Percentage to Reality");
      } else if (InfinityDimension(8).isUnlocked) {
        setProgress(
          player.infinityPoints,
          Player.eternityGoal,
          EternityChallenge.isRunning ? "Percentage to Eternity Challenge goal" : "Percentage to Eternity"
        );
      } else {
        setProgress(player.antimatter, InfinityDimensions.next().requirement, "Percentage to next dimension unlock");
      }
    }
  },
  template:
    `<div class="c-progress-bar">
        <div :style="progressBarStyle" class="c-progress-bar__fill">
            <span v-tooltip="tooltip" class="c-progress-bar__percents">{{percents}}</span>
          </div>
    </div>`
});
