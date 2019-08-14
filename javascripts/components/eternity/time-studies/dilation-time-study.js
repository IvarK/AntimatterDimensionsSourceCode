"use strict";

Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
      showCost: true,
      showRequirement: false,
      requirement: ""
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
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
      this.requirement = "Requirement: 5 EC11 and EC12 completions and 13,000 total theorems";
    }
    if (this.id === 6) {
      this.requirement = "Requirement: 1e4000 EP";
      this.showRequirement = true;
    }
  },
  methods: {
    update() {
      const id = this.id;
      this.showCost = id !== 6 || player.realities === 0;
      if (id === 1) {
        this.showRequirement = !this.study.isBought && !Perk.bypassECDilation.isBought;
      }
    }
  },
  template:
    `<time-study :setup="setup" :showCost="showCost" :class="classObject">
      <description-display :config="study.config" />
      <template v-if="showRequirement">
        <br>
        <span>{{requirement}}</span>
      </template>
    </time-study>`
});