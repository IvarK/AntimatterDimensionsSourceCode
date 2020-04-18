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
      }
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
    }
  },
  methods: {
    update() {
      const id = this.id;
      this.hasRequirement = !Perk.studyECRequirement.isBought && player.etercreq !== id;
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
  template:
    `<time-study :setup="setup">
      Eternity Challenge {{id}}
      <template v-if="hasRequirement">
        <br>
        Requirement:
        <span v-if="id === 12">Use only the Time Dimension path</span>
        <span v-else-if="id === 11">Use only the Normal Dimension path</span>
        <span v-else>
          {{formatValue(requirement.current)}}/{{formatValue(requirement.total)}}
          {{config.requirement.resource}}
        </span>
      </template>
    </time-study>`
});
