<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import TimeStudyButton from "./TimeStudyButton";

export default {
  name: "TriadTimeStudy",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    HintText,
    TimeStudyButton
  },
  props: {
    setup: {
      type: Object,
      required: true
    }
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
  }
};
</script>

<template>
  <TimeStudyButton
    :setup="setup"
    class="o-time-study--triad"
    :show-st-cost="true"
  >
    <HintText
      type="studies"
      class="l-hint-text--time-study"
    >
      {{ id }} Triad
    </HintText>
    <DescriptionDisplay :config="study.config" />
    <EffectDisplay
      br
      :config="study.config"
    />
  </TimeStudyButton>
</template>

<style scoped>

</style>
