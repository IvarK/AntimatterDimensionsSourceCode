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
      isAffordable: false
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
    },
    secondSoftReset: function() {
      galaxyResetBtnClick();
    }
  },
  template:
    `<div class="c-normal-dim-row">
      <div
        class="c-normal-dim-row__label c-normal-dim-row__label--growable"
      >{{type}} ({{galaxySumDisplay}}): requires {{requirement.amount}} {{dimName}} Dimensions</div>
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--galaxy c-normal-dim-row__buy-button c-normal-dim-row__buy-button--right-offset"
        @click="secondSoftReset"
      >Lose all your previous progress, but get a tickspeed boost</primary-button>
    </div>`
});