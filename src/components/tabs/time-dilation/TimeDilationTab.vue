<script>
import DilationButton from "./DilationButton";
import DilationUpgradeButton from "./DilationUpgradeButton";
import TachyonParticles from "./TachyonParticles";

export default {
  name: "TimeDilationTab",
  components: {
    DilationButton,
    DilationUpgradeButton,
    TachyonParticles
  },
  data() {
    return {
      tachyons: new Decimal(),
      dilatedTime: new Decimal(),
      dilatedTimeIncome: new Decimal(),
      galaxyThreshold: new Decimal(),
      galaxies: 0,
      animateTachyons: true,
      tachyonGalaxyGain: 1,
      hasPelleDilationUpgrades: false
    };
  },
  computed: {
    rebuyables() {
      return [
        DilationUpgrade.dtGain,
        DilationUpgrade.galaxyThreshold,
        DilationUpgrade.tachyonGain
      ];
    },
    upgrades() {
      return [
        [
          DilationUpgrade.doubleGalaxies,
          DilationUpgrade.tdMultReplicanti,
          DilationUpgrade.ndMultDT
        ],
        [
          DilationUpgrade.ipMultDT,
          DilationUpgrade.timeStudySplit,
          DilationUpgrade.dilationPenalty
        ],
      ];
    },
    pelleRebuyables() {
      return [
        DilationUpgrade.dtGainPelle,
        DilationUpgrade.galaxyMultiplier,
        DilationUpgrade.tickspeedPower
      ];
    },
    pelleUpgrades() {
      return [
        DilationUpgrade.galaxyThresholdPelle,
        DilationUpgrade.flatDilationMult
      ];
    },
    ttGenerator() {
      return DilationUpgrade.ttGenerator;
    }
  },
  methods: {
    update() {
      this.tachyons.copyFrom(Currency.tachyonParticles);
      this.dilatedTime.copyFrom(Currency.dilatedTime);
      this.dilatedTimeIncome.copyFrom(getDilationGainPerSecond().times(getGameSpeedupForDisplay()));
      this.galaxyThreshold.copyFrom(player.dilation.nextThreshold);
      this.galaxies = player.dilation.totalTachyonGalaxies;
      this.animateTachyons = player.options.animations.tachyonParticles;
      this.hasPelleDilationUpgrades = PelleRifts.death.hasMilestone(0);
      if (this.galaxies < 1000 && DilationUpgrade.doubleGalaxies.isBought) {
        this.tachyonGalaxyGain = DilationUpgrade.doubleGalaxies.effectValue;
      } else {
        this.tachyonGalaxyGain = 1;
      }
    }
  }
};
</script>

<template>
  <div class="l-dilation-tab">
    <span>
      You have
      <span class="c-dilation-tab__tachyons">{{ format(tachyons, 2, 1) }}</span>
      {{ pluralize("Tachyon Particle", tachyons) }}.
    </span>
    <DilationButton />
    <span>
      You have
      <span class="c-dilation-tab__dilated-time">{{ format(dilatedTime, 2, 1) }}</span>
      Dilated Time.
      <span class="c-dilation-tab__dilated-time-income">+{{ format(dilatedTimeIncome, 2, 1) }}/s</span>
    </span>
    <span>
      Next <span v-if="tachyonGalaxyGain === 2"> pair of </span>
      <span v-else-if="tachyonGalaxyGain > 1">{{ formatInt(tachyonGalaxyGain) }}</span>
      {{ pluralize("Tachyon Galaxy", tachyonGalaxyGain) }} at
      <span class="c-dilation-tab__galaxy-threshold">{{ format(galaxyThreshold, 2, 1) }}</span>
      Dilated Time, gained total of
      <span class="c-dilation-tab__galaxies">{{ formatInt(galaxies) }}</span>
      {{ pluralize("Tachyon Galaxy", galaxies) }}
    </span>
    <div class="l-dilation-upgrades-grid">
      <div class="l-dilation-upgrades-grid__row">
        <DilationUpgradeButton
          v-for="upgrade in rebuyables"
          :key="upgrade.id"
          :upgrade="upgrade"
          :is-rebuyable="true"
          class="l-dilation-upgrades-grid__cell"
        />
      </div>
      <div
        v-if="hasPelleDilationUpgrades"
        class="l-dilation-upgrades-grid__row"
      >
        <DilationUpgradeButton
          v-for="upgrade in pelleRebuyables"
          :key="upgrade.id"
          :upgrade="upgrade"
          :is-rebuyable="true"
          class="l-dilation-upgrades-grid__cell"
        />
      </div>
      <div
        v-if="hasPelleDilationUpgrades"
        class="l-dilation-upgrades-grid__row"
      >
        <DilationUpgradeButton
          v-for="upgrade in pelleUpgrades"
          :key="upgrade.id"
          :upgrade="upgrade"
          class="l-dilation-upgrades-grid__cell"
        />
      </div>
      <div
        v-for="(row, i) in upgrades"
        :key="i"
        class="l-dilation-upgrades-grid__row"
      >
        <DilationUpgradeButton
          v-for="upgrade in row"
          :key="upgrade.id"
          :upgrade="upgrade"
          class="l-dilation-upgrades-grid__cell"
        />
      </div>
      <div class="l-dilation-upgrades-grid__row">
        <DilationUpgradeButton
          :upgrade="ttGenerator"
          class="l-dilation-upgrades-grid__cell"
        />
      </div>
    </div>
    <TachyonParticles v-if="animateTachyons" />
  </div>
</template>

<style scoped>

</style>
