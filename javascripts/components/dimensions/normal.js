Vue.component('dimensions-normal', {
  props: ['model', 'view'],
  computed: {
    player: function() {
      return this.model.player;
    },
    dimensions: function() {
      return this.view.tabs.dimensions.normal;
    },
    isC2Running: function() {
      return this.player.currentChallenge === "challenge2";
    },
    isC3Running: function() {
      return this.player.currentChallenge === "challenge3";
    },
    isIC1Running: function() {
      return this.player.currentChallenge === "postc1";
    },
    challengePower: function() {
      const c2Power = `${(this.player.chall2Pow * 100).toFixed(2)}%`;
      const c3Power = `${shorten(this.player.chall3Pow * 100)}%`;
      if (this.isC2Running) {
        return `Production: ${c2Power}`;
      }
      if (this.isC3Running) {
        return `First dimension: ${c3Power}`;
      }
      if (this.isIC1Running) {
        return `Production: ${c2Power}, First dimension: ${c3Power}`;
      }
      return String.empty;
    },
    isQuickResetAvailable: function() {
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
      return resettableChallenges.includes(this.player.currentChallenge);
    }
  },
  methods: {
    quickReset: function() {
      quickReset();
    }
  },
  template:
    `<div style="margin-top: 5px">
      <normal-dimensions-top-row
        :player="player"
        :dimensions="dimensions">
      </normal-dimensions-top-row>
      <span v-if="isC2Running || isC3Running || isIC1Running">{{challengePower}}</span>
      <div style="display: flex; flex-direction: column; margin: 0 8px">
        <normal-dimension-row
          v-for="tier in 8"
          :key="tier"
          :tier="tier"
          :player="player"
          :dimension="dimensions.dims[tier]">
        </normal-dimension-row>
        <normal-dimension-shift-row
          :player="player"
          :shift="dimensions.shift">
        </normal-dimension-shift-row>
        <normal-dimension-galaxy-row
          :player="player"
          :galaxy="dimensions.galaxy">
        </normal-dimension-galaxy-row>
      </div>
      <store-button
        fontSize="12px"
        style="width: 200px; height: 50px"
        @click="quickReset"
        v-if="isQuickResetAvailable">
        Lose a reset, returning to the start of the reset
      </store-button>
      <normal-dimension-progress :progress="dimensions.progress"></normal-dimension-progress>
    </div>`
});

