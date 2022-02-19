<script>
import AutobuyerToggles from "./AutobuyerToggles";
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";
import RealityAutobuyerBox from "./RealityAutobuyerBox";
import EternityAutobuyerBox from "./EternityAutobuyerBox";
import BigCrunchAutobuyerBox from "./BigCrunchAutobuyerBox";
import GalaxyAutobuyerBox from "./GalaxyAutobuyerBox";
import DimensionBoostAutobuyerBox from "./DimensionBoostAutobuyerBox";
import SacrificeAutobuyerBox from "./SacrificeAutobuyerBox";
import TickspeedAutobuyerBox from "./TickspeedAutobuyerBox";
import DimensionAutobuyerBox from "./DimensionAutobuyerBox";
import SimpleAutobuyersMultiBox from "./SimpleAutobuyersMultiBox";

export default {
  name: "AutobuyersTab",
  components: {
    AutobuyerToggles,
    OpenModalHotkeysButton,
    RealityAutobuyerBox,
    EternityAutobuyerBox,
    BigCrunchAutobuyerBox,
    GalaxyAutobuyerBox,
    DimensionBoostAutobuyerBox,
    SacrificeAutobuyerBox,
    TickspeedAutobuyerBox,
    DimensionAutobuyerBox,
    SimpleAutobuyersMultiBox
  },
  data() {
    return {
      hasContinuum: false,
      displayADAutobuyersIndividually: false,
    };
  },
  methods: {
    update() {
      this.hasContinuum = Laitela.continuumActive;
      this.checkADAutoStatus();
    },
    checkADAutoStatus() {
      const ad = Autobuyer.antimatterDimension;
      const allMaxedInterval = ad.allMaxedInterval();
      const allUnlocked = ad.allUnlocked();
      const allUnlimitedBulk = ad.allUnlimitedBulk();
      this.displayADAutobuyersIndividually = !(allMaxedInterval && allUnlocked && allUnlimitedBulk);
    },
  }
};
</script>

<template>
  <div class="l-autobuyers-tab">
    <AutobuyerToggles />
    <OpenModalHotkeysButton />
    <RealityAutobuyerBox />
    <EternityAutobuyerBox />
    <BigCrunchAutobuyerBox />
    <GalaxyAutobuyerBox />
    <DimensionBoostAutobuyerBox />
    <SacrificeAutobuyerBox />
    <TickspeedAutobuyerBox v-if="!hasContinuum" />
    <DimensionAutobuyerBox
      v-for="tier in 8"
      v-if="displayADAutobuyersIndividually"
      :key="tier"
      :tier="tier"
    />
    <SimpleAutobuyersMultiBox />
  </div>
</template>

<style scoped>

</style>
