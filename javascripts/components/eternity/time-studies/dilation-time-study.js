Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  computed: {
    study: function() {
      return this.setup.study;
    },
    id: function() {
      return this.study.id;
    },
    description: function() {
      switch (this.id) {
        case 1: return "Unlock time dilation";
        case 2:
        case 3:
        case 4:
        case 5: return `Unlock the ${this.id + 3}th Time Dimension`;
        case 6: return "Unlock reality";
      }
    },
    cost: function() {
      return this.id === 1 ? this.study.cost : formatWithCommas(this.study.cost);
    }
  },
  template:
    `<time-study :setup="setup" :showCost="false" class="o-time-study--dilation">
      {{description}}
      <br>
      Cost: {{cost}} Time Theorems
    </time-study>`
});