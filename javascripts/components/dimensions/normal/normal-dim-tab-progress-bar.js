Vue.component('normal-dim-tab-progress-bar', {
  data: function() {
    return {
      fill: new Decimal(0),
      tooltip: String.empty
    };
  },
  computed: {
    percents: function() {
      return `${this.fill.toFixed(2)}%`;
    },
    progressBarStyle: function() {
      return {
        width: this.percents
      };
    }
  },
  methods: {
    update() {
      const setProgress = (current, goal, tooltip) => {
        this.fill.copyFrom(Decimal.min(Decimal.log10(current.add(1)) / Decimal.log10(goal) * 100, 100));
        this.tooltip = tooltip;
      };
      if (player.currentChallenge !== "") {
        setProgress(player.money, player.challengeTarget, "Percentage to challenge goal");
      } else if (!player.break) {
        setProgress(player.money, Number.MAX_VALUE, "Percentage to Infinity");
      } else if (player.infDimensionsUnlocked.includes(false)) {
        setProgress(player.money, getNewInfReq(), "Percentage to next dimension unlock");
      } else if (EternityChallenge.isRunning()) {
        setProgress(player.infinityPoints, player.eternityChallGoal, "Percentage to eternity challenge goal");
      } else {
        setProgress(player.infinityPoints, Number.MAX_VALUE, "Percentage to Eternity");
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