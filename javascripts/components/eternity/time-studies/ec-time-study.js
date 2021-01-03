"use strict";

Vue.component("ec-time-study", {
  props: {
    setup: Object
  },
  data() {
    return {
      hasRequirement: false,
      requirement: {
        current: new Decimal(0),
        total: new Decimal(0)
      },
      completions: 0,
      showTotalCompletions: false,
      isRunning: false,
      isUnlocked: false,
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
    },
    config() {
      return this.study.config;
    },
    hasNumberRequirement() {
      return typeof this.study.requirementCurrent === "number";
    },
    formatValue() {
      return this.config.requirement.formatValue;
    },
    // Linebreaks added to avoid twitching in scientific notation
    needsFirstLinebreak() {
      return this.study.id === 7;
    },
    needsSecondLinebreak() {
      return [3, 4, 7].includes(this.study.id);
    }
  },
  methods: {
    update() {
      const id = this.id;
      this.hasRequirement = !Perk.studyECRequirement.isBought && player.etercreq !== id;
      this.completions = EternityChallenge(id).completions;
      this.showTotalCompletions = !Enslaved.isRunning || this.id !== 1;
      this.isRunning = EternityChallenge.current?.id === this.study.id;
      this.isUnlocked = EternityChallenge(this.study.id).isUnlocked;
      if (!this.hasRequirement || id > 10) return;
      const requirement = this.requirement;
      const study = this.study;
      if (this.hasNumberRequirement) {
        requirement.total = study.requirementTotal;
        requirement.current = Math.min(study.requirementCurrent, requirement.total);
      } else {
        requirement.total.copyFrom(study.requirementTotal);
        requirement.current.copyFrom(study.requirementCurrent.min(requirement.total));
      }
    }
  },
  template: `
    <time-study :setup="setup">
      Eternity Challenge {{id}}
      ({{formatInt(completions)}}<span v-if="showTotalCompletions">/{{formatInt(5)}}</span>)
      <template v-if="hasRequirement">
        <br>
        Requirement:
        <br v-if="needsFirstLinebreak">
        <span v-if="id === 12">Use only the Time Dimension path</span>
        <span v-else-if="id === 11">Use only the Antimatter Dimension path</span>
        <span v-else>
          {{formatValue(requirement.current)}}/{{formatValue(requirement.total)}}
          <br v-if="needsSecondLinebreak">
          {{config.requirement.resource}}
        </span>
      </template>
      <span v-if="isUnlocked && !isRunning"><br>Double click to start</span>
    </time-study>`
});
