"use strict";

Vue.component("past-runs-container", {
  data() {
    return {
      isRealityUnlocked: false,
      showGainPerTime: false,
      runs: Array.repeat(0, 10).map(() => [0, new Decimal(0), 0, 0]),
      shown: true
    };
  },
  props: {
    layer: Object,
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
    prestigeCount() {
      // Happens to be the same as plural
      return this.layer.plural;
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
      this.isRealityUnlocked = PlayerProgress.current.isRealityUnlocked;
      this.shown = player.shownRuns[this.singular];
      this.showGainPerTime = player.options.showLastTenRunsGainPerTime;
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
    realRunTime: run => (run[3] === undefined ? "unrecorded" : timeDisplayShort(run[3]))
  },
  template:
    `<div
      v-if="condition"
    >
      <br>
      <div
        class="c-past-runs-header"
        v-on:click="toggleShown"
        >
        <span class="o-run-drop-down-icon" v-html="dropDown" />
        <span>
          <h3>Past {{ formatInt(10) }} {{ plural }}</h3>
        </span>
      </div>
      <div v-show="shown">
        <div v-for="(run, index) in runs" :key="index">
          <span>
            The {{ singular }} {{ formatInt(index + 1) }}
            {{ index === 0 ? singular : plural }} ago took {{ runTime(run) }}
          </span>
          <span v-if="isRealityUnlocked"> ({{ realRunTime(run) }} real time) </span>
          <span>and gave </span>
          <span v-if="showGainPerTime">
            {{ averageRunGain(run, 1, points) }} and {{ averageRunGain(run, 2, prestigeCount) }}.
          </span>
          <span v-else>
            {{ reward(runGain(run), run, false) }} and {{ prestigeCountReward(runPrestigeCountGain(run, false), run) }}.
          </span>
        </div>
        <br>
      </div>
      <div>
        <span>Last {{ formatInt(10) }} {{ plural }} average time: {{ runTime(averageRun) }}. </span>
        <span v-if="showGainPerTime">
          <span>Average {{ points }} gain: {{ averageRunGain(averageRun, 1, points) }}.</span>
          <span>Average {{ prestigeCount }} gain:
            {{ averageRunGain(averageRun, 2, prestigeCount) }}.</span>
        </span>
        <span v-else>
          <span>Average {{ points }} gain: {{ reward(runGain(averageRun), averageRun, true) }}.</span>
          <span>Average {{ prestigeCount }} gain:
            {{ prestigeCountReward(runPrestigeCountGain(averageRun, true), averageRun) }}.</span>
        </span>
      </div>
    </div>`
});
