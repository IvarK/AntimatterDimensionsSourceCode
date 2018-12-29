Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
      showRequirement: false,
      requirement: String.empty
    };
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
  created() {
    if (this.id === 1) {
      this.requirement = "Requirement: 5 EC11 and EC12 completions and 13000 total theorems";
    }
    if (this.id === 6) {
      this.requirement = "Requirement: 1e4000 EP";
    }
  },
  methods: {
    update() {
      if (this.id === 1) {
        this.showRequirement = !this.study.isBought && !Perk(13).isBought;
      }
      if (this.id === 6) {
        this.showRequirement = player.realities === 0;
      }
    }
  },
  template:
    `<time-study :setup="setup" :showCost="false" :class="classObject">
      {{study.description}}
      <template v-if="showRequirement">
        <br>
        <span>{{requirement}}</span>
      </template>
      <br>
      Cost: {{cost}} Time Theorems
    </time-study>`
});