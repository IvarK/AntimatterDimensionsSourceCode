const pastRunsMixin = {
  methods: {
    runGain(run) {
      return this.shortenDimensions(run[1]);
    }
  }
};

Vue.component('past-runs-tab', {
  mixins: [pastRunsMixin],
  props: {
    runs: Array,
    singular: String,
    plural: String,
    points: String,
    reward: Function
  },
  computed: {
    averageRun: function() {
      return averageRun(this.runs);
    }
  },
  methods: {
    averageGain: function(time, amount) {
      let rpm = ratePerMinute(amount, time);
      let tempstring = shorten(rpm) + " " + this.points + "/min";
      if (rpm < 1) {
        tempstring = shorten(rpm * 60) + " " + this.points + "/hour";
      }
      return tempstring;
    },
    averageRunGain: function(run) {
      return this.averageGain(run[0], run[1]);
    },
    runTime(run) {
      return timeDisplayShort(run[0]);
    }
  },
  template:
    '<div>\
      <br>\
      <div v-for="(run, index) in runs" :key="index">\
        <span>The {{ singular }} {{ index + 1 }} {{ index === 0 ? singular : plural }} ago took {{ runTime(run) }} </span>\
        <span>and gave {{ reward(run) }}. {{ averageRunGain(run) }}</span>\
      </div>\
      <br>\
      <div>\
        <span>Last 10 {{ plural }} average time: {{ runTime(averageRun) }}. </span>\
        <span>Average {{ points }} gain: {{ averageRunGain(averageRun) }}.</span>\
      </div>\
    </div>'
});