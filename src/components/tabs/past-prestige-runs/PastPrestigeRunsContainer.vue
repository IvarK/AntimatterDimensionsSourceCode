<script>
function averageRun(allRuns) {
  // Filter out all runs which have the default infinite value for time, but if we're left with no valid runs then we
  // take just one entry so that the averages also have the same value and we don't get division by zero.
  let runs = allRuns.filter(run => run[0] !== Number.MAX_VALUE);
  if (runs.length === 0) runs = [allRuns[0]];

  const longestRow = allRuns.map(r => r.length).max();
  const avgAttr = [];
  for (let index = 0; index < longestRow; index++) {
    if (typeof runs[0][index] === "string") {
      avgAttr.push("");
      continue;
    }
    const isNumber = typeof runs[0][index] === "number";
    const total = runs.map(run => run[index]).reduce(isNumber ? Number.sumReducer : Decimal.sumReducer);
    avgAttr.push(isNumber ? total / runs.length : Decimal.div(total, runs.length));
  }
  return avgAttr;
}

export default {
  name: "PastPrestigeRunsContainer",
  props: {
    layer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isRealityUnlocked: false,
      showRate: false,
      showRealTime: false,
      runs: [],
      hasEmptyRecord: false,
      shown: true,
      hasChallenges: false,
      longestRow: 0,
    };
  },
  computed: {
    averageRun() {
      return averageRun(this.runs);
    },
    dropDownIconClass() {
      return this.shown ? "far fa-minus-square" : "far fa-plus-square";
    },
    points() {
      return this.layer.currency;
    },
    condition() {
      return this.layer.condition();
    },
    plural() {
      return this.layer.plural;
    },
    singular() {
      return this.layer.name;
    },
    getRuns() {
      return this.layer.getRuns;
    },
    hasRealTime: () => PlayerProgress.seenAlteredSpeed(),
  },
  methods: {
    update() {
      this.runs = this.clone(this.getRuns());
      this.hasEmptyRecord = this.runs[0][0] === Number.MAX_VALUE;
      this.runs.push(this.averageRun);
      this.isRealityUnlocked = PlayerProgress.current.isRealityUnlocked;
      this.shown = player.shownRuns[this.singular];
      this.showRate = player.options.showRecentRate;
      this.hasChallenges = this.runs.map(r => this.challengeText(r)).some(t => t);

      // Entries always have all values, but sometimes the trailing ones will be blank or zero which we want to hide
      const lastIndex = arr => {
        let val = arr.length;
        while (val > 0) {
          const curr = arr[val - 1];
          if (typeof curr === "string" && curr !== "") return val;
          if (typeof curr !== "string" && Decimal.neq(curr, 0)) return val;
          val--;
        }
        return 0;
      };
      this.longestRow = this.runs.map(r => lastIndex(r)).max();
    },
    clone(runs) {
      return runs.map(run =>
        run.map(item =>
          (item instanceof Decimal ? Decimal.fromDecimal(item) : item)
        )
      );
    },
    infoArray(run, index) {
      let name;
      if (index === 0) name = "Last";
      else if (index === 10) name = "Average";
      else name = `${formatInt(index + 1)} ago`;

      const cells = [name, this.gameTime(run)];
      if (this.hasRealTime) cells.push(this.realTime(run));
      if (this.showRate) {
        cells.push(this.prestigeCurrencyRate(run));
        cells.push(this.prestigeCountRate(run));
      } else {
        cells.push(this.prestigeCurrencyGain(run));
        cells.push(this.prestigeCountGain(run));
      }

      if (this.hasChallenges) cells.push(this.challengeText(run));
      for (let i = 0; i < this.layer.extra?.length && cells.length <= this.longestRow; i++) {
        if (!this.layer.showExtra[i]()) continue;
        const formatFn = this.layer.formatExtra[i];
        const val = run[i + 5] ?? 0;
        if (this.layer.allowRate[i] && this.showRate) cells.push(this.rateText(run, run[i + 5]));
        else cells.push(formatFn(val));
      }

      return cells;
    },
    infoCol() {
      const cells = ["Run", this.hasRealTime ? "Game Time" : "Time in Run"];
      if (this.hasRealTime) cells.push("Real Time");
      const prestigeResources = this.showRate
        ? [`${this.points} Rate`, `${this.singular} Rate`]
        : [this.points, this.plural];
      cells.push(...prestigeResources);
      if (this.hasChallenges) cells.push("Challenge");

      for (let index = 0; index < this.layer.extra?.length && cells.length <= this.longestRow; index++) {
        if (!this.layer.showExtra[index]()) continue;
        cells.push((this.layer.allowRate[index] && this.showRate)
          ? this.layer.rateString[index]
          : this.layer.extra[index]);
      }
      return cells;
    },
    gameTime(run) {
      return timeDisplayShort(run[0]);
    },
    realTime(run) {
      return timeDisplayShort(run[1]);
    },
    prestigeCurrencyGain(run) {
      return `${format(run[2], 2)} ${this.points}`;
    },
    prestigeCountGain(run) {
      return quantify(this.singular, run[3]);
    },
    prestigeCurrencyRate(run) {
      return this.rateText(run, run[2]);
    },
    prestigeCountRate(run) {
      return this.rateText(run, run[3]);
    },
    rateText(run, amount) {
      const time = run[1];
      const rpm = ratePerMinute(amount, time);
      return Decimal.lt(rpm, 1)
        ? `${format(Decimal.mul(rpm, 60), 2, 2)} per hour`
        : `${format(rpm, 2, 2)} per min`;
    },
    challengeText(run) {
      return run[4];
    },
    toggleShown() {
      player.shownRuns[this.singular] = !player.shownRuns[this.singular];
    },
    cellStyle(col, isHeader) {
      let width;
      switch (col) {
        case 0:
          // "X ago" is really short
          width = "7rem";
          break;
        case 3:
        case 5:
          // Prestige currency and Challenges can potentially be very long, the reality table needs to be kept short
          width = this.layer.name === "Reality" ? "15rem" : "20rem";
          break;
        default:
          width = "13rem";
      }
      return {
        width,
        border: "0.05rem solid #999999",
        margin: "-0.05rem",
        padding: "0.2rem 0",
        "border-bottom-width": isHeader ? "0.3rem" : "0.1rem",
        "font-weight": isHeader ? "bold" : null,
        color: "var(--color-text)",
      };
    }
  }
};
</script>

