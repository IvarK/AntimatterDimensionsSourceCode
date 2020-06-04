"use strict";

Vue.component("new-galaxy-row", {
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
      return AntimatterDimension(this.requirement.tier).shortDisplayName;
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
            `Quadratic past ${formatInt(this.distantStart)} (distant), exponential past ${formatInt(800)} (remote)`;
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
      this.galaxies.dilation = player.dilation.freeGalaxies;
      const requirement = Galaxy.requirement;
      this.requirement.amount = requirement.amount;
      this.requirement.tier = requirement.tier;
      this.canBeBought = requirement.isSatisfied && Galaxy.canBeBought;
      this.distantStart = EternityChallenge(5).isRunning ? 0 : Galaxy.costScalingStart;
      this.lockText = Galaxy.lockText;
    },
    buyGalaxy(bulk) {
      requestGalaxyReset(bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
    },
  },
  template:
  `<div class="reset-container galaxy">
    <div style="height: 4rem;"><h4>{{typeName}} ({{sumText}})</h4></div>
    <span>Requires: {{formatInt(requirement.amount)}} {{dimName}} Antimatter D</span>
    <div style="height: 2rem;">{{ hasIncreasedScaling ? costScalingText : "" }}</div>
    <button
      class="o-primary-btn o-primary-btn--new" style="height: 56px; font-size: 1rem;"
      :class="{ 'o-primary-btn--disabled': !canBeBought, ...tutorialClass }"
      @click.exact="buyGalaxy(true)"
      @click.shift.exact="buyGalaxy(false)"
      :enabled="canBeBought"
    >{{buttonText}}</button>
  </div>`
});
