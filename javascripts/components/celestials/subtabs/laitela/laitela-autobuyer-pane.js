import PrimaryToggleButton from "@/components/PrimaryToggleButton";

Vue.component("laitela-autobuyer-settings", {
  components: {
    PrimaryToggleButton
  },
  data() {
    return {
      hasDimension: false,
      hasAscension: false,
      hasSingularity: false,
      hasAnnihilated: false,
      dimension: false,
      ascension: false,
      singularity: false,
      annihilation: false,
    };
  },
  watch: {
    dimension(newValue) {
      player.celestials.laitela.automation.dimensions = newValue;
    },
    ascension(newValue) {
      player.celestials.laitela.automation.ascension = newValue;
    },
    singularity(newValue) {
      player.celestials.laitela.automation.singularity = newValue;
    },
    annihilation(newValue) {
      player.celestials.laitela.automation.annihilation = newValue;
    },
  },
  methods: {
    update() {
      this.hasDimension = SingularityMilestone.darkDimensionAutobuyers.isUnlocked;
      this.hasAscension = SingularityMilestone.darkDimensionAutobuyers.isUnlocked;
      this.hasSingularity = SingularityMilestone.autoCondense.isUnlocked;
      this.hasAnnihilated = Laitela.darkMatterMult > 1;
      const auto = player.celestials.laitela.automation;
      this.dimension = auto.dimensions;
      this.ascension = auto.ascension;
      this.singularity = auto.singularity;
      this.annihilation = auto.annihilation;
    },
  },
  template: `
    <div class="c-laitela-singularity-container">
      <PrimaryToggleButton
        v-if="hasDimension"
        v-model="dimension"
        class="c-laitela-automation-toggle"
        label="Auto-buy DM Dimensions:"
      />
      <PrimaryToggleButton
        v-if="hasAscension"
        v-model="ascension"
        class="c-laitela-automation-toggle"
        label="Auto-Ascend:"
      />
      <PrimaryToggleButton
        v-if="hasSingularity"
        v-model="singularity"
        class="c-laitela-automation-toggle"
        label="Auto-Singularity:"
      />
      <PrimaryToggleButton
        v-if="hasAnnihilated"
        v-model="annihilation"
        class="c-laitela-automation-toggle"
        label="Auto-Annihilation:"
      />
    </div>`
});
