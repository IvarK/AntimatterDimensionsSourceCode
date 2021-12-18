import "./time-study.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";

Vue.component("normal-time-study", {
  components: {
    DescriptionDisplay,
    EffectDisplay,
    HintText
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
      if (!this.setup.path) return id;
      const pathEntry = NormalTimeStudies.pathList.find(p => p.path === this.setup.path);
      return `${id} ${pathEntry.name}`;
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
      <HintText type="studies" class="l-hint-text--time-study">{{ hintText }}</HintText>
      <DescriptionDisplay :config="study.config" />
      <EffectDisplay
        br
        :config="study.config"
      />
    </time-study>`
});
