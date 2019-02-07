Vue.component('challenge-records-tab', {
  data: function() {
    return {
      challengeTimes: player.challengeTimes,
      infchallengeTimes: player.infchallengeTimes,
    };
  },
  computed: {
    normalChallenges: function() {
      return this.challengeTimes;
    },
    infinityChallenges: function() {
      return this.infchallengeTimes;
    }
  },
  template:
    `<div class="l-challenge-records-tab">
        <challenge-records-list
            :start="2"
            :times="normalChallenges"
            name="Challenge"
        />
        <challenge-records-list
            :start="1"
            :times="infinityChallenges"
            name="Infinity Challenge"
            class="l-challenge-records-tab__infinity_challenges"
        />
    </div>`
});