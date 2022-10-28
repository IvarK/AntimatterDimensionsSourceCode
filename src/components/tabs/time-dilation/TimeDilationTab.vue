<script>
import DilationButton from "./DilationButton";
import DilationUpgradeButton from "./DilationUpgradeButton";

export default {
  name: "TimeDilationTab",
  components: {
    DilationButton,
    DilationUpgradeButton
  },
  data() {
    return {
      tachyons: new Decimal(),
      dilatedTime: new Decimal(),
      currentDTGain: new Decimal(),
      dilatedTimeIncome: new Decimal(),
      galaxyThreshold: new Decimal(),
      galaxies: 0,
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
    // This might be negative due to rift drain, so we need to add "+" iff the value is positive. The actual
    // addition of a negative sign (or not) is assumed to be handled in a notation-specific way
    dilatedTimeGainText() {
      const sign = this.dilatedTimeIncome.gte(0) ? "+" : "";
      return `${sign}${format(this.dilatedTimeIncome, 2, 1)}`;
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
    },
    timeEstimate() {
      return getDilationTimeEstimate(this.galaxyThreshold);
    }
  },
  methods: {
    update() {
      this.tachyons.copyFrom(Currency.tachyonParticles);
      this.dilatedTime.copyFrom(Currency.dilatedTime);
      this.currentDTGain.copyFrom(getDilationGainPerSecond());
      const rawDTGain = this.currentDTGain.times(getGameSpeedupForDisplay());
      if (PelleRifts.paradox.isActive) {
        // The number can be small and either positive or negative with the rift active, which means that extra care
        // needs to be taken to get the calculation as close to correct as possible. This relies on some details
        // related to tick microstructure to make things accurate, and it seems to be to roughly 1 part in 5e6
        const tickProp = player.options.updateRate / 1000;
        const drainFactorPerTick = 1 - (1 - Pelle.riftDrainPercent) ** tickProp;
        const drainPerSecond = this.dilatedTime.add(rawDTGain.times(tickProp)).times(drainFactorPerTick / tickProp);
        this.dilatedTimeIncome = rawDTGain.minus(drainPerSecond);
      } else {
        this.dilatedTimeIncome = rawDTGain;
      }
      this.galaxyThreshold.copyFrom(player.dilation.nextThreshold);
      this.galaxies = player.dilation.totalTachyonGalaxies;
      this.hasPelleDilationUpgrades = PelleRifts.paradox.milestones[0].canBeApplied;
      if (this.galaxies < 1000 && DilationUpgrade.doubleGalaxies.isBought) {
        this.tachyonGalaxyGain = DilationUpgrade.doubleGalaxies.effectValue;
      } else {
        this.tachyonGalaxyGain = 1;
      }
      this.tachyonGalaxyGain *= DilationUpgrade.galaxyMultiplier.effectValue;
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
      <span class="c-dilation-tab__dilated-time-income">{{ dilatedTimeGainText }}/s</span>
    </span>
    <span>
      Next
      <span v-if="tachyonGalaxyGain > 1">{{ formatInt(tachyonGalaxyGain) }}</span>
      {{ pluralize("Tachyon Galaxy", tachyonGalaxyGain) }} at
      <span
        class="c-dilation-tab__galaxy-threshold"
        :ach-tooltip="timeEstimate"
      >{{ format(galaxyThreshold, 2, 1) }}</span>
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
      <div class="l-dilation-upgrades-grid__row">
        <DilationUpgradeButton
          :upgrade="ttGenerator"
          class="l-dilation-upgrades-grid__cell"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
