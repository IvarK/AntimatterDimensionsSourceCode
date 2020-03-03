"use strict";

Vue.component("past-runs-container", {
  data() {
    return {
      isRealityUnlocked: false,
      runs: Array.repeat(0, 10).map(() => [0, new Decimal(0), 0, 0]),
      shown: player.shownRuns[this.singular],
    };
  },
  props: {
    layer: Object,
  },
  computed: {
    averageRun() {
      return averageRun(this.runs);
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
    }
  },
  methods: {
    update() {
      this.runs = this.clone(this.getRuns());
      this.isRealityUnlocked = PlayerProgress.current.isRealityUnlocked;
      player.shownRuns[this.singular] = this.shown;
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
    toggleShown() {
      this.shown = !this.shown;
    },
    runTime: run => timeDisplayShort(run[0]),
    runGain: run => format(run[1], 2, 0),
    realRunTime: run => (run[2] === undefined ? "unrecorded" : timeDisplayShort(run[2]))
  },
  template:
    `<div
      class="c-stats-tab"
      v-if="condition"
    >
      <br>
      <div
        class="c-past-runs-header"
        v-on:click="toggleShown"
        >
        <span class="o-run-drop-down-icon" v-html="dropDown" />
        <span>
          <h3>Past 10 {{ plural }}</h3>
        </span>
      </div>
      <div v-show="shown">
        <div v-for="(run, index) in runs" :key="index">
          <span>
            The {{ singular }} {{ formatInt(index + 1) }}
            {{ index === 0 ? singular : plural }} ago took {{ runTime(run) }}
          </span>
          <span v-if="isRealityUnlocked"> ({{ realRunTime(run) }} real time) </span>
          <span>and gave {{ reward(runGain(run), run) }}. {{ averageRunGain(run) }}</span>
        </div>
        <br>
      </div>
      <div>
        <span>Last {{ formatInt(10) }} {{ plural }} average time: {{ runTime(averageRun) }}. </span>
        <span>Average {{ points }} gain: {{ averageRunGain(averageRun) }}.</span>
      </div>
    </div>`
});
