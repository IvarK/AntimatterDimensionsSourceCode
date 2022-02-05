<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "EternityUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBought: false,
      isAffordable: false
    };
  },
  computed: {
    classObject() {
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--bought": this.isBought,
        "o-eternity-upgrade--available": !this.isBought && this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isBought && !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought;
      this.isAffordable = upgrade.isAffordable;
    }
  }
};
</script>

<template>
  <button
    :class="classObject"
    @click="upgrade.purchase()"
  >
    <DescriptionDisplay :config="upgrade.config" />
    <EffectDisplay
      br
      :config="upgrade.config"
    />
    <CostDisplay
      v-if="!isBought"
      br
      :config="upgrade.config"
      name="Eternity Point"
    />
  </button>
</template>

<style scoped>

</style>
