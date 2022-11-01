<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

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
      isBought: false,
      isCapped: false,
      isAffordable: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
      boughtAmount: 0,
      currentDT: new Decimal(0),
      currentDTGain: new Decimal(0),
      timeEstimate: "",
    };
  },
  computed: {
    classObject() {
      if (this.isUseless) {
        return {
          "o-dilation-upgrade": true,
          "o-dilation-upgrade--useless": true,
          "o-pelle-disabled-pointer": true
        };
      }
      return {
        "o-dilation-upgrade": true,
        "o-dilation-upgrade--rebuyable": this.isRebuyable,
        "o-dilation-upgrade--available": !this.isBought && !this.isCapped && this.isAffordable,
        "o-dilation-upgrade--unavailable": !this.isBought && !this.isCapped && !this.isAffordable,
        "o-dilation-upgrade--bought": this.isBought,
        "o-dilation-upgrade--capped": this.isCapped,
      };
    },
    isUseless() {
      return Pelle.isDoomed && this.upgrade.id === 7;
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
      this.currentDT.copyFrom(Currency.dilatedTime.value);
      this.currentDTGain.copyFrom(getDilationGainPerSecond());
      this.timeEstimate = this.isAffordable ||
      this.isCapped ||
      this.upgrade.isBought ? null : getDilationTimeEstimate(this.upgrade.cost);
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
      <span :class="{ 'o-pelle-disabled': isUseless }">
        <DescriptionDisplay
          :config="upgrade.config"
          :length="70"
          name="o-dilation-upgrade__description"
        />
        <EffectDisplay
          :key="boughtAmount"
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
