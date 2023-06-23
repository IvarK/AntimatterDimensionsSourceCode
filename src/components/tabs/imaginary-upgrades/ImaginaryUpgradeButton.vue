<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ImaginaryUpgradeButton",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvailableForPurchase: false,
      canBeBought: false,
      isRebuyable: false,
      isBought: false,
      isPossible: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
      etaText: "",
      canBeLocked: false,
      hasRequirementLock: false,
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--useless": this.upgrade.pelleDisabled,
        "c-reality-upgrade-btn--bought": this.isBought && !this.upgrade.pelleDisabled,
        "c-reality-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-reality-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-reality-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    },
    canLock() {
      return this.config.canLock && !(this.isAvailableForPurchase || this.isBought);
    },
    isDoomed: () => Pelle.isDoomed,
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.imaginaryUpgrade(this.upgrade.id).isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      this.isAutoUnlocked = ImaginaryUpgrade(20).canBeApplied;
      this.canBeLocked = upgrade.config.canLock && !this.isAvailableForPurchase;
      this.hasRequirementLock = upgrade.hasPlayerLock;
      if (this.isRebuyable) this.isAutobuyerOn = Autobuyer.imaginaryUpgrade(upgrade.id).isActive;
      this.etaText = this.getETAText();
    },
    getETAText() {
      if (this.canBeBought || !this.isAvailableForPurchase || this.isBought || Pelle.isDoomed) return "";
      const time = MachineHandler.estimateIMTimer(this.upgrade.cost);
      if (isFinite(time)) return TimeSpan.fromSeconds(time).toString();
      return "Never affordable";
    },
    toggleLock(upgrade) {
      if (this.isRebuyable) return;
      upgrade.toggleMechanicLock();
    }
  }
};
</script>

<template>
  <div
    v-tooltip="etaText"
    class="l-spoon-btn-group"
  >
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn"
      @click.shift.exact="toggleLock(upgrade)"
      @click.exact="upgrade.purchase()"
    >
      <HintText
        type="realityUpgrades"
        class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
      >
        {{ config.name }}
      </HintText>
      <span :class="{ 'o-pelle-disabled': upgrade.pelleDisabled }">
        <DescriptionDisplay :config="config" />
        <template v-if="($viewModel.shiftDown === isAvailableForPurchase) && !isRebuyable">
          <br>
          <DescriptionDisplay
            :config="requirementConfig"
            label="Requirement:"
            class="c-reality-upgrade-btn__requirement"
          />
        </template>
        <template v-else>
          <EffectDisplay
            :config="config"
            br
          />
          <CostDisplay
            v-if="!isBought"
            :config="config"
            br
            name="Imaginary Machine"
          />
        </template>
      </span>
    </button>
    <div
      v-if="canBeLocked"
      class="o-requirement-lock"
    >
      <i
        v-if="hasRequirementLock"
        class="fas fa-lock"
      />
      <i
        v-else-if="canLock"
        class="fas fa-lock-open"
      />
    </div>
    <PrimaryToggleButton
      v-if="isRebuyable && isAutoUnlocked"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="l--spoon-btn-group__little-spoon-reality-btn o-primary-btn--reality-upgrade-toggle"
    />
  </div>
</template>

<style scoped>

</style>
