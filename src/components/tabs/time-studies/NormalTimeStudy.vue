<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import TimeStudyButton from "./TimeStudyButton";

export default {
  name: "NormalTimeStudy",
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
  data: () => ({
    isUseless: false,
    showCost: true,
    showSTCost: false
  }),
  computed: {
    study() {
      return this.setup.study;
    },
    doomedDescription() {
      return this.study.id === 33
        ? "This Time Study became useless due to a Pelle upgrade"
        : "This Time Study has no effect while in Doomed";
    },
    hintText() {
      const id = this.study.id;
      if (!this.setup.path) return id;
      const pathEntry = NormalTimeStudies.pathList.find(p => p.path === this.setup.path);
      return `${id} ${pathEntry.name}`;
    }
  },
  methods: {
    update() {
      this.isUseless = Pelle.uselessTimeStudies.includes(this.study.id) && Pelle.isDoomed;
      this.showCost = this.study.id !== 192 || !Enslaved.isRunning;
      // We don't show ST cost if purchased because the first 1-2 of each "set" won't actually cost ST. There's no
      // particularly sensible way to accurately display the actual ST spent other than tracing through buy order
      // of all current studies for every study, and even then it looks odd in practice because then a few studies
      // appear more expensive simply due to buy order.
      this.showSTCost = V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) && !TimeStudy(this.study.id).isBought &&
        TimeStudy(this.study.id).costsST() && !Pelle.isDoomed;
    },
  }
};
</script>

<template>
  <TimeStudyButton
    :setup="setup"
    :show-cost="showCost"
    :show-st-cost="showSTCost"
  >
    <HintText
      type="studies"
      class="l-hint-text--time-study"
    >
      {{ hintText }}
    </HintText>
    <span v-if="isUseless">
      {{ doomedDescription }}
    </span>
    <span v-else>
      <DescriptionDisplay
        :config="study.config"
      />
      <EffectDisplay
        br
        :config="study.config"
      />
    </span>
  </TimeStudyButton>
</template>

<style scoped>

</style>
