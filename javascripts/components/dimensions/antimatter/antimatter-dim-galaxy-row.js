"use strict";

Vue.component("antimatter-dim-galaxy-row", {
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
      return AntimatterDimension(this.requirement.tier).displayName;
    },
    buttonText() {
      return this.lockText === null
        ? "Reset your Dimensions and Dimension Boosts to increase the power of Tickspeed upgrades"
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
          return `Each Galaxy is more expensive past ${formatInt(this.distantStart)} Galaxies`;
        case GALAXY_TYPE.REMOTE:
          return "Increased Galaxy cost scaling: " +
            `Quadratic past ${formatInt(this.distantStart)} (distant),
              exponential past ${formatInt(Galaxy.remoteStart)} (remote)`;
      }
      return undefined;
    },
    tutorialClass() {
      return Tutorial.glowingClass(TUTORIAL_STATE.GALAXY, this.canBeBought);
    }
  },
  methods: {
    update() {
      this.type = Galaxy.type;
      this.galaxies.normal = player.galaxies;
      this.galaxies.replicanti = Replicanti.galaxies.total;
      this.galaxies.dilation = player.dilation.totalTachyonGalaxies;
      const requirement = Galaxy.requirement;
      this.requirement.amount = requirement.amount;
      this.requirement.tier = requirement.tier;
      this.canBeBought = requirement.isSatisfied && Galaxy.canBeBought;
      this.distantStart = EternityChallenge(5).isRunning ? 0 : Galaxy.costScalingStart;
      this.lockText = Galaxy.lockText;
    },
    buyGalaxy(bulk) {
      if (player.options.confirmations.antimatterGalaxy) {
        Modal.antimatterGalaxy.show({ bulk });
        return;
      }
      requestGalaxyReset(bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
    },
  },
  template: `
    <div class="c-antimatter-dim-row">
      <div class="c-dim-row__label c-dim-row__label--growable" style="height: 6rem;">
        {{ typeName }} ({{ sumText }}):
        requires {{ formatInt(requirement.amount) }} {{ dimName }} Dimensions
        <div style="height: 2rem;">{{ hasIncreasedScaling ? costScalingText : "" }}</div>
      </div>
      <primary-button
        :enabled="canBeBought"
        class="o-primary-btn--galaxy l-dim-row__button l-dim-row__button--right-offset"
        :class="tutorialClass"
        @click.exact="buyGalaxy(true)"
        @click.shift.exact="buyGalaxy(false)"
      >
        {{ buttonText }}
      </primary-button>
    </div>`
});
