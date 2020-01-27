"use strict";

Vue.component("past-runs-tab", {
  data() {
    return {
      isRealityUnlocked: false,
      runs: Array.repeat(0, 10).map(() => [0, new Decimal(0), 0, 0])
    };
  },
  props: {
    getRuns: Function,
    singular: String,
    plural: String,
    points: String,
    reward: Function,
  },
  computed: {
    averageRun() {
      return averageRun(this.runs);
    }
  },
  methods: {
    update() {
      this.runs = this.clone(this.getRuns());
      this.isRealityUnlocked = PlayerProgress.current.isRealityUnlocked;
    },
    clone(runs) {
      return runs.map(run =>
        run.map(item =>
          (item instanceof Decimal ? Decimal.fromDecimal(item) : item)
        )
      );
    },
    averageRunGain(run) {
      const amount = run[1];
      const time = run[2];
      const rpm = ratePerMinute(amount, time);
      return Decimal.lt(rpm, 1)
        ? `${format(Decimal.mul(rpm, 60), 2, 2)} ${this.points}/hour`
        : `${format(rpm, 2, 2)} ${this.points}/min`;
    },
    runTime: run => timeDisplayShort(run[0]),
    runGain: run => format(run[1], 2, 0),
    realRunTime: run => (run[2] === undefined ? "unrecorded" : timeDisplayShort(run[2]))
  },
  template:
    `<div class="c-stats-tab">
      <br>
      <div v-for="(run, index) in runs" :key="index">
        <span>
          The {{ singular }} {{ formatInt(index + 1) }}
          {{ index === 0 ? singular : plural }} ago took {{ runTime(run) }}
        </span>
        <span v-if="isRealityUnlocked"> ({{ realRunTime(run) }} real time) </span>
        <span>and gave {{ reward(runGain(run), run) }}. {{ averageRunGain(run) }}</span>
      </div>
      <br>
      <div>
        <span>Last {{ formatInt(10) }} {{ plural }} average time: {{ runTime(averageRun) }}. </span>
        <span>Average {{ points }} gain: {{ averageRunGain(averageRun) }}.</span>
      </div>
    </div>`
});
