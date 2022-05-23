<script>
import InfinityUpgradeButton from "@/components/InfinityUpgradeButton";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "IpMultiplierButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
    InfinityUpgradeButton
  },
  data() {
    return {
      isAutobuyerActive: false,
      isAutoUnlocked: false,
      isCapped: false
    };
  },
  computed: {
    upgrade() {
      return InfinityUpgrade.ipMult;
    }
  },
  watch: {
    isAutobuyerActive(newValue) {
      Autobuyer.ipMult.isActive = newValue;
    }
  },
  methods: {
    update() {
      this.isAutoUnlocked = Autobuyer.ipMult.isUnlocked;
      this.isAutobuyerActive = Autobuyer.ipMult.isActive;
      this.isCapped = this.upgrade.isCapped;
    },
    buyMaxIPMult() {
      InfinityUpgrade.ipMult.buyMax();
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <InfinityUpgradeButton
      :upgrade="upgrade"
      class="o-infinity-upgrade-btn--multiplier"
    >
      <template v-if="isCapped">
        <br>
        <span>(Capped at {{ quantify("Infinity Point", upgrade.config.costCap) }})</span>
      </template>
    </InfinityUpgradeButton>
    <PrimaryButton
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      @click="buyMaxIPMult()"
    >
      Max Infinity Point mult
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="isAutoUnlocked"
      v-model="isAutobuyerActive"
      label="Autobuy IP mult"
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
    />
  </div>
</template>

<style scoped>

</style>
