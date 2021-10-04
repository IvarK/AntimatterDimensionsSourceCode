"use strict";

Vue.component("challenge-records-list", {
  props: {
    name: String,
    start: Number,
    times: Array
  },
  data() {
    return {
      completedAllChallenges: false,
    };
  },
  computed: {
    timeSum() {
      return this.times.reduce((acc, prev) => acc + prev);
    }
  },
  methods: {
    update() {
      this.completedAllChallenges = this.timeSum < Number.MAX_VALUE;
    },
    timeDisplayShort(time) {
      return timeDisplayShort(time);
    },
    completionString(time) {
      return time < Number.MAX_VALUE
        ? `record time: ${timeDisplayShort(time)}`
        : "has not yet been completed";
    }
  },
  template: `
    <div>
      <br>
      <div v-for="(time, index) in times" :key="index">
        <span>{{ name }} {{ start + index }} {{ completionString(time) }}</span>
      </div>
      <br>
      <div v-if="completedAllChallenges">
        Sum of {{ name }} record times: {{ timeDisplayShort(timeSum) }}
      </div>
      <div v-else>
        You have not completed all {{ name }}s yet.
      </div>
    </div>`
});
