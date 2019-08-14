"use strict";

Vue.component("challenge-records-list", {
  props: {
    name: String,
    start: Number,
    times: Array
  },
  computed: {
    timeSum() {
      return this.times.reduce((acc, prev) => acc + prev);
    }
  },
  methods: {
    timeDisplayShort(time) {
      return timeDisplayShort(time);
    }
  },
  template:
    `<div>
      <br>
      <div v-for="(time, index) in times" :key="index">
        <span>{{ name }} {{ start + index }} time record: {{ timeDisplayShort(time) }}</span>
      </div>
      <br>
      <div>Sum of {{ name }} time records: {{ timeDisplayShort(timeSum) }}</div>
    </div>`
});