<template>
  <div v-if="condition">
    <div
      class="c-past-runs-header"
      @click="toggleShown"
    >
      <span class="o-run-drop-down-icon">
        <i :class="dropDownIconClass" />
      </span>
      <span>
        <h3>Last {{ formatInt(10) }} {{ plural }}:</h3>
      </span>
    </div>
    <div v-show="shown">
      <div class="c-row-container">
        <span
          v-for="(entry, col) in infoCol()"
          :key="col"
          :style="cellStyle(col, true)"
        >
          {{ entry }}
        </span>
      </div>
      <div
        v-for="(run, index) in runs"
        :key="index"
      >
        <span
          v-if="run[0] === Number.MAX_VALUE"
          class="c-empty-row"
        >
          <i v-if="index === 10">
            An average cannot be calculated with no {{ plural }}.
          </i>
          <i v-else>
            You have not done {{ formatInt(index + 1) }}
            {{ index === 0 ? singular : plural }} yet.
          </i>
        </span>
        <span
          v-else
          class="c-row-container"
        >
          <span
            v-for="(entry, col) in infoArray(run, index)"
            :key="10 * index + col"
            :style="cellStyle(col, false)"
          >
            {{ entry }}
          </span>
        </span>
      </div>
      <br>
    </div>
  </div>
</template>

<style scoped>
.c-row-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.c-empty-row {
  display: block;
  border: 0.05rem solid #999999;
  color: var(--color-text);
  width: 100%;
  padding: 0.2rem 0;
  margin: -0.1rem;
}

.l-no-records {
  height: 5.4rem;
}
</style>