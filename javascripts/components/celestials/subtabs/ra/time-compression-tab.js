"use strict";

Vue.component("time-compression-tab", {
  data() {
    return {
      entanglement: 0,
      recordAntimatter: new Decimal(0),
      respec: false,
    };
  },
  watch: {
    respec(newValue) {
      player.celestials.ra.compression.respec = newValue;
    }
  },
  computed: {
    upgrades() {
      return [
        [
          CompressionUpgrade.freeBoost,
          CompressionUpgrade.improvedDTMult,
          CompressionUpgrade.replicantiSpeedFromDB
        ],
        [
          CompressionUpgrade.strongerDilationGalaxies,
          CompressionUpgrade.freeGalaxySoftcap,
          CompressionUpgrade.freeGalaxyScaling
        ],
        [
          CompressionUpgrade.infDimSoftcap,
          CompressionUpgrade.moreEntanglement,
          CompressionUpgrade.matterBoost
        ],
      ];
    },
    respecClassObject() {
      return {
        "o-primary-btn--respec-options": true,
        "o-primary-btn--respec-active": this.respec
      };
    }
  },
  methods: {
    update() {
      this.entanglement = player.celestials.ra.compression.entanglement;
      this.recordAntimatter.copyFrom(player.dilation.tachyonParticles);
      this.respec = player.celestials.ra.compression.respec;
    }
  },
  template:
    `<div class="l-dilation-tab">
      <span>
        You have
        <span class="c-dilation-tab__tachyons">{{shorten(entanglement, 2, 2)}}</span>
        Entanglement.
      </span>
      <compression-button />
      <span>
        Time compression is a stronger type of dilation which dilates values twice, <br>
        disables time dimensions, and causes the game to run {{ shorten(1e100) }} times slower.
      </span>
      <div class="l-dilation-upgrades-grid">
        <div v-for="row in upgrades" class="l-dilation-upgrades-grid__row">
          <compression-upgrade
            v-for="upgrade in row"
            :key="upgrade.id"
            :upgrade="upgrade"
            class="l-dilation-upgrades-grid__cell"
          />
        </div>
      </div>
      <primary-button
          :class="respecClassObject"
          @click="respec = !respec"
        >Respec compression upgrades on Reality</primary-button>
    </div>`
});