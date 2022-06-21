<script>
import InfinityUpgradeButton from "@/components/InfinityUpgradeButton";
import IpMultiplierButton from "./IpMultiplierButton";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "InfinityUpgradesTab",
  components: {
    PrimaryButton,
    InfinityUpgradeButton,
    IpMultiplierButton
  },
  data() {
    return {
      isUseless: false,
      chargeUnlocked: false,
      totalCharges: 0,
      chargesUsed: 0,
      disCharge: false,
      ipMultSoftCap: 0,
      ipMultHardCap: 0,
      eternityUnlocked: false,
      bottomRowUnlocked: false,
      styleOfColumnBg: undefined
    };
  },
  computed: {
    grid() {
      return [
        [
          InfinityUpgrade.totalTimeMult,
          InfinityUpgrade.dim18mult,
          InfinityUpgrade.dim36mult,
          InfinityUpgrade.resetBoost
        ],
        [
          InfinityUpgrade.buy10Mult,
          InfinityUpgrade.dim27mult,
          InfinityUpgrade.dim45mult,
          InfinityUpgrade.galaxyBoost
        ],
        [
          InfinityUpgrade.thisInfinityTimeMult,
          InfinityUpgrade.unspentIPMult,
          InfinityUpgrade.dimboostMult,
          InfinityUpgrade.ipGen
        ],
        [
          InfinityUpgrade.skipReset1,
          InfinityUpgrade.skipReset2,
          InfinityUpgrade.skipReset3,
          InfinityUpgrade.skipResetGalaxy
        ]
      ];
    },
    allColumnUpgrades() {
      return this.grid.flat();
    },
    disChargeClassObject() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--charged-respec-active": this.disCharge
      };
    },
    offlineIpUpgrade: () => InfinityUpgrade.ipOffline
  },
  watch: {
    disCharge(newValue) {
      player.celestials.ra.disCharge = newValue;
    }
  },
  created() {
    this.on$(GAME_EVENT.INFINITY_UPGRADE_BOUGHT, () => this.setStyleOfColumnBg());

    this.setStyleOfColumnBg();
  },
  methods: {
    update() {
      this.isUseless = Pelle.isDoomed;
      this.chargeUnlocked = Ra.unlocks.chargedInfinityUpgrades.canBeApplied && !Pelle.isDoomed;
      this.totalCharges = Ra.totalCharges;
      this.chargesUsed = Ra.totalCharges - Ra.chargesLeft;
      this.disCharge = player.celestials.ra.disCharge;
      this.ipMultSoftCap = GameDatabase.infinity.upgrades.ipMult.costIncreaseThreshold;
      this.ipMultHardCap = GameDatabase.infinity.upgrades.ipMult.costCap;
      this.eternityUnlocked = PlayerProgress.current.isEternityUnlocked;
      this.bottomRowUnlocked = Achievement(41).isUnlocked;
    },
    btnClassObject(column) {
      const classObject = {
        "l-infinity-upgrade-grid__cell": true
      };
      if (column > 0) {
        // Indexing starts from 0, while css classes start from 2 (and first column has default css class)
        classObject[`o-infinity-upgrade-btn--color-${column + 1}`] = true;
      }
      return classObject;
    },
    setStyleOfColumnBg() {
      // Infinity upgrades are 10 rem tall, if counting margins.
      const INF_UPG_HEIGHT = 10;
      const MAX_HEIGHT = INF_UPG_HEIGHT * 4;

      this.styleOfColumnBg = this.grid.map(col => {
        const boughtUpgrades = col.countWhere(upg => upg.isBought);

        const heightUpper = boughtUpgrades * INF_UPG_HEIGHT / MAX_HEIGHT;
        const heightLower = Math.min((boughtUpgrades + 1) * INF_UPG_HEIGHT / MAX_HEIGHT, 1);
        return {
          background: `linear-gradient(to bottom, var(--color-good) 0% ${heightUpper * 100}%,
          transparent ${heightLower * 100}%)`
        };
      });
    },
  }
};
</script>

<template>
  <div class="l-infinity-upgrades-tab">
    <div
      v-if="chargeUnlocked"
      class="c-subtab-option-container"
    >
      <PrimaryButton
        :class="disChargeClassObject"
        @click="disCharge = !disCharge"
      >
        Respec Charged Infinity Upgrades on next Reality
      </PrimaryButton>
    </div>
    <div v-if="chargeUnlocked">
      You have charged {{ formatInt(chargesUsed) }}/{{ formatInt(totalCharges) }} Infinity Upgrades.
      Charged Infinity Upgrades have their effect altered.
      <br>
      Hold shift to show Charged Infinity Upgrades. You can freely respec your choices on Reality.
    </div>
    <div v-if="isUseless">
      You cannot Charge Infinity Upgrades while Doomed.
    </div>
    <br>
    Within each column, the upgrades must be purchased from top to bottom.
    <br>
    <div class="l-infinity-upgrade-grid l-infinity-upgrades-tab__grid">
      <div
        v-for="(column, columnId) in grid"
        :key="columnId"
        class="c-infinity-upgrade-grid__column"
      >
        <InfinityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
          :class="btnClassObject(columnId)"
        />
        <div
          class="c-infinity-upgrade-grid__column--background"
          :style="styleOfColumnBg[columnId]"
        />
      </div>
    </div>
    <div
      v-if="bottomRowUnlocked"
      class="l-infinity-upgrades-bottom-row"
    >
      <IpMultiplierButton class="l-infinity-upgrades-tab__mult-btn" />
      <InfinityUpgradeButton
        :upgrade="offlineIpUpgrade"
        :class="btnClassObject(1)"
      />
    </div>
    <div v-if="eternityUnlocked && bottomRowUnlocked">
      The Infinity Point multiplier becomes more expensive
      <br>
      above {{ formatPostBreak(ipMultSoftCap) }} Infinity Points, and cannot be purchased past
      {{ formatPostBreak(ipMultHardCap) }} Infinity Points.
    </div>
  </div>
</template>

<style scoped>
.c-infinity-upgrade-grid__column {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  position: relative;
  border-radius: var(--var-border-radius, 0.3rem);
  margin: 0 0.3rem;
}

.c-infinity-upgrade-grid__column--background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.9;
}

.s-base--dark .c-infinity-upgrade-grid__column--background {
  opacity: 0.5;
}

.l-infinity-upgrades-bottom-row .l-infinity-upgrade-grid__cell,
.l-infinity-upgrades-bottom-row .l-infinity-upgrades-tab__mult-btn {
  margin: 0.5rem 1.1rem;
}
</style>
