"use strict";

Vue.component("infinity-upgrades-tab", {
  data() {
    return {
      chargeUnlocked: false,
      totalCharges: 0,
      chargesUsed: 0,
      disCharge: false,
      ipMultSoftCap: 0,
      ipMultHardCap: 0,
      eternityUnlocked: false,
      bottomRowUnlocked: false
    };
  },
  watch: {
    disCharge(newValue) {
      player.celestials.ra.disCharge = newValue;
    }
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
    disChargeClassObject() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--charged-respec-active": this.disCharge
      };
    },
    offlineIpUpgrade: () => InfinityUpgrade.ipOffline
  },
  methods: {
    update() {
      this.chargeUnlocked = Ra.chargeUnlocked;
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
    }
  },
  template: `
    <div class="l-infinity-upgrades-tab">
      <div class="c-subtab-option-container" v-if="chargeUnlocked">
        <primary-button
          :class="disChargeClassObject"
          @click="disCharge = !disCharge"
        >
          Respec Charged Infinity Upgrades on next Reality
        </primary-button>
      </div>
      <div v-if="chargeUnlocked">
        You have charged {{ formatInt(chargesUsed) }}/{{ formatInt(totalCharges) }} Infinity Upgrades.
        Charged Infinity Upgrades have their effect altered.
        <br>
        Hold shift to show Charged Infinity Upgrades. You can freely respec your choices on Reality.
      </div>
      <div v-if="!chargeUnlocked">
        Each upgrade requires the one above it to be purchased first.
        <br v-if="!bottomRowUnlocked">
        The bottom two upgrades
        <span v-if="!bottomRowUnlocked">(once they're unlocked via the achievement "No DLC required")</span>
        require the other {{ formatInt(16) }} to already be purchased.
      </div>
      <br>
      <div class="l-infinity-upgrade-grid l-infinity-upgrades-tab__grid">
        <div v-for="(column, columnId) in grid" class="l-infinity-upgrade-grid__column">
          <infinity-upgrade-button
            v-for="upgrade in column"
            :key="upgrade.id"
            :upgrade="upgrade"
            :class="btnClassObject(columnId)"
          />
        </div>
      </div>
      <div class="l-infinity-upgrades-bottom-row" v-if="bottomRowUnlocked">
        <ip-multiplier-button class="l-infinity-upgrades-tab__mult-btn" />
        <infinity-upgrade-button
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
    </div>`
});
