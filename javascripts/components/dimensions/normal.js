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
    quickReset: function() {
      quickReset();
    },
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
      const resettableChallenges = [
        "challenge12",
        "challenge9",
        "challenge5",
        "postc1",
        "postc4",
        "postc5",
        "postc6",
        "postc8"
      ];
      this.isQuickResetAvailable = resettableChallenges.includes(player.currentChallenge);
    }
  },
  template:
    `<div style="margin-top: 5px">
      <normal-dimensions-top-row></normal-dimensions-top-row>
      <span v-if="isChallengePowerVisible">{{challengePower}}</span>
      <div style="display: flex; flex-direction: column; margin: 0 8px">
        <normal-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :floatingText="view.tabs.dimensions.normal.floatingText[tier]">
        </normal-dimension-row>
        <normal-dimension-shift-row></normal-dimension-shift-row>
        <normal-dimension-galaxy-row></normal-dimension-galaxy-row>
      </div>
      <store-button
        fontSize="12px"
        style="width: 200px; height: 50px"
        @click="quickReset"
        v-if="isQuickResetAvailable">
        Lose a reset, returning to the start of the reset
      </store-button>
      <normal-dimension-progress></normal-dimension-progress>
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
    sacrifice: function() {
      sacrificeBtnClick();
    },
    maxAll: function() {
      maxAll();
    },
    update() {
      const isSacrificeUnlocked = PlayerProgress.isSacrificeUnlocked;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = player.eightAmount > 0 && player.currentEternityChall !== "eterc3";
      this.sacrificeBoost.copyFrom(calcSacrificeBoost());
    }
  },
  template:
    `<div class="normal-dimensions-top-row">
      <input
        type="checkbox"
        style="width:20px; height: 18px"
        v-show="isSacrificeUnlocked"
        v-tooltip="'No confirmation when doing Dimensional Sacrifice'"
        v-model="options.noSacrificeConfirmation">
      <store-button
        fontSize="12px"
        :enabled="isSacrificeAffordable"
        style="width: 320px"
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        @click="sacrifice">
        Dimensional Sacrifice ({{sacrificeBoostDisplay}}x)
      </store-button>
      <store-button
        fontSize="12px"
        @click="maxAll">
        Max all (M)
      </store-button>
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
    buySingle: function() {
      buyOneDimensionBtnClick(this.tier);
    },
    buyUntil10: function() {
      buyManyDimensionsBtnClick(this.tier);
    },
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
  },
  template:
    `<div class="dimension-tab-row" v-show="isUnlocked">
      <div style="width: 32%; text-align: left">
        {{name}} Dimension x{{shortenMultiplier(multiplier)}}
      </div>
      <div style="text-align: left; flex-grow: 1">
        {{amountDisplay}} ({{boughtBefore10}}){{rateOfChangeDisplay}}
      </div>
      <store-button
        fontSize="10px"
        :enabled="isAffordable"
        style="height: 25px; width: 135px; margin-right: 16px; flex-shrink: 0"
        @click="buySingle">
        Cost: {{shortenCosts(singleCost)}}
      </store-button>
      <store-button
        fontSize="10px"
        :enabled="isAffordableUntil10"
        style="height: 25px; width: 210px; flex-shrink: 0"
        @click="buyUntil10">
        Until 10, Cost: {{shortenCosts(until10Cost)}}
      </store-button>
      <div 
        class='dimension-floating-text'
        v-for="text in floatingText"
        :key="text.key">
        {{text.text}}
      </div>
    </div>`,
});

Vue.component('normal-dimension-shift-row', {
  data: function() {
    return {
      requirement: {
        tier: 1,
        amount: 1
      },
      isBoost: false,
      isAvailable: false,
      resets: 0
    };
  },
  computed: {
    name: function() {
      return this.isBoost ? "Boost" : "Shift";
    },
    dimName: function() {
      return DISPLAY_NAMES[this.requirement.tier];
    },
    buttonText: function() {
      return `Reset the game for a ${this.isBoost ? "boost" : "new Dimension"}`;
    }
  },
  methods: {
    softReset: function() {
      softResetBtnClick();
    },
    update() {
      const requirement = getShiftRequirement(0);
      this.requirement.tier = requirement.tier;
      this.requirement.amount = requirement.amount;
      this.isBoost = player.currentChallenge === "challenge4" ?
        requirement.tier === 6 :
        requirement.tier === 8;
      this.isAvailable = NormalDimension(requirement.tier).amount >= requirement.amount;
      this.resets = player.resets;
    }
  },
  template:
    `<div class="dimension-tab-row">
      <div style="width: 32%; text-align: left; flex-grow: 1">
        Dimension {{name}} ({{resets}}): requires {{requirement.amount}} {{dimName}} Dimensions
      </div>
      <store-button
        fontSize="9px"
        :enabled="isAvailable"
        @click="softReset"
        style="height: 25px; width: 200px; margin-right: 100px">
        {{buttonText}}
      </store-button>
    </div>`
});

Vue.component('normal-dimension-galaxy-row', {
  data: function() {
    return {
      type: String.empty,
      galaxies: {
        normal: 0,
        extra: 0,
        free: 0
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
      if (galaxies.extra > 0) {
        sum += " + " + galaxies.extra;
      }
      if (galaxies.free > 0) {
        sum += " + " + galaxies.free;
      }
      return sum;
    },
    dimName: function() {
      return DISPLAY_NAMES[this.requirement.tier];
    }
  },
  methods: {
    secondSoftReset: function() {
      secondSoftResetBtnClick();
    },
    update() {
      this.type = GalaxyType.current();
      this.galaxies.normal = player.galaxies;
      this.galaxies.free = player.dilation.freeGalaxies;

      let extraGals = player.replicanti.galaxies;
      if (player.timestudy.studies.includes(225)) {
        extraGals += Math.floor(player.replicanti.amount.e / 1000);
      }
      if (player.timestudy.studies.includes(226)) {
        extraGals += Math.floor(player.replicanti.gal / 15);
      }
      this.galaxies.extra = extraGals;

      const requirement = getGalaxyRequirement();
      this.requirement.amount = requirement;
      this.requirement.tier = player.currentChallenge === "challenge4" ? 6 : 8;

      this.isAffordable = NormalDimension(requirement.tier).amount >= requirement.amount;
    }
  },
  template:
    `<div class="dimension-tab-row">
      <div style="width: 32%; text-align: left; flex-grow: 1">
        {{type}} ({{galaxySumDisplay}}): requires {{requirement.amount}} {{dimName}} Dimensions
      </div>
      <store-button 
        fontSize="9px"
        :enabled="isAffordable"
        @click="secondSoftReset"
        style="height: 35px; width: 200px; margin-right: 100px"> 
        Lose all your previous progress, but get a tickspeed boost
      </store-button>
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
    `<div id="progress">
        <div id="progressbar" :style="progressBarStyle">
            <span id="progresspercent" v-tooltip="tooltip">
              {{percents}}
            </span>
          </div>
    </div>`
});