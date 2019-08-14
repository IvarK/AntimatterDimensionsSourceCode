Vue.component('challenge-records-list', {
  props: {
    name: String,
    start: Number,
    times: Array
  },
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
  },
  template:
    '<div>\
      <br>\
      <div v-for="(time, index) in times" :key="index">\
        <span>{{ name }} {{ start + index }} time record: {{ timeDisplayShort(time) }}</span>\
      </div>\
      <br>\
      <div>Sum of {{ name }} time records: {{ timeDisplayShort(timeSum) }}</div>\
    </div>'
});