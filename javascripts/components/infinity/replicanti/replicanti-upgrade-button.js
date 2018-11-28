Vue.component("replicanti-upgrade-button", {
  props: {
    setup: Object
  },
  data: function() {
    return {
      description: String.empty,
      isAvailable: false,
      costDescription: String.empty,
      isCapped: false,
      isAutoUnlocked: false,
      auto: player.replicanti.auto,
      isEC8Running: false
    };
  },
  computed: {
    upgrade: function() {
      return this.setup.upgrade;
    }
  },
  methods: {
    update() {
      const setup = this.setup;
      const upgrade = setup.upgrade;
      this.description = setup.formatDescription(upgrade.current);
      this.isAvailable = ReplicantiUpgrade.isAvailable(upgrade);
      this.isCapped = upgrade.isCapped;
      if (!this.isCapped) {
        this.costDescription = setup.formatCost(upgrade.cost);
      }
      this.isAutoUnlocked = upgrade.isAutobuyerUnlocked;
      this.auto = player.replicanti.auto;
      this.isEC8Running = EternityChallenge(8).isRunning;
    },
    purchase() {
      ReplicantiUpgrade.purchase(this.upgrade);
    }
  },
  template:
    `<div class="l-spoon-btn-group">
      <primary-button
        :enabled="isAvailable"
        class="o-primary-btn--replicanti-upgrade"
        @click="purchase"
      >
        <span>{{description}}</span>
        <template v-if="!isCapped">
          <br>
          <span>{{costDescription}}</span>
        </template>
      </primary-button>
      <primary-button-on-off
        v-if="isAutoUnlocked && !isEC8Running"
        v-model="auto[setup.index]"
        text="Auto:"
        class="l--spoon-btn-group__little-spoon o-primary-btn--replicanti-upgrade-toggle"
      />
    </div>`
});

class ReplicantiUpgradeButtonSetup {
  constructor(index, upgrade, formatDescription, formatCost) {
    this.index = index;
    this.upgrade = upgrade;
    this.formatDescription = formatDescription;
    this.formatCost = formatCost;
  }
}