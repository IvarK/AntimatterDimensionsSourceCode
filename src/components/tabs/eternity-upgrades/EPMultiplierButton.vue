<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "EPMultiplierButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isDoomed: false,
      isAutobuyerActive: false,
      isAutoUnlocked: false,
      isAffordable: false,
      multiplier: new Decimal(),
      cost: new Decimal()
    };
  },
  computed: {
    upgrade() {
      return EternityUpgrade.epMult;
    },
    autobuyer() {
      return Autobuyer.epMult;
    },
    classObject() {
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--useless-available": this.isDoomed && this.isAffordable,
        "o-eternity-upgrade--useless-unavailable": this.isDoomed && !this.isAffordable,
        "o-eternity-upgrade--available": !this.isDoomed && this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isDoomed && !this.isAffordable,
      };
    }
  },
  watch: {
    isAutobuyerActive(newValue) {
      Autobuyer.epMult.isActive = newValue;
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      const upgrade = this.upgrade;
      this.isAutoUnlocked = this.autobuyer.isUnlocked;
      this.isAutobuyerActive = this.autobuyer.isActive;
      this.multiplier.copyFrom(upgrade.effectValue);
      this.cost.copyFrom(upgrade.cost);
      this.isAffordable = upgrade.isAffordable;
    },
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      @click="upgrade.purchase()"
    >
      <div v-if="isDoomed">
        This multiplier has no effect while in Doomed
      </div>
      <div v-else>
        Multiply Eternity Points from all sources by {{ formatX(5) }}
        <br>
        Currently: {{ formatX(multiplier, 2, 0) }}
      </div>
      <br>
      Cost: {{ quantify("Eternity Point", cost, 2, 0) }}
    </button>
    <PrimaryButton
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      @click="upgrade.buyMax()"
    >
      Max Eternity Point mult
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="isAutoUnlocked"
      v-model="isAutobuyerActive"
      label="Autobuy EP mult"
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
    />
  </div>
</template>

<style scoped>

</style>
