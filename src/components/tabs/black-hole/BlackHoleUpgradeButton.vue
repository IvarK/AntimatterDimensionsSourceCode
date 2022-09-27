<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "BlackHoleUpgradeButton",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAffordable: false,
      isCapped: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false
    };
  },
  computed: {
    effectConfig() {
      const { config } = this;
      return {
        effect: () => config.upgrade.value,
        formatEffect: value => config.formatEffect(value)
      };
    },
    costConfig() {
      const { config } = this;
      return {
        cost: () => config.upgrade.cost,
        formatCost: value => format(value, 2, 0)
      };
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--unavailable": !this.isAffordable
      };
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.blackHolePower(this.config.upgrade.id).isActive = newValue;
    }
  },
  methods: {
    update() {
      this.isCapped = this.config.upgrade.value === 0;
      this.isAffordable = this.config.upgrade.isAffordable && !this.isCapped;
      const hasAutobuyer = this.config.upgrade.hasAutobuyer;
      const autobuyer = Autobuyer.blackHolePower(this.config.upgrade.id);
      this.isAutoUnlocked = hasAutobuyer && autobuyer.isUnlocked;
      this.isAutobuyerOn = hasAutobuyer && autobuyer.isActive;
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn"
      @click="config.upgrade.purchase()"
    >
      <DescriptionDisplay :config="config" />
      <EffectDisplay
        :config="effectConfig"
        :label="config.effectTitle"
      />
      <CostDisplay
        v-if="!isCapped"
        :config="costConfig"
        name="Reality Machine"
      />
    </button>
    <PrimaryToggleButton
      v-if="isAutoUnlocked"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="l--spoon-btn-group__little-spoon-reality-btn o-primary-btn--reality-upgrade-toggle"
    />
  </div>
</template>

<style scoped>

</style>
