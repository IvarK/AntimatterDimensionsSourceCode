<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "AutobuyerToggles",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
  },
  data() {
    return {
      isDoomed: false,
      autobuyersOn: false,
      showContinuum: false,
      disableContinuum: false,
      allAutobuyersDisabled: false,
      antimatterAutobuyersBuyMax: false,
    };
  },
  watch: {
    autobuyersOn(newValue) {
      player.auto.autobuyersOn = newValue;
    },
    disableContinuum(newValue) {
      if (ImaginaryUpgrade(21).isLockingMechanics && !newValue) {
        ImaginaryUpgrade(21).tryShowWarningModal();
        return;
      }
      Laitela.setContinuum(!newValue);
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.autobuyersOn = player.auto.autobuyersOn;
      this.showContinuum = Laitela.isUnlocked;
      this.disableContinuum = player.auto.disableContinuum;
      this.allAutobuyersDisabled = Autobuyers.unlocked.every((autobuyer) => !autobuyer.isActive);
      this.antimatterAutobuyersBuyMax = Autobuyer.antimatterDimension.zeroIndexed.every(
        (autobuyer) => autobuyer.mode === AUTOBUYER_MODE.BUY_10
      );
    },
    toggleAllAutobuyers() {
      for (const autobuyer of Autobuyers.unlocked) {
        autobuyer.isActive = this.allAutobuyersDisabled;
      }
    },
    toggleAntimatterSingles() {
      for (const autobuyer of Autobuyer.antimatterDimension.zeroIndexed) {
        autobuyer.mode = this.antimatterAutobuyersBuyMax ? AUTOBUYER_MODE.BUY_SINGLE : AUTOBUYER_MODE.BUY_10;
      }
    },
  },
};
</script>

<template>
  <div class="c-subtab-option-container">
    <PrimaryToggleButton
      v-model="autobuyersOn"
      on="Pause autobuyers"
      off="Resume autobuyers"
      class="o-primary-btn--subtab-option"
    />
    <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="toggleAllAutobuyers()"
    >
      {{ allAutobuyersDisabled ? "Enable" : "Disable" }} all autobuyers
    </PrimaryButton>
    <PrimaryButton class="o-primary-btn--subtab-option" @click="toggleAntimatterSingles()">
      Set AD autobuyers to buy {{ antimatterAutobuyersBuyMax ? "singles" : "max" }}
    </PrimaryButton>
    <span v-if="isDoomed">
      <PrimaryButton
        v-if="showContinuum"
        class="o-primary-btn--subtab-option"
      >
        Continuum is disabled
      </PrimaryButton>
    </span>
    <span v-else>
      <PrimaryToggleButton
        v-if="showContinuum"
        v-model="disableContinuum"
        on="Enable Continuum"
        off="Disable Continuum"
        class="o-primary-btn--subtab-option"
      />
    </span>
  </div>
</template>

<style scoped>

</style>
