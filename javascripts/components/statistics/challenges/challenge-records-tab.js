Vue.component('challenge-records-tab', {
  data: function() {
    return {
      normalChallenges: player.challengeTimes.slice(0),
      infinityChallenges: player.infchallengeTimes.slice(0),
    };
  },
  methods: {
    update() {
      this.normalChallenges = player.challengeTimes.slice(0);
      this.infinityChallenges = player.infchallengeTimes.slice(0);
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