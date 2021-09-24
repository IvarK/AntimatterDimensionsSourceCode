"use strict";

Vue.component("dilation-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
      showRequirement: false,
      currentTT: new Decimal(0),
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
  methods: {
    update() {
      if (this.id === 1) {
        this.currentTT.copyFrom(Currency.timeTheorems.max);
        this.requirement = `Requirement: ${formatInt(5)} EC11 and EC12 completions
          and ${formatInt(this.currentTT)}/${formatInt(13000)} total Time Theorems`;
        this.showRequirement = !this.study.isBought && !Perk.bypassECDilation.isBought;
      }
      if (this.id === 6) {
        if (Perk.firstPerk.isBought) {
          this.requirement = `Requirement: ${format("1e4000")} Eternity Points`;
        } else {
          this.requirement = `Requirement: ${format("1e4000")} Eternity Points and 
            ${formatInt(13)} rows of Achievements`;
        }
        this.showRequirement = true;
      }
    }
  },
  template: `
    <time-study :setup="setup">
      <description-display :config="study.config" />
      <template v-if="showRequirement">
        <br>
        <span>{{ requirement }}</span>
      </template>
    </time-study>`
});
