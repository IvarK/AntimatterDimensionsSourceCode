Vue.component('normal-dim-galaxy-row', {
  data: function() {
    return {
      type: String.empty,
      galaxies: {
        normal: 0,
        replicanti: 0,
        dilation: 0
      },
      requirement: {
        tier: 1,
        amount: 1
      },
      isAffordable: false,
      hasIncreasedScaling: false,
      costScalingText: ""
    };
  },
  computed: {
    galaxySumDisplay: function() {
      const galaxies = this.galaxies;
      let sum = galaxies.normal.toString();
      if (galaxies.replicanti > 0) {
        sum += " + " + galaxies.replicanti;
      }
      if (galaxies.dilation > 0) {
        sum += " + " + galaxies.dilation;
      }
      return sum;
    },
    dimName: function() {
      return DISPLAY_NAMES[this.requirement.tier];
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
      this.updateCostScaling();
    },
    secondSoftReset: function() {
      galaxyResetBtnClick();
    },
    updateCostScaling: function() {
      let distantStart = player.currentEternityChall === "eterc5" ? 0 : Galaxy.costScalingStart;
      this.hasIncreasedScaling = player.galaxies > distantStart;
      if (Galaxy.type.startsWith("Distant")) this.costScalingText = "Each galaxy is more expensive past " + distantStart + " galaxies";
      else if (Galaxy.type.startsWith("Remote")) {
        let remoteStart = 799 + Effects.sum(GlyphSacrifice.power);
        this.costScalingText = `Increased galaxy cost scaling: Quadratic past ${distantStart} (distant), exponential past ${remoteStart} (remote)`;
      }
      else  this.costScalingText = "";
    }
  },
  template:
    `<div class="c-normal-dim-row">
      <div
        class="c-normal-dim-row__label c-normal-dim-row__label--growable"
      >{{type}} ({{galaxySumDisplay}}): requires {{requirement.amount}} {{dimName}} Dimensions
        <div v-if="hasIncreasedScaling">{{costScalingText}}</div>
      </div>
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--galaxy c-normal-dim-row__buy-button c-normal-dim-row__buy-button--right-offset"
        @click="secondSoftReset"
      >Lose all your previous progress, but get a tickspeed boost</primary-button>
    </div>`
});