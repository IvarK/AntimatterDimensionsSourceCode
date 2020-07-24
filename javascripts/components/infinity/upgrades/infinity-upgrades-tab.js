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
        Un-charge all upgrades on next Reality ({{ formatInt(chargesUsed) }}/{{ formatInt(totalCharges) }} charged)
        </primary-button>
      </div>
      Each upgrade requires the one above it to be purchased first.
      The bottom two upgrades require the other {{formatInt(16)}} to already be purchased.
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
      <div class="l-infinity-upgrades-bottom-row">
        <ip-multiplier-button class="l-infinity-upgrades-tab__mult-btn" />
        <infinity-upgrade-button
          :upgrade="offlineIpUpgrade"
          :class="btnClassObject(1)"
        />
      </div>
      <div>
        This IP multiplier can be bought repeatedly, but becomes more expensive
        <br>
        above {{format(ipMultSoftCap)}} IP and cannot be purchased past {{format(ipMultHardCap)}} IP.
      </div>
    </div>`
});
