import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

Vue.component("replicanti-upgrade-button", {
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
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
      Autobuyer.replicantiUpgrade(this.upgrade.id).isActive = newValue;
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
      const autobuyer = Autobuyer.replicantiUpgrade(upgrade.id);
      this.isAutoUnlocked = autobuyer.isUnlocked;
      this.isAutobuyerOn = autobuyer.isActive;
      this.isEC8Running = EternityChallenge(8).isRunning;
    }
  },
  template: `
    <div class="l-spoon-btn-group l-replicanti-upgrade-button">
      <PrimaryButton
        :enabled="canBeBought"
        class="o-primary-btn--replicanti-upgrade"
        @click="upgrade.purchase()"
      >
        <span>{{ description }}</span>
        <template v-if="!isCapped">
          <br>
          <span>{{ costDescription }}</span>
        </template>
      </PrimaryButton>
      <PrimaryToggleButton
        v-if="isAutoUnlocked && !isEC8Running"
        v-model="isAutobuyerOn"
        label="Auto:"
        class="l--spoon-btn-group__little-spoon o-primary-btn--replicanti-upgrade-toggle"
      />
    </div>`
});

export class ReplicantiUpgradeButtonSetup {
  constructor(upgrade, formatDescription, formatCost) {
    this.upgrade = upgrade;
    this.formatDescription = formatDescription;
    this.formatCost = formatCost;
  }
}
