import "../../common/hint-text.js";
import "./time-study.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

Vue.component("triad-time-study", {
  components: {
    DescriptionDisplay,
    EffectDisplay
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
      <hint-text type="studies" class="l-hint-text--time-study">T{{ id }}</hint-text>
      <DescriptionDisplay :config="study.config" />
      <EffectDisplay
        br
        :config="study.config"
      />
    </time-study>`
});
