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
        setProgress(player.money, challenge.goal, "Percentage to challenge goal");
      } else if (!player.break) {
        setProgress(player.money, Decimal.MAX_NUMBER, "Percentage to Infinity");
      } else if (!InfinityDimension(8).isUnlocked) {
        setProgress(player.money, InfinityDimensions.next().requirement, "Percentage to next dimension unlock");
      } else {
        setProgress(
          player.infinityPoints,
          Player.eternityGoal,
          EternityChallenge.isRunning ? "Percentage to Eternity Challenge goal" : "Percentage to Eternity"
        );
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
