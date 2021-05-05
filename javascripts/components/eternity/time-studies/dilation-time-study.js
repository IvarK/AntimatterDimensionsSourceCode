"use strict";

Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
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
    }
  },
  created() {
    if (this.id === 1) {
      this.requirement = `Requirement: ${formatInt(5)} EC11 and EC12 completions
        and ${formatInt(13000)} total Time Theorems`;
    }
    if (this.id === 6) {
      if (PlayerProgress.realityUnlocked()) {
        this.requirement = `Requirement: ${format("1e4000")} Eternity Points`;
      } else {
        this.requirement = `Requirement: ${format("1e4000")} Eternity Points and ${formatInt(13)} rows of Achievements`;
      }
      this.showRequirement = true;
    }
  },
  methods: {
    update() {
      const id = this.id;
      if (id === 1) {
        this.showRequirement = !this.study.isBought && !Perk.bypassECDilation.isBought;
      }
    }
  },
  template:
    `<time-study :setup="setup">
      <description-display :config="study.config" />
      <template v-if="showRequirement">
        <br>
        <span>{{requirement}}</span>
      </template>
    </time-study>`
});
