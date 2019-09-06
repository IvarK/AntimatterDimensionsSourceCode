"use strict";

Vue.component("infinity-upgrades-tab", {
  data() {
    return {
      chargeUnlocked: false,
      chargesLeft: 0,
      disCharge: false,
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
        "o-primary-btn--respec-options": true,
        "o-primary-btn--respec-active": this.disCharge
      };
    },
    offlineIpUpgrade: () => InfinityUpgrade.ipOffline
  },
  methods: {
    update() {
      this.chargeUnlocked = Ra.chargeUnlocked;
      this.chargesLeft = Ra.chargesLeft;
      this.disCharge = player.celestials.ra.disCharge;
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
  template:
    `<div class="l-infinity-upgrades-tab">
      <div v-if="chargeUnlocked">
          <div>
            You can charge {{ shortenSmallInteger(chargesLeft) }} more {{ "upgrade" | pluralize(chargesLeft) }}.
          </div>
          <primary-button
          :class="disChargeClassObject"
          @click="disCharge = !disCharge"
        >Un-charge all upgrades on next Reality</primary-button>
      </div>
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
    </div>`
});
