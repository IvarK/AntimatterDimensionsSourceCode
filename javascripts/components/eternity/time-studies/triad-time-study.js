import "./time-study.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";

Vue.component("triad-time-study", {
  components: {
    DescriptionDisplay,
    EffectDisplay,
    HintText
  },
  props: {
    setup: Object
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
  },
  methods: {
  },
  template: `
    <time-study :setup="setup" class="o-time-study--triad" :showSTCost="true">
      <HintText type="studies" class="l-hint-text--time-study">T{{ id }}</HintText>
      <DescriptionDisplay :config="study.config" />
      <EffectDisplay
        br
        :config="study.config"
      />
    </time-study>`
});
