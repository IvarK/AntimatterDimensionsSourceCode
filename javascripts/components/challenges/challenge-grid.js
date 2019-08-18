"use strict";

Vue.component("challenge-grid", {
  props: {
    count: Number,
    isChallengeVisible: Function
  },
  data() {
    return {
      boxVisibility: [],
      showAllChallenges: false
    };
  },
  created() {
    this.boxVisibility = Array.from({ length: this.count + 1 }, () => false);
    this.update();
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      const boxVisibility = this.boxVisibility;
      const isChallengeVisible = this.isChallengeVisible;
      for (let challenge = 1; challenge < boxVisibility.length; challenge++) {
        Vue.set(boxVisibility, challenge, isChallengeVisible === undefined || isChallengeVisible(challenge));
      }
    },
    boxClassObject(id) {
      return {
        "l-challenge-grid__cell": true,
        "l-challenge-grid__cell--hidden": !this.showAllChallenges && !this.boxVisibility[id]
      };
    }
  },
  template:
    `<div class="l-challenge-grid">
      <div v-for="id in count" :key="id" :class="boxClassObject(id)">
        <slot :challengeId="id" />
      </div>
    </div>`
});