Vue.component('normal-dimensions-top-row', {
  props: {
    player: Object,
    dimensions: Object
  },
  computed: {
    isSacrificeUnlocked: function() {
      return PlayerProgress.of(this.player).isSacrificeUnlocked;
    },
    sacrificeBoost: function() {
      return shorten(this.dimensions.sacrifice.boost);
    },
    sacrificeTooltip: function() {
      return `Boosts 8th Dimension by ${this.sacrificeBoost}x`;
    },
  },
  methods: {
    sacrifice: function() {
      sacrificeBtnClick();
    },
    maxAll: function() {
      maxAll();
    },
  },
  template:
    `<div class="normal-dimensions-top-row">
      <input
        type="checkbox"
        style="width:20px; height: 18px"
        v-if="isSacrificeUnlocked"
        v-tooltip="'No confirmation when doing Dimensional Sacrifice'"
        v-model="player.options.noSacrificeConfirmation">
      <store-button
        fontSize="12px"
        :enabled="dimensions.sacrifice.isAvailable"
        style="width: 320px"
        v-if="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        @click="sacrifice">
        Dimensional Sacrifice ({{sacrificeBoost}}x)
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
    player: Object,
    dimension: Object,
    tier: Number
  },
  computed: {
    name: function() {
      return DISPLAY_NAMES[this.tier];
    },
    multiplier: function() {
      return shortenMultiplier(this.dimension.multiplier);
    },
    stats: function() {
      return new DimensionStats(this.tier, this.player);
    },
    singleCost: function() {
      return shortenCosts(this.stats.cost);
    },
    until10Cost: function() {
      return shortenCosts(this.stats.cost.times(this.stats.remainingUntil10));
    },
    amount: function() {
      return this.tier < 8 ? shortenDimensions(this.stats.amount) : Math.round(this.stats.amount);
    },
    rateOfChange: function() {
      return this.tier < 8 ? ` (+${shorten(this.dimension.rateOfChange)}%/s)` : String.empty;
    },
    isAvailable: function() {
      return this.dimension.isAvailable;
    },
    isAffordable: function() {
      return this.dimension.isAffordable;
    },
    isAffordableUntil10: function() {
      return this.dimension.isAffordableUntil10;
    }
  },
  methods: {
    buySingle: function() {
      buyOneDimensionBtnClick(this.tier);
    },
    buyUntil10: function() {
      buyManyDimensionsBtnClick(this.tier);
    }
  },
  template:
    `<div class="dimension-tab-row" v-if="isAvailable">
      <div style="width: 32%; text-align: left">
        {{name}} Dimension x{{multiplier}}
      </div>
      <div style="text-align: left; flex-grow: 1">
        {{amount}} ({{stats.boughtBefore10}}) {{rateOfChange}}
      </div>
      <store-button
        fontSize="10px"
        :enabled="isAffordable"
        style="height: 25px; width: 135px; margin-right: 16px; flex-shrink: 0"
        @click="buySingle">
        Cost: {{singleCost}}
      </store-button>
      <store-button
        fontSize="10px"
        :enabled="isAffordableUntil10"
        style="height: 25px; width: 210px; flex-shrink: 0"
        @click="buyUntil10">
        Until 10, Cost: {{until10Cost}}
      </store-button>
      <div 
        class='dimension-floating-text'
        v-for="floatingText in dimension.floatingText"
        :key="floatingText.key">
        {{floatingText.text}}
      </div>
    </div>`,
});

Vue.component('normal-dimension-shift-row', {
  props: {
    player: Object,
    shift: Object
  },
  computed: {
    labelText: function() {
      const requirement = this.shift.requirement;
      const name = this.shift.isBoost ? "Boost" : "Shift";
      const dimName = DISPLAY_NAMES[requirement.tier];
      return `Dimension ${name} (${this.player.resets}): requires ${requirement.amount} ${dimName} Dimensions`;
    },
    buttonText: function() {
      return `Reset the game for a ${this.shift.isBoost ? "boost" : "new Dimension"}`;
    },
    isAvailable: function() {
      const requirement = this.shift.requirement;
      return new DimensionStats(requirement.tier, this.player).amount >= requirement.amount;
    }
  },
  methods: {
    softReset: function() {
      softResetBtnClick();
    }
  },
  template:
    `<div class="dimension-tab-row">
      <div style="width: 32%; text-align: left; flex-grow: 1">{{labelText}}</div>
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
  props: {
    player: Object,
    galaxy: Object
  },
  computed: {
    galaxySum: function() {
      let sum = this.player.galaxies.toString();
      if (this.galaxy.extra > 0) {
        sum += " + " + this.galaxy.extra;
      }
      if (this.player.dilation.freeGalaxies > 0) {
        sum += " + " + this.player.dilation.freeGalaxies;
      }
      return sum;
    },
    requirement: function() {
      const requirement = this.galaxy.requirement;
      const tier = DISPLAY_NAMES[requirement.tier];
      return `${requirement.amount} ${tier} Dimensions`;
    },
    isAvailable: function() {
      const requirement = this.galaxy.requirement;
      return new DimensionStats(requirement.tier, this.player).amount >= requirement.amount;
    }
  },
  methods: {
    secondSoftReset: function() {
      secondSoftResetBtnClick();
    }
  },
  template:
    `<div class="dimension-tab-row">
      <div style="width: 32%; text-align: left; flex-grow: 1">
        {{galaxy.type}} ({{galaxySum}}): requires {{requirement}}
      </div>
      <store-button 
        fontSize="9px"
        :enabled="isAvailable"
        @click="secondSoftReset"
        style="height: 35px; width: 200px; margin-right: 100px"> 
        Lose all your previous progress, but get a tickspeed boost
      </store-button>
    </div>`
});

Vue.component('normal-dimension-progress', {
  props: {
    progress: Object
  },
  computed: {
    percents: function() {
      return `${this.progress.fill.toFixed(2)}%`;
    },
    progressBarStyle: function() {
      return {
        width: this.percents
      };
    }
  },
  template:
    `<div id="progress">
        <div id="progressbar" :style="progressBarStyle">
            <span id="progresspercent" v-tooltip="progress.tooltip">
              {{percents}}
            </span>
          </div>
    </div>`
});