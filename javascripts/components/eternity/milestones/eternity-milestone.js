"use strict";

Vue.component("eternity-milestone", {
  props: {
    getMilestone: Function
  },
  data() {
    return {
      isReached: false
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    eternities() {
      return this.config.eternities;
    },
    reward() {
      return this.config.reward;
    },
    rewardClassObject() {
      return {
        "o-eternity-milestone__reward": true,
        "o-eternity-milestone__reward--locked": !this.isReached,
        "o-eternity-milestone__reward--reached": this.isReached,
        "o-eternity-milestone__reward--small-font": this.reward.length > 80
      };
    }
  },
  methods: {
    update() {
      this.isReached = this.milestone.isReached;
    }
  },
  template:
    `<div class="l-eternity-milestone">
      <span class="o-eternity-milestone__goal">
        {{eternities}} {{"Eternity" | pluralize(eternities, "Eternities")}}:
      </span>
      <button :class="rewardClassObject">{{reward}}</button>
    </div>`
});