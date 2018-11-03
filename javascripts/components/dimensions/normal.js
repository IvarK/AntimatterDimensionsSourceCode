Vue.component('dimensions-normal', {
  props: {
    view: Object
  },
  data: function() {
    return {
      isChallengePowerVisible: false,
      challengePower: String.empty,
      isQuickResetAvailable: false
    };
  },
  methods: {
    update() {
      const isC2Running = player.currentChallenge === "challenge2";
      const isC3Running = player.currentChallenge === "challenge3";
      const isIC1Running = player.currentChallenge === "postc1";
      const isChallengePowerVisible = isC2Running || isC3Running || isIC1Running;
      this.isChallengePowerVisible = isChallengePowerVisible;
      if (isChallengePowerVisible) {
        const c2Power = `${(player.chall2Pow * 100).toFixed(2)}%`;
        const c3Power = `${this.shorten(player.chall3Pow * 100)}%`;
        if (isIC1Running) {
          this.challengePower = `Production: ${c2Power}, First dimension: ${c3Power}`;
        }
        if (isC2Running) {
          this.challengePower = `Production: ${c2Power}`;
        }
        if (isC3Running) {
          this.challengePower = `First dimension: ${c3Power}`;
        }
      }
      this.isQuickResetAvailable = isQuickResettable(player.currentChallenge);
    },
    quickReset: function() {
      quickReset();
    }
  },
  template:
    `<div class="l-normal-dim-tab">
      <normal-dimensions-top-row />
      <span v-if="isChallengePowerVisible">{{challengePower}}</span>
      <div class="l-normal-dim-tab__row-container l-normal-dim-row-container">
        <normal-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :floatingText="view.tabs.dimensions.normal.floatingText[tier]"
        />
        <normal-dimension-shift-row />
        <normal-dimension-galaxy-row />
      </div>
      <primary-button
        v-if="isQuickResetAvailable"
        class="c-primary-btn--quick-reset"
        @click="quickReset"
      >Lose a reset, returning to the start of the reset</primary-button>
      <normal-dimension-progress class="l-normal-dim-tab__progress_bar" />
    </div>`
});

Vue.component('normal-dimensions-top-row', {
  data: function() {
    return {
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      sacrificeBoost: new Decimal(0),
      options: player.options
    };
  },
  computed: {
    sacrificeBoostDisplay: function() {
      return this.shorten(this.sacrificeBoost);
    },
    sacrificeTooltip: function() {
      return `Boosts 8th Dimension by ${this.sacrificeBoostDisplay}x`;
    },
  },
  methods: {
    update() {
      const isSacrificeUnlocked = Sacrifice.isUnlocked;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.isAffordable;
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
    },
    sacrifice: function() {
      sacrificeBtnClick();
    },
    maxAll: function() {
      maxAll();
    }
  },
  template:
    `<div class="l-normal-dim-tab__top-row">
      <input
        v-show="isSacrificeUnlocked"
        v-model="options.noSacrificeConfirmation"
        v-tooltip="'No confirmation when doing Dimensional Sacrifice'"
        type="checkbox"
        class="c-sacrifice-checkbox"
      />
      <primary-button
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable"
        class="c-primary-btn--sacrifice"
        @click="sacrifice"
      >Dimensional Sacrifice ({{sacrificeBoostDisplay}}x)</primary-button>
      <primary-button
        class="c-primary-btn--buy-max"
        @click="maxAll"
      >Max all (M)</primary-button>
    </div>`
});

