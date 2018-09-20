Vue.component('statistics-challenges', {
  props: ['model'],
  template:
    '<div class="statstab statsistics-challenges">\
        <statistics-challenge-times\
            name="Challenge"\
            :times="normalChallenges"\
            :start="2">\
        </statistics-challenge-times>\
        <statistics-challenge-times\
            name="Infinity Challenge"\
            :times="infinityChallenges"\
            :start="1"\
            style="margin-top: auto; margin-left: 20px;">\
        </statistics-challenge-times>\
    </div>',
  computed: {
    normalChallenges: function() {
      let challenges = this.model.player.challengeTimes;
      return [
        challenges[0],
        challenges[1],
        challenges[6],
        challenges[4],
        challenges[8],
        challenges[7],
        challenges[9],
        challenges[3],
        challenges[2],
        challenges[10],
        challenges[5]
      ];
    },
    infinityChallenges: function() {
      return this.model.player.infchallengeTimes;
    }
  }
});

Vue.component('statistics-challenge-times', {
  props: {
    name: String,
    start: Number,
    times: Array
  },
  template:
    '<div>\
        <br>\
        <div v-for="(time, index) in times">\
            <span>{{ name }} {{ start + index }} time record: {{ timeDisplayShort(time) }}</span>\
        </div>\
        <br>\
        <div>Sum of {{ name }} time records is {{ timeDisplayShort(timeSum) }}</div>\
    </div>',
  computed: {
    timeSum: function() {
      return this.times.reduce(function(acc, prev) {
        return acc + prev;
      });
    }
  },
  methods: {
    timeDisplayShort: function(time) {
      return timeDisplayShort(time);
    }
  }
});