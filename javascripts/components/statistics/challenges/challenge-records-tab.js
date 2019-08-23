"use strict";

Vue.component("challenge-records-tab", {
  data() {
    return {
      normalChallenges: player.challenge.normal.bestTimes.slice(0),
      infinityChallenges: player.challenge.infinity.bestTimes.slice(0),
    };
  },
  methods: {
    update() {
      this.normalChallenges = player.challenge.normal.bestTimes.slice(0);
      this.infinityChallenges = player.challenge.infinity.bestTimes.slice(0);
    }
  },
  template:
    `<div class="l-challenge-records-tab c-stats-tab">
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
