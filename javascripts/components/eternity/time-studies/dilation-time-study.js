"use strict";

Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
      showRequirement: false,
      currentTT: new Decimal(0),
      requirementTemplate: "",
      requirement: ""
    };
  },
  created() {
    if (this.id === 1) {
      this.requirementTemplate = `Requirement: ${formatInt(5)} EC11 and EC12 completions
        and [currentTT]/${formatInt(13000)} total Time Theorems`;
    }
    if (this.id === 6) {
      if (Perk.firstPerk.isBought) {
        this.requirementTemplate = `Requirement: ${format("1e4000")} Eternity Points`;
      } else {
        this.requirementTemplate = `Requirement: ${format("1e4000")} Eternity Points and 
          ${formatInt(13)} rows of Achievements`;
      }
      this.showRequirement = true;
    }
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
    }
  },
  methods: {
    update() {
      const id = this.id;
      if (id === 1) {
        this.showRequirement = !this.study.isBought && !Perk.bypassECDilation.isBought;
      }
      this.currentTT.copyFrom(Currency.timeTheorems.max);
      this.requirement = this.requirementTemplate.replace("[currentTT]", formatInt(this.currentTT));
    }
  },
  template: `
    <time-study :setup="setup">
      <description-display :config="study.config" />
      <template v-if="showRequirement" :key="currentTT">
        <br>
        <span>{{ requirement }}</span>
      </template>
    </time-study>`
});
