Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
    },
    cost() {
      return this.id === 1 ? this.study.cost : formatWithCommas(this.study.cost);
    },
    classObject() {
      return {
        "o-time-study--dilation": this.id !== 6,
        "o-time-study--reality": this.id === 6
      };
    }
  },
  template:
    `<time-study :setup="setup" :showCost="false" :class="classObject">
      {{study.description}}
      <br>
      Cost: {{cost}} Time Theorems
    </time-study>`
});