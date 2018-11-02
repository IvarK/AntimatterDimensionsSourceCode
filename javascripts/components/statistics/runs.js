const pastRunsMixin = {
  methods: {
    runGain(run) {
      return this.shortenDimensions(run[1]);
    }
  }
};

Vue.component('statistic-past-infinities', {
  mixins: [pastRunsMixin],
  data: function() {
    return {
      runs: player.lastTenRuns,
      reward: function(run) {
        return this.runGain(run) + " IP";
      }
    };
  },
  template:
    `<statistic-past-runs
      :runs="runs"
      singular="Infinity"
      plural="Infinities"
      points="IP"
      :reward="reward"
    />`
});

Vue.component('statistic-past-eternities', {
  mixins: [pastRunsMixin],
  data: function() {
    return {
      runs: player.lastTenEternities,
      reward: function(run) {
        return this.runGain(run) + " EP";
      }
    };
  },
  template:
    `<statistic-past-runs
        :runs="runs"
        singular="Eternity"
        plural="Eternities"
        points="EP"
        :reward="reward"
    />`
});

Vue.component('statistic-past-realities', {
  mixins: [pastRunsMixin],
  data: function() {
    return {
      runs: player.lastTenRealities,
      reward: function(run) {
        let rm = run[1].eq(1) ? " reality machine" : " reality machines";
        return this.runGain(run) + rm + " and a level " + run[2] + " glyph";
      }
    };
  },
  template:
    `<statistic-past-runs
        :runs="runs"
        singular="Reality"
        plural="Realities"
        points="RM"
        :reward="reward"
    />`
});

Vue.component('statistic-past-runs', {
  mixins: [pastRunsMixin],
  props: {
    runs: Array,
    singular: String,
    plural: String,
    points: String,
    reward: Function
  },
  template:
    '<div class="statstab">\
        <br>\
        <div v-for="(run, index) in runs" :key="index">\
            <span>The {{ singular }} {{ index + 1 }} {{ index === 0 ? singular : plural }} ago took {{ runTime(run) }} </span>\
            <span>and gave {{ reward(run) }}. {{ averageRunGain(run) }}</span>\
        </div>\
        <br>\
        <div>\
            <span>Last 10 {{ plural }} average time: {{ runTime(averageRun) }} </span>\
            <span>Average {{ points }} gain: {{ averageRunGain(averageRun) }} {{ points }}.</span>\
        </div>\
    </div>',
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
  computed: {
    averageRun: function() {
      return averageRun(this.runs);
    }
  }
});