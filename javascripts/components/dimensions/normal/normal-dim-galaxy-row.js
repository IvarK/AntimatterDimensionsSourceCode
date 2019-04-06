Vue.component("normal-dim-galaxy-row", {
  data() {
    return {
      type: "",
      galaxies: {
        normal: 0,
        replicanti: 0,
        dilation: 0
      },
      requirement: {
        tier: 1,
        amount: 0
      },
      isAffordable: false,
      hasIncreasedScaling: false,
      costScalingText: "",
      lockMessage: null,
    };
  },
  computed: {
    galaxySumDisplay() {
      const galaxies = this.galaxies;
      let sum = shortenSmallInteger(galaxies.normal);
      if (galaxies.replicanti > 0) {
        sum += " + " + shortenSmallInteger(galaxies.replicanti);
      }
      if (galaxies.dilation > 0) {
        sum += " + " + shortenSmallInteger(galaxies.dilation);
      }
      return sum;
    },
    dimName() {
      return DISPLAY_NAMES[this.requirement.tier];
    },
    buttonMessage() {
      return this.lockMessage
        ? this.lockMessage
        : "Lose all your previous progress, but get a tickspeed boost";
    }
  },
  methods: {
    update() {
      this.type = Galaxy.type;
      this.galaxies.normal = player.galaxies;
      this.galaxies.dilation = player.dilation.freeGalaxies;
      this.galaxies.replicanti = Replicanti.galaxies.total;
      const requirement = Galaxy.requirement;
      this.requirement.amount = requirement.amount;
      this.requirement.tier = requirement.tier;
      this.isAffordable = requirement.isSatisfied;
      if (Galaxy.canBeBought) {
        this.lockMessage = null;
      } else if (EternityChallenge(6).isRunning) {
        this.lockMessage = "Locked (Eternity Challenge 6)";
      } else if (Challenge(8).isRunning) {
        this.lockMessage = "Locked (8th Dimension Autobuyer Challenge)";
      } else if (player.currentChallenge === "postc7") {
        this.lockMessage = "Locked (Infinity Challenge 7";
      } else {
        this.lockMessage = null;
      }
      this.updateCostScaling();
    },
    secondSoftReset() {
      galaxyResetBtnClick();
    },
    updateCostScaling() {
      const distantStart = EternityChallenge(5).isRunning ? 0 : Galaxy.costScalingStart;
      this.hasIncreasedScaling = player.galaxies > distantStart;
      if (Galaxy.type.startsWith("Distant")) {
        this.costScalingText = "Each galaxy is more expensive past " + distantStart + " galaxies";
        return;
      }
      if (Galaxy.type.startsWith("Remote")) {
        const remoteStart = 800;
        this.costScalingText = "Increased galaxy cost scaling: " +
          `Quadratic past ${distantStart} (distant), exponential past ${remoteStart} (remote)`;
        return;
      }
      this.costScalingText = "";
    }
  },
  template:
    `<div class="c-normal-dim-row">
      <div
        class="c-normal-dim-row__label c-normal-dim-row__label--growable"
      >{{type}} ({{galaxySumDisplay}}): requires {{shortenSmallInteger(requirement.amount)}} {{dimName}} Dimensions
        <div v-if="hasIncreasedScaling">{{costScalingText}}</div>
      </div>
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--galaxy c-normal-dim-row__buy-button c-normal-dim-row__buy-button--right-offset"
        @click="secondSoftReset"
      >{{buttonMessage}}</primary-button>
    </div>`
});