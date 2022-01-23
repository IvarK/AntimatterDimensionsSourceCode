import "./time-study.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";

Vue.component("dilation-time-study", {
  components: {
    DescriptionDisplay
  },
  props: {
    setup: Object
  },
  data() {
    return {
      showRequirement: false,
      maxTT: new Decimal(0),
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
    },
    requirement() {
      if (this.id === 1) {
        return `Requirement: ${formatInt(5)} EC11 and EC12 completions
          and ${formatInt(this.maxTT)}/${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)}
          total Time Theorems`;
      }
      if (this.id === 6) {
        const achRows = Perk.firstPerk.isBought ? "" : ` and ${formatInt(13)} rows of Achievements`;
        return `Requirement: ${format("1e4000")} Eternity Points${achRows}`;
      }
      return "";
    }
  },
  methods: {
    update() {
      if (this.id === 1) {
        this.maxTT.copyFrom(Currency.timeTheorems.max);
        this.showRequirement = !this.study.isBought && !Perk.bypassECDilation.isBought;
      }
      if (this.id === 6) {
        this.showRequirement = true;
      }
    }
  },
  template: `
    <time-study :setup="setup">
      <DescriptionDisplay :config="study.config" />
      <template v-if="showRequirement">
        <br>
        <span>{{ requirement }}</span>
      </template>
    </time-study>`
});
