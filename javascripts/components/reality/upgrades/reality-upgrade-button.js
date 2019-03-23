Vue.component("reality-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isUnlocked: false,
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
        "c-reality-upgrade--unavailable": !this.isBought && !this.canBeBought && this.isUnlocked,
        "c-reality-upgrade--locked": !this.isUnlocked,
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isUnlocked = upgrade.isUnlocked;
      this.canBeBought = upgrade.canBeBought;
      this.isBought = upgrade.isBought;
    }
  },
  template: `
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn"
      @click="upgrade.purchase()"
    >
      <hint-text class="l-hint-text--reality-upgrade">RUPG {{config.id}}</hint-text>
      <description-display :config="config"/>
      <b v-if="!isUnlocked">Requires: {{config.requirement}}</b>
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