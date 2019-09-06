"use strict";

Vue.component("time-dilation-tab", {
  data() {
    return {
      tachyons: new Decimal(0),
      dilatedTime: new Decimal(0),
      dilatedTimeIncome: new Decimal(0),
      galaxyThreshold: new Decimal(0),
      galaxies: 0,
      animateTachyons: true,
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
        [
          DilationUpgrade.bankedIncrease,
          DilationUpgrade.ttGenerator,
          DilationUpgrade.lowReplicantiMult
        ],
      ];
    },
  },
  methods: {
    update() {
      this.tachyons.copyFrom(player.dilation.tachyonParticles);
      this.dilatedTime.copyFrom(player.dilation.dilatedTime);
      this.dilatedTimeIncome.copyFrom(getDilationGainPerSecond().times(getGameSpeedupForDisplay()));
      this.galaxyThreshold.copyFrom(player.dilation.nextThreshold);
      this.galaxies = player.dilation.freeGalaxies;
      this.animateTachyons = player.options.animations.tachyonParticles;
    }
  },
  template:
    `<div class="l-dilation-tab">
      <span>
        You have
        <span class="c-dilation-tab__tachyons">{{shorten(tachyons, 2, 1)}}</span>
        Tachyon {{"Particle" | pluralize(tachyons)}}.
      </span>
      <dilation-button />
      <span>
        You have
        <span class="c-dilation-tab__dilated-time">{{shorten(dilatedTime, 2, 1)}}</span>
        Dilated Time.
        <span class="c-dilation-tab__dilated-time-income">+{{shorten(dilatedTimeIncome, 2, 1)}}/s</span>
      </span>
      <span>
        Next free galaxy at
        <span class="c-dilation-tab__galaxy-threshold">{{shorten(galaxyThreshold, 2, 1)}}</span>
        Dilated Time, gained total of
        <span class="c-dilation-tab__galaxies">{{shortenSmallInteger(galaxies)}}</span>
        galaxies
      </span>
      <div class="l-dilation-upgrades-grid">
        <div class="l-dilation-upgrades-grid__row">
          <dilation-upgrade
            v-for="upgrade in rebuyables"
            :key="upgrade.id"
            :upgrade="upgrade"
            :isRebuyable="true"
            class="l-dilation-upgrades-grid__cell"
          />
        </div>
        <div v-for="row in upgrades" class="l-dilation-upgrades-grid__row">
          <dilation-upgrade
            v-for="upgrade in row"
            :key="upgrade.id"
            :upgrade="upgrade"
            class="l-dilation-upgrades-grid__cell"
          />
        </div>
      </div>
      <tachyon-particles v-if="animateTachyons" />
    </div>`
});