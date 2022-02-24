import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

Vue.component("reality-upgrade-button", {
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: Object
  },
  data() {
    return {
      isUseless: false,
      isAvailableForPurchase: false,
      automatorPoints: false,
      canBeBought: false,
      isRebuyable: false,
      isBought: false,
      isPossible: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.realityUpgrade(this.upgrade.id).isActive = newValue;
    }
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--useless": this.isUseless,
        "c-reality-upgrade-btn--bought": this.isBought && !this.isUseless,
        "c-reality-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-reality-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-reality-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.automatorPoints = this.config.automatorPoints;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      this.isAutoUnlocked = Ra.has(RA_UNLOCKS.AUTO_RU_AND_INSTANT_EC);
      if (this.isRebuyable) this.isAutobuyerOn = Autobuyer.realityUpgrade(upgrade.id).isActive;
      this.isUseless = Pelle.disabledRUPGs.includes(upgrade.id) && Pelle.isDoomed;
    }
  },
  template: `
    <div class="l-spoon-btn-group">
      <button
        :class="classObject"
        class="l-reality-upgrade-btn c-reality-upgrade-btn"
        @click="upgrade.purchase()"
      >
        <HintText
          type="realityUpgrades"
          class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
        >
          {{ config.name }}
        </HintText>
        <span v-if="isUseless">
          This upgrade has no effect while in Doomed  
        </span>
        <span v-else>
          <DescriptionDisplay :config="config" />
          <DescriptionDisplay
            v-if="($viewModel.shiftDown === isAvailableForPurchase) && !isRebuyable"
            :config="requirementConfig"
            label="Requirement:"
            class="c-reality-upgrade-btn__requirement"
          />
          <template v-else>
            <EffectDisplay
              :config="config"
              br
            />
            <CostDisplay
              v-if="!isBought"
              :config="config"
              br
              name="Reality Machine"
            />
          </template>
          <b v-if="automatorPoints && !isBought">
            (+{{ formatInt(automatorPoints) }} AP)
          </b>
        </span>
      </button>
      <PrimaryToggleButton
        v-if="isRebuyable && isAutoUnlocked"
        v-model="isAutobuyerOn"
        label="Auto:"
        class="l--spoon-btn-group__little-spoon-reality-btn o-primary-btn--reality-upgrade-toggle"
      />
    </div>`
});