Vue.component('normal-dimension-row', {
  props: {
    floatingText: Array,
    tier: Number
  },
  data: function() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      boughtBefore10: 0,
      rateOfChange: new Decimal(0),
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      isAffordableUntil10: false,
    };
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
    },
    amountDisplay: function() {
      return this.tier < 8 ? this.shortenDimensions(this.amount) : Math.round(this.amount).toString();
    },
    rateOfChangeDisplay: function() {
      return this.tier < 8 ?
        ` (+${this.shorten(this.rateOfChange)}%/s)` :
        String.empty;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const isUnlocked = canBuyDimension(tier);
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      const dimension = NormalDimension(tier);
      this.multiplier.copyFrom(getDimensionFinalMultiplier(tier));
      this.amount.copyFrom(dimension.amount);
      this.boughtBefore10 = dimension.boughtBefore10;
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.costUntil10);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.isAffordableUntil10 = dimension.isAffordableUntil10;
    },
    buySingle: function() {
      buyOneDimensionBtnClick(this.tier);
    },
    buyUntil10: function() {
      buyManyDimensionsBtnClick(this.tier);
    },
  },
  template:
    `<div v-show="isUnlocked" class="c-normal-dim-row">
      <div
        class="c-normal-dim-row__name c-normal-dim-row__label"
      >{{name}} Dimension x{{shortenMultiplier(multiplier)}}</div>
      <div
        class="c-normal-dim-row__label c-normal-dim-row__label--growable"
      >{{amountDisplay}} ({{boughtBefore10}}){{rateOfChangeDisplay}}</div>
      <primary-button
        :enabled="isAffordable"
        class="c-primary-btn--buy-nd c-primary-btn--buy-single-nd c-normal-dim-row__buy-button"
        @click="buySingle"
      >Cost: {{shortenCosts(singleCost)}}</primary-button>
      <primary-button
        :enabled="isAffordableUntil10"
        class="c-primary-btn--buy-nd c-primary-btn--buy-10-nd c-normal-dim-row__buy-button"
        @click="buyUntil10"
      >Until 10, Cost: {{shortenCosts(until10Cost)}}</primary-button>
      <div
        v-for="text in floatingText"
        :key="text.key"
        class='c-normal-dim-row__floating-text'
      >{{text.text}}</div>
    </div>`,
});

Vue.component('normal-dimension-shift-row', {
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
        class="c-primary-btn--dimboost c-normal-dim-row__buy-button c-normal-dim-row__buy-button--right-offset"
        @click="softReset"
      >{{buttonText}}</primary-button>
    </div>`
});

Vue.component('normal-dimension-galaxy-row', {
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
      this.galaxies.replicanti = Galaxy.totalReplicantiGalaxies;
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
        class="c-primary-btn--galaxy c-normal-dim-row__buy-button c-normal-dim-row__buy-button--right-offset"
        @click="secondSoftReset"
      >Lose all your previous progress, but get a tickspeed boost</primary-button>
    </div>`
});

Vue.component('normal-dimension-progress', {
  data: function() {
    return {
      fill: new Decimal(0),
      tooltip: String.empty
    };
  },
  computed: {
    percents: function() {
      return `${this.fill.toFixed(2)}%`;
    },
    progressBarStyle: function() {
      return {
        width: this.percents
      };
    }
  },
  methods: {
    update() {
      const setProgress = (current, goal, tooltip) => {
        this.fill.copyFrom(Decimal.min(Decimal.log10(current.add(1)) / Decimal.log10(goal) * 100, 100));
        this.tooltip = tooltip;
      };
      if (player.currentChallenge !== "") {
        setProgress(player.money, player.challengeTarget, "Percentage to challenge goal");
      } else if (!player.break) {
        setProgress(player.money, Number.MAX_VALUE, "Percentage to Infinity");
      } else if (player.infDimensionsUnlocked.includes(false)) {
        setProgress(player.money, getNewInfReq(), "Percentage to next dimension unlock");
      } else if (player.currentEternityChall !== "") {
        setProgress(player.infinityPoints, player.eternityChallGoal, "Percentage to eternity challenge goal");
      } else {
        setProgress(player.infinityPoints, Number.MAX_VALUE, "Percentage to Eternity");
      }
    }
  },
  template:
    `<div class="c-progress-bar">
        <div :style="progressBarStyle" class="c-progress-bar__fill">
            <span v-tooltip="tooltip" class="c-progress-bar__percents">{{percents}}</span>
          </div>
    </div>`
});