"use strict";

Vue.component("past-runs-container", {
  props: {
    layer: Object,
  },
  data() {
    return {
      isRealityUnlocked: false,
      showResources: false,
      runs: Array.repeat(0, 10).map(() => [0, new Decimal(0), 0, 0]),
      hasEmptyRecord: false,
      shown: true
    };
  },
  computed: {
    averageRun() {
      return averageRun(this.runs, this.layer.name);
    },
    dropDown() {
      return this.shown ? `<i class="far fa-minus-square"></i>` : `<i class="far fa-plus-square"></i>`;
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
    reward() {
      return this.layer.reward;
    },
    prestigeCountReward() {
      return this.layer.prestigeCountReward;
    }
  },
  methods: {
    update() {
      this.runs = this.clone(this.getRuns());
      this.hasEmptyRecord = this.runs[0][0] === Number.MAX_VALUE;
      this.isRealityUnlocked = PlayerProgress.current.isRealityUnlocked;
      this.shown = player.shownRuns[this.singular];
      this.showResources = player.options.showLastTenResourceGain;
    },
    clone(runs) {
      return runs.map(run =>
        run.map(item =>
          (item instanceof Decimal ? Decimal.fromDecimal(item) : item)
        )
      );
    },
    averageRunGain(run, index, resourceName) {
      const amount = run[index];
      const time = run[3];
      const rpm = ratePerMinute(amount, time);
      return Decimal.lt(rpm, 1)
        ? `${format(Decimal.mul(rpm, 60), 2, 2)} ${resourceName}/hour`
        : `${format(rpm, 2, 2)} ${resourceName}/min`;
    },
    toggleShown() {
      player.shownRuns[this.singular] = !player.shownRuns[this.singular];
    },
    runTime: run => timeDisplayShort(run[0]),
    runGain: run => format(run[1], 2, 0),
    runPrestigeCountGain: (run, isAverage) => format(run[2], 2, isAverage ? 1 : 0),
    realRunTime: run => (run[3] === undefined ? "unrecorded" : timeDisplayShort(run[3])),
    runLengthString(run) {
      const gameTimeString = this.runTime(run);
      const realTimeString = this.isRealityUnlocked ? ` (${this.realRunTime(run)} real time)` : "";
      return `${gameTimeString}${realTimeString}`;
    }
  },
  template: `
    <div v-if="condition">
      <br>
      <div
        class="c-past-runs-header"
        v-on:click="toggleShown"
      >
        <span class="o-run-drop-down-icon" v-html="dropDown" />
        <span>
          <h3>Last {{ formatInt(10) }} {{ plural }}:</h3>
        </span>
      </div>
      <div v-show="shown">
        <div v-for="(run, index) in runs" :key="index">
          <span v-if="run[0] === Number.MAX_VALUE">
            <span>
              You have not done {{ formatInt(index + 1) }}
              {{ index === 0 ? singular : plural }} yet.
            </span>
          </span>
          <span v-else>
            <span>
              {{ formatInt(index + 1) }}: {{ runLengthString(run) }},
            </span>
            <span v-if="showResources">
              {{ reward(runGain(run), run, false) }}, {{ averageRunGain(run, 1, points) }}
            </span>
            <span v-else>
              {{ prestigeCountReward(runPrestigeCountGain(run, false), run) }},
              {{ averageRunGain(run, 2, plural) }}
            </span>
          </span>
        </div>
        <br>
      </div>
      <div v-if="!hasEmptyRecord">
        Last {{ formatInt(10) }} {{ plural }} average time: {{ runTime(averageRun) }}
        <span v-if="isRealityUnlocked">({{ realRunTime(averageRun) }} real time)</span>
        <br>
        Average {{ points }} gain: {{ averageRunGain(averageRun, 1, points) }}
        <br>
        Average {{ plural }} gain: {{ averageRunGain(averageRun, 2, plural) }}
      </div>
      <div v-else style="height: 5.4rem;">
        You have no records for {{ plural }} yet.
      </div>
    </div>`
});
