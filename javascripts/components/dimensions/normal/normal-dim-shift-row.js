"use strict";

Vue.component("normal-dim-shift-row", {
  data() {
    return {
      requirement: {
        tier: 1,
        amount: 0
      },
      isShift: false,
      isBuyable: false,
      resets: 0
    };
  },
  computed: {
    name() {
      return this.isShift ? "Shift" : "Boost";
    },
    dimName() {
      return DISPLAY_NAMES[this.requirement.tier];
    },
    buttonText() {
      return `Reset the game for a ${this.isShift ? "new Dimension" : "boost"}`;
    }
  },
  methods: {
    update() {
      const requirement = DimBoost.requirement;
      this.requirement.tier = requirement.tier;
      this.requirement.amount = requirement.amount;
      this.isBuyable = requirement.isSatisfied;
      this.isShift = DimBoost.isShift;
      this.resets = player.resets;
    },
    softReset() {
      softResetBtnClick();
    }
  },
  template:
    `<div class="c-normal-dim-row">
      <div 
        class="c-normal-dim-row__label c-normal-dim-row__label--growable"
      >
        Dimension {{name}} ({{shortenSmallInteger(resets)}}):
        requires {{shortenSmallInteger(requirement.amount)}} {{dimName}} Dimensions
      </div>
      <primary-button
        :enabled="isBuyable"
        class="o-primary-btn--dimboost c-normal-dim-row__buy-button c-normal-dim-row__buy-button--right-offset"
        @click="softReset"
      >{{buttonText}}</primary-button>
    </div>`
});