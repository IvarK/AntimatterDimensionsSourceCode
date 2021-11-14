import "../../common/hint-text.js";
import "./time-study.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

Vue.component("normal-time-study", {
  components: {
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    setup: Object
  },
  data: () => ({
    showCost: true,
    showSTCost: false
  }),
  computed: {
    study() {
      return this.setup.study;
    },
    hintText() {
      const id = this.study.id;
      switch (this.setup.path) {
        case TIME_STUDY_PATH.ANTIMATTER_DIM: return `${id} Antimatter Dims`;
        case TIME_STUDY_PATH.INFINITY_DIM: return `${id} Infinity Dims`;
        case TIME_STUDY_PATH.TIME_DIM: return `${id} Time Dims`;
        case TIME_STUDY_PATH.ACTIVE: return `${id} Active`;
        case TIME_STUDY_PATH.PASSIVE: return `${id} Passive`;
        case TIME_STUDY_PATH.IDLE: return `${id} Idle`;
        case TIME_STUDY_PATH.LIGHT: return `${id} Light`;
        case TIME_STUDY_PATH.DARK: return `${id} Dark`;
      }
      return id;
    }
  },
  methods: {
    update() {
      this.showCost = this.study.id !== 192 || !Enslaved.isRunning;
      // We don't show ST cost if purchased because the first 1-2 of each "set" won't actually cost ST. There's no
      // particularly sensible way to accurately display the actual ST spent other than tracing through buy order
      // of all current studies for every study, and even then it looks odd in practice because then a few studies
      // appear more expensive simply due to buy order.
      this.showSTCost = V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) && !TimeStudy(this.study.id).isBought &&
        TimeStudy(this.study.id).costsST();
    },
  },
  template: `
    <time-study :setup="setup" :showCost="showCost" :showSTCost="showSTCost">
      <hint-text type="studies" class="l-hint-text--time-study">{{ hintText }}</hint-text>
      <DescriptionDisplay :config="study.config"/>
      <EffectDisplay
        br
        :config="study.config"
      />
    </time-study>`
});
