Vue.component('challenge-records-tab', {
  data: function() {
    return {
      challengeTimes: player.challengeTimes,
      infchallengeTimes: player.infchallengeTimes,
    };
  },
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