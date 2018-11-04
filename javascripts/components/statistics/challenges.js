Vue.component('statistics-challenges', {
  data: function() {
    return {
      challengeTimes: player.challengeTimes,
      infchallengeTimes: player.infchallengeTimes,
    };
  },
  template:
    `<div class="l-challenge-records-tab">
        <statistics-challenge-times
            :start="2"
            :times="normalChallenges"
            name="Challenge"
        />
        <statistics-challenge-times
            :start="1"
            :times="infinityChallenges"
            name="Infinity Challenge"
            class="l-challenge-records-tab__infinity_challenges"
        />
    </div>`,
  computed: {
    normalChallenges: function() {
      let challenges = this.challengeTimes;
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
      return this.infchallengeTimes;
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
        <div v-for="(time, index) in times" :key="index">\
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