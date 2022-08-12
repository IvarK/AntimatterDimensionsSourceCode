<script>
import HintText from "@/components/HintText";
import TimeStudyButton from "./TimeStudyButton";

export default {
  name: "ECTimeStudy",
  components: {
    TimeStudyButton,
    HintText
  },
  props: {
    setup: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hasRequirement: false,
      requirement: {
        current: new Decimal(),
        total: new Decimal()
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
      return this.config.secondary.formatValue;
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
      const study = this.study;
      const ec = EternityChallenge(id);
      this.hasRequirement = !Perk.studyECRequirement.isBought && !study.wasRequirementPreviouslyMet;
      this.completions = ec.completions;
      this.showTotalCompletions = !Enslaved.isRunning || id !== 1;
      this.isRunning = EternityChallenge.current?.id === id;
      this.isUnlocked = ec.isUnlocked;
      if (!this.hasRequirement || id > 10) return;
      const requirement = this.requirement;
      if (this.hasNumberRequirement) {
        requirement.total = study.requirementTotal;
        requirement.current = Math.min(study.requirementCurrent, requirement.total);
      } else {
        requirement.total.copyFrom(study.requirementTotal);
        requirement.current.copyFrom(study.requirementCurrent.min(requirement.total));
      }
    }
  }
};
</script>

<template>
  <TimeStudyButton :setup="setup">
    <HintText
      type="studies"
      class="l-hint-text--time-study"
    >
      EC{{ id }}
    </HintText>
    Eternity Challenge {{ id }}
    ({{ formatInt(completions) }}<span v-if="showTotalCompletions">/{{ formatInt(5) }}</span>)
    <template v-if="hasRequirement">
      <br>
      Requirement:
      <br v-if="needsFirstLinebreak">
      <span v-if="config.secondary.path">Use only the {{ config.secondary.path }} path</span>
      <span v-else>
        {{ formatValue(requirement.current) }}/{{ formatValue(requirement.total) }}
        <br v-if="needsSecondLinebreak">
        {{ config.secondary.resource }}
      </span>
    </template>
    <span v-if="isUnlocked && !isRunning"><br>Double click to start</span>
    <span v-else-if="isRunning"><br>Currently Running</span>
  </TimeStudyButton>
</template>

<style scoped>

</style>
