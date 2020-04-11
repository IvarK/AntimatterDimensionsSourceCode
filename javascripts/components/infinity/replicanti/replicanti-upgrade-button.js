"use strict";

Vue.component("replicanti-upgrade-button", {
  props: {
    setup: Object
  },
  data() {
    return {
      description: "",
      canBeBought: false,
      costDescription: "",
      isCapped: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
      isEC8Running: false
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      this.upgrade.isAutobuyerOn = newValue;
    }
  },
  computed: {
    upgrade() {
      return this.setup.upgrade;
    }
  },
  methods: {
    update() {
      const setup = this.setup;
      const upgrade = setup.upgrade;
      this.description = setup.formatDescription(upgrade.value);
      this.canBeBought = upgrade.canBeBought;
      this.isCapped = upgrade.isCapped;
      if (!this.isCapped) {
        this.costDescription = setup.formatCost(upgrade.cost);
      }
      this.isAutoUnlocked = upgrade.isAutobuyerUnlocked;
      this.isAutobuyerOn = upgrade.isAutobuyerOn;
      this.isEC8Running = EternityChallenge(8).isRunning;
    }
  },
  template:
    `<div class="l-spoon-btn-group l-replicanti-upgrade-button">
      <primary-button
        :enabled="canBeBought"
        class="o-primary-btn--replicanti-upgrade"
        @click="upgrade.purchase()"
      >
        <span>{{description}}</span>
        <template v-if="!isCapped">
          <br>
          <span>{{costDescription}}</span>
        </template>
      </primary-button>
      <primary-button-on-off
        v-if="isAutoUnlocked && !isEC8Running"
        v-model="isAutobuyerOn"
        text="Auto:"
        class="l--spoon-btn-group__little-spoon o-primary-btn--replicanti-upgrade-toggle"
      />
    </div>`
});

class ReplicantiUpgradeButtonSetup {
  constructor(upgrade, formatDescription, formatCost) {
    this.upgrade = upgrade;
    this.formatDescription = formatDescription;
    this.formatCost = formatCost;
  }
}
