Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  computed: {
    study: function() {
      return this.setup.study;
    },
    cost: function() {
      return this.study.id === 1 ? this.study.cost : formatWithCommas(this.study.cost);
    }
  },
  template:
    `<time-study :setup="setup" :showCost="false" class="o-time-study--dilation">
      {{study.description}}
      <br>
      Cost: {{cost}} Time Theorems
    </time-study>`
});