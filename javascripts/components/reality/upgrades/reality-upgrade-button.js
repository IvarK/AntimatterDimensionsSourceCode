Vue.component("reality-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isRequirementMet: false,
      canBeBought: false,
      isBought: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-reality-upgrade--bought": this.isBought,
        "c-reality-upgrade--unavailable": !this.isBought && !this.canBeBought,
        "c-reality-upgrade--requirement-not-met": !this.isRequirementMet,
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isRequirementMet = upgrade.isRequirementMet;
      this.canBeBought = upgrade.canBeBought;
      this.isBought = upgrade.isBought;
    }
  },
  template: `
    <button
      :class="classObject"
      class="l-reality-upgrade c-reality-upgrade"
      @click="upgrade.purchase()"
    >
      <description-display :config="config"/>
      <b v-if="!isRequirementMet">Requires: {{config.requirement}}</b>
      <template v-else>
        <effect-display :config="config" />
        <cost-display
          v-if="!isBought"
          :config="config"
          singular="RM"
          plural="RM"
        />
      </template>
    </button>
  `
});