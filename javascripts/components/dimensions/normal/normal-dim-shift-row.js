Vue.component('normal-dim-shift-row', {
  data: function() {
    return {
      requirement: {
        tier: 1,
        amount: 1
      },
      isShift: false,
      isAffordable: false,
      resets: 0
    };
  },
  computed: {
    name: function() {
      return this.isShift ? "Shift" : "Boost";
    },
    dimName: function() {
      return DISPLAY_NAMES[this.requirement.tier];
    },
    buttonText: function() {
      return `Reset the game for a ${this.isShift ? "new Dimension" : "boost"}`;
    }
  },
  methods: {
    update() {
      const requirement = DimBoost.requirement;
      this.requirement.tier = requirement.tier;
      this.requirement.amount = requirement.amount;
      this.isAffordable = requirement.isSatisfied;
      this.isShift = DimBoost.isShift;
      this.resets = player.resets;
    },
    softReset: function() {
      softResetBtnClick();
    }
  },
  template:
    `<div class="c-normal-dim-row">
      <div 
        class="c-normal-dim-row__label c-normal-dim-row__label--growable"
      >Dimension {{name}} ({{resets}}): requires {{requirement.amount}} {{dimName}} Dimensions</div>
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--dimboost c-normal-dim-row__buy-button c-normal-dim-row__buy-button--right-offset"
        @click="softReset"
      >{{buttonText}}</primary-button>
    </div>`
});