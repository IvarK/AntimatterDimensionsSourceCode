"use strict";

Vue.component("normal-dim-galaxy-row", {
  data() {
    return {
      type: GALAXY_TYPE.NORMAL,
      galaxies: {
        normal: 0,
        replicanti: 0,
        dilation: 0
      },
      requirement: {
        tier: 1,
        amount: 0
      },
      canBeBought: false,
      distantStart: 0,
      lockText: null
    };
  },
  computed: {
    dimName() {
      return NormalDimension(this.requirement.tier).displayName;
    },
    buttonText() {
      return this.lockText === null
        ? "Reset your Dimensions and Dimension Boosts for a tickspeed boost"
        : this.lockText;
    },
    sumText() {
      const parts = [this.galaxies.normal];
      if (this.galaxies.replicanti > 0) parts.push(this.galaxies.replicanti);
      if (this.galaxies.dilation > 0) parts.push(this.galaxies.dilation);
      const sum = parts.map(formatInt).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${formatInt(parts.sum())}`;
      }
      return sum;
    },
    typeName() {
      switch (this.type) {
        case GALAXY_TYPE.NORMAL: return "Antimatter Galaxies";
        case GALAXY_TYPE.DISTANT: return "Distant Antimatter Galaxies";
        case GALAXY_TYPE.REMOTE: return "Remote Antimatter Galaxies";
      }
      return undefined;
    },
    hasIncreasedScaling() {
      return this.type !== GALAXY_TYPE.NORMAL;
    },
    costScalingText() {
      switch (this.type) {
        case GALAXY_TYPE.DISTANT:
          return `Each galaxy is more expensive past ${formatInt(this.distantStart)} galaxies`;
        case GALAXY_TYPE.REMOTE:
          return "Increased galaxy cost scaling: " +
            `Quadratic past ${formatInt(this.distantStart)} (distant),
              exponential past ${formatInt(800)} (remote)`;
      }
      return undefined;
    }
  },
  methods: {
    update() {
      this.type = Galaxy.type;
      this.galaxies.normal = player.galaxies;
      this.galaxies.replicanti = Replicanti.galaxies.total;
      this.galaxies.dilation = player.dilation.freeGalaxies;
      const requirement = Galaxy.requirement;
      this.requirement.amount = requirement.amount;
      this.requirement.tier = requirement.tier;
      this.canBeBought = requirement.isSatisfied && Galaxy.canBeBought;
      this.distantStart = EternityChallenge(5).isRunning ? 0 : Galaxy.costScalingStart;
      this.lockText = Galaxy.lockText;
    },
    buyGalaxy: bulk => requestGalaxyReset(bulk),
  },
  template:
    `<div class="c-normal-dim-row">
      <div
        class="c-normal-dim-row__label c-normal-dim-row__label--growable"
      >{{typeName}} ({{sumText}}):
        requires {{formatInt(requirement.amount)}} {{dimName}} Dimensions
        <div v-if="hasIncreasedScaling">{{costScalingText}}</div>
      </div>
      <primary-button
        :enabled="canBeBought"
        class="o-primary-btn--galaxy c-normal-dim-row__buy-button c-normal-dim-row__buy-button--right-offset"
        @click.exact="buyGalaxy(true)"
        @click.shift.exact="buyGalaxy(false)"
      >{{buttonText}}</primary-button>
    </div>`
});
