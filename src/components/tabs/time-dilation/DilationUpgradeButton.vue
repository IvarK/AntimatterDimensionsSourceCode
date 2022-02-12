<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "DilationUpgradeButton",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    isRebuyable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isUseless: false,
      isBought: false,
      isCapped: false,
      isAffordable: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
      boughtAmount: 0,
      timeUntilCost: new Decimal(0),
    };
  },
  computed: {
    classObject() {
      return {
        "o-dilation-upgrade": true,
        "o-dilation-upgrade--rebuyable": this.isRebuyable,
        "o-dilation-upgrade--useless-available": this.isUseless && !this.isBought && this.isAffordable,
        "o-dilation-upgrade--useless-bought": this.isUseless && this.isBought,
        "o-dilation-upgrade--available": !this.isUseless && !this.isBought && !this.isCapped && this.isAffordable,
        "o-dilation-upgrade--unavailable": !this.isUseless && !this.isBought && !this.isCapped && !this.isAffordable,
        "o-dilation-upgrade--bought": !this.isUseless && this.isBought,
        "o-dilation-upgrade--capped": this.isCapped,
      };
    },
    timeEstimate() {
      if (this.isAffordable || this.isCapped || this.upgrade.isBought || getDilationGainPerSecond().eq(0)) return null;
      return TimeSpan.fromSeconds(this.timeUntilCost.toNumber()).toTimeEstimate();
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.dilationUpgrade(this.upgrade.id).isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.timeUntilCost = Decimal.sub(upgrade.cost, Currency.dilatedTime.value)
        .div(getDilationGainPerSecond().times(getGameSpeedupForDisplay()));
      if (this.isRebuyable) {
        this.isAffordable = upgrade.isAffordable;
        this.isCapped = upgrade.isCapped;
        const autobuyer = Autobuyer.dilationUpgrade(upgrade.id);
        this.boughtAmount = upgrade.boughtAmount;
        if (!autobuyer) return;
        this.isAutoUnlocked = autobuyer.isUnlocked;
        this.isAutobuyerOn = autobuyer.isActive;
        return;
      }
      this.isBought = upgrade.isBought;
      if (!this.isBought) {
        this.isAffordable = upgrade.isAffordable;
      }
      this.isUseless = (upgrade.id === 7) && Pelle.isDoomed;
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :ach-tooltip="timeEstimate"
      :class="classObject"
      @click="upgrade.purchase()"
    >
      <span v-if="isUseless">
        This upgrade has no effect while in Doomed
      </span>
      <span v-else>
        <DescriptionDisplay
          :config="upgrade.config"
          :length="70"
          name="o-dilation-upgrade__description"
        />
        <EffectDisplay
          br
          :config="upgrade.config"
        />
      </span>
      <CostDisplay
        v-if="!isBought && !isCapped"
        br
        :config="upgrade.config"
        name="Dilated Time"
      />
    </button>
    <PrimaryToggleButton
      v-if="isRebuyable && isAutoUnlocked"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="l--spoon-btn-group__little-spoon o-primary-btn--dilation-upgrade-toggle"
    />
  </div>
</template>

<style scoped>

</style>
