const pastRunsMixin = {
  methods: {
    runGain(run) {
      return this.shortenDimensions(run[1]);
    }
  }
};

Vue.component('past-runs-tab', {
  data: function() {
    return {
      isRealityUnlocked: false,
    };
  },
  mixins: [pastRunsMixin],
  props: {
    runs: Array,
    singular: String,
    plural: String,
    points: String,
    reward: Function,
    realTimeIndex: Number,
  },
  computed: {
    averageRun: function() {
      return averageRun(this.runs);
    }
  },
  methods: {
    update: function() {
      this.isRealityUnlocked = PlayerProgress.current.isRealityUnlocked;
    },
    averageGain: function(time, amount) {
      let rpm = ratePerMinute(amount, time);
      let tempstring = shortenRateOfChange(rpm) + " " + this.points + "/min";
      if (Decimal.lt(rpm, 1)) {
        tempstring = shortenRateOfChange(Decimal.mul(rpm, 60)) + " " + this.points + "/hour";
      }
      return tempstring;
    },
    averageRunGain: function(run) {
      return this.averageGain(run[this.realTimeIndex], run[1]);
    },
    runTime(run) {
      return timeDisplayShort(run[0]);
    },
    realRunTime(run) {
      return run[this.realTimeIndex] == undefined ? "unrecorded" : timeDisplayShort(run[this.realTimeIndex]);
    }
  },
  template:
    '<div>\
      <br>\
      <div v-for="(run, index) in runs" :key="index">\
        <span>The {{ singular }} {{ index + 1 }} {{ index === 0 ? singular : plural }} ago took {{ runTime(run) }} </span>\
        <span v-if="isRealityUnlocked"> ( {{ realRunTime(run) }} real time ) </span>\
        <span>and gave {{ reward(run) }}. {{ averageRunGain(run) }}</span>\
      </div>\
      <br>\
      <div>\
        <span>Last 10 {{ plural }} average time: {{ runTime(averageRun) }}. </span>\
        <span>Average {{ points }} gain: {{ averageRunGain(averageRun) }}.</span>\
      </div>\
    </div>'
});