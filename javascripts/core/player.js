var gameLoopIntervalId;
var Marathon = 0;
var Marathon2 = 0;
var auto = false;
var autoS = true;
var shiftDown = false;
var controlDown = false;
var justImported = false;
var saved = 0;
var failureCount = 0;
var implosionCheck = 0;
var realizationCheck = 0;
var statsTimer = 0;
var TIER_NAMES = [null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight"];
var DISPLAY_NAMES = [null, "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"];
var player = {
  money: new Decimal(10),
  tickSpeedCost: new Decimal(1000),
  tickspeed: new Decimal(1000),
  firstCost: new Decimal(10),
  secondCost: new Decimal(100),
  thirdCost: new Decimal(10000),
  fourthCost: new Decimal(1000000),
  fifthCost: new Decimal(1e9),
  sixthCost: new Decimal(1e13),
  seventhCost: new Decimal(1e18),
  eightCost: new Decimal(1e24),
  firstAmount: new Decimal(0),
  secondAmount: new Decimal(0),
  thirdAmount: new Decimal(0),
  fourthAmount: new Decimal(0),
  firstBought: 0,
  secondBought: 0,
  thirdBought: 0,
  fourthBought: 0,
  fifthAmount: new Decimal(0),
  sixthAmount: new Decimal(0),
  seventhAmount: new Decimal(0),
  eightAmount: new Decimal(0),
  fifthBought: 0,
  sixthBought: 0,
  seventhBought: 0,
  eightBought: 0,
  firstPow: new Decimal(1),
  secondPow: new Decimal(1),
  thirdPow: new Decimal(1),
  fourthPow: new Decimal(1),
  fifthPow: new Decimal(1),
  sixthPow: new Decimal(1),
  seventhPow: new Decimal(1),
  eightPow: new Decimal(1),
  sacrificed: new Decimal(0),
  achievements: [],
  infinityUpgrades: [],
  challenges: [],
  currentChallenge: "",
  infinityPoints: new Decimal(0),
  infinitied: 0,
  infinitiedBank: 0,
  totalTimePlayed: 0,
  realTimePlayed: 0,
  bestInfinityTime: 999999999999,
  thisInfinityTime: 0,
  resets: 0,
  galaxies: 0,
  tickDecrease: 0.9,
  totalmoney: new Decimal(0),
  achPow: 1,
  newsArray: [],
  // TODO: Not used, remove
  interval: null,
  lastUpdate: new Date().getTime(),
  autobuyers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  costMultipliers: [new Decimal(1e3), new Decimal(1e4), new Decimal(1e5), new Decimal(1e6), new Decimal(1e8), new Decimal(1e10), new Decimal(1e12), new Decimal(1e15)],
  tickspeedMultiplier: new Decimal(10),
  chall2Pow: 1,
  chall3Pow: new Decimal(0.01),
  matter: new Decimal(0),
  chall11Pow: new Decimal(1),
  partInfinityPoint: 0,
  partInfinitied: 0,
  break: false,
  challengeTimes: [60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31],
  infchallengeTimes: [60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31, 60000 * 60 * 24 * 31],
  lastTenRuns: [[60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1]],
  lastTenEternities: [[60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1], [60000 * 60 * 24 * 31, 1]],
  lastTenRealities: [[60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0], [60000 * 60 * 24 * 31, 1, 0]],
  infMult: new Decimal(1),
  infMultCost: new Decimal(10),
  tickSpeedMultDecrease: 10,
  tickSpeedMultDecreaseCost: 3e6,
  dimensionMultDecrease: 10,
  dimensionMultDecreaseCost: 1e8,
  overXGalaxies: 10,
  version: 10,
  infDimensionsUnlocked: [false, false, false, false, false, false, false, false],
  infinityPower: new Decimal(1),
  spreadingCancer: 0,
  postChallUnlocked: 0,
  postC4Tier: 0,
  postC3Reward: new Decimal(1),
  eternityPoints: new Decimal(0),
  eternities: 0,
  thisEternity: 0,
  bestEternity: 999999999999,
  eternityUpgrades: [],
  epmult: new Decimal(1),
  epmultCost: new Decimal(500),
  infinityDimension1: {
    cost: new Decimal(1e8),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension2: {
    cost: new Decimal(1e9),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension3: {
    cost: new Decimal(1e10),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension4: {
    cost: new Decimal(1e20),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension5: {
    cost: new Decimal(1e140),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension6: {
    cost: new Decimal(1e200),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension7: {
    cost: new Decimal(1e250),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infinityDimension8: {
    cost: new Decimal(1e280),
    amount: new Decimal(0),
    bought: 0,
    power: new Decimal(1),
    baseAmount: 0
  },
  infDimBuyers: [false, false, false, false, false, false, false, false],
  timeShards: new Decimal(0),
  tickThreshold: new Decimal(1),
  totalTickGained: 0,
  timeDimension1: {
    cost: new Decimal(1),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension2: {
    cost: new Decimal(5),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension3: {
    cost: new Decimal(100),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension4: {
    cost: new Decimal(1000),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension5: {
    cost: new Decimal("1e2350"),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension6: {
    cost: new Decimal("1e2650"),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension7: {
    cost: new Decimal("1e3000"),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  timeDimension8: {
    cost: new Decimal("1e3350"),
    amount: new Decimal(0),
    power: new Decimal(1),
    bought: 0
  },
  offlineProd: 0,
  offlineProdCost: 1e7,
  challengeTarget: 0,
  autoSacrifice: 1,
  replicanti: {
    amount: new Decimal(0),
    unl: false,
    chance: 0.01,
    chanceCost: new Decimal(1e150),
    interval: 1000,
    intervalCost: new Decimal(1e140),
    gal: 0,
    galaxies: 0,
    galCost: new Decimal(1e170),
    auto: [false, false, false]
  },
  timestudy: {
    theorem: 0,
    amcost: new Decimal("1e20000"),
    ipcost: new Decimal(1),
    epcost: new Decimal(1),
    studies: [],
    shopMinimized: false
  },
  eternityChalls: {},
  eternityChallGoal: new Decimal(Number.MAX_VALUE),
  currentEternityChall: "",
  eternityChallUnlocked: 0,
  etercreq: 0,
  autoIP: new Decimal(0),
  autoTime: 1e300,
  infMultBuyer: false,
  autoCrunchMode: "amount",
  autoEternityMode: "amount",
  autoRealityMode: "amount",
  respec: false,
  eternityBuyer: {
    limit: new Decimal(0),
    isOn: false
  },
  eterc8ids: 50,
  eterc8repl: 40,
  dimlife: true,
  dead: true,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: new Decimal(0),
    dilatedTime: new Decimal(0),
    totalTachyonParticles: new Decimal(0),
    nextThreshold: new Decimal(1000),
    freeGalaxies: 0,
    upgrades: [],
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
    }
  },
  why: 0,
  realities: 0,
  thisReality: 0,
  bestReality: 999999999999,
  realityBuyer: {
    rm: new Decimal(0),
    glyph: 0,
    isOn: false
  },
  reality: {
    realityMachines: new Decimal(0),
    glyphs: {
      active: [],
      inventory: [],
      slots: 3,
      last: "",
      sac: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0
      },
    },
    seed: Math.floor(Date.now() * Math.random() + 1),
    rebuyables: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    upg: [],
    upgReqs: [null, true, true, true, true, true, 
              false, false, false, false, false, 
              false, false, false, false, false, 
              false, false, false, false, false, 
              false, false, false, false, false, 
              false, false, false, false, false],
    upgReqChecks: [false],
    automatorRows: 0,
    automatorCommands: [],
    perks: [],
    respec: false,
    tdbuyers: [false, false, false, false, false, false, false, false],
    epmultbuyer: false,
    pp: 0
  },
  wormhole: [{
    speed: 60 * 60, // Seconds to fill
    power: 180, // Multiplier from the wormhole
    duration: 10, // How long it lasts.
    phase: 0,
    active: false,
    unlocked: false,
  },
  {
    speed: 60 * 6,
    power: 90, 
    duration: 7, 
    phase: 0,
    active: false,
    unlocked: false,
  },
  {
    speed: 6 * 6,
    power: 45, 
    duration: 4, 
    phase: 0,
    active: false,
    unlocked: false,
  }],
  wormholePause: false,
  ttbuyer: false,
  options: {
    newsHidden: false,
    notation: "Mixed scientific",
    noSacrificeConfirmation: false,
    retryChallenge: false,
    bulkOn: true,
    cloud: true,
    hotkeys: true,
    theme: undefined,
    secretThemeKey: 0,
    commas: true,
    updateRate: 50,
    chart: {
      updateRate: 1000,
      duration: 10,
      warning: 0,
    },
    animations: {
      floatingText: true,
      bigCrunch: true,
      eternity: true,
      tachyonParticles: true,
    }
  }

};

function getPlayerGlobal(){
  return player;
}

class DimensionStats {
  constructor(tier, player) {
    if (!player) {
      player = getPlayerGlobal();
    }
    const tierProps = DimensionStats.tierProps;
    let props = tierProps[tier];
    if (props === undefined) {
      const name = TIER_NAMES[tier];
      props = {
        cost: name + "Cost",
        amount: name + "Amount",
        bought: name + "Bought",
        pow: name + "Pow",
      };
      tierProps[tier] = props;
    }
    this._props = props;
    this._player = player;
  }

  get cost() { return this._player[this._props.cost]; }
  set cost(value) { this._player[this._props.cost] = value; }

  get amount() { return this._player[this._props.amount]; }
  set amount(value) { this._player[this._props.amount] = value; }

  get bought() { return this._player[this._props.bought]; }
  set bought(value) { this._player[this._props.bought] = value; }

  get boughtBefore10() { return this.bought % 10; }

  get remainingUntil10() { return 10 - this.boughtBefore10; }

  get costUntil10() { return this.cost.times(this.remainingUntil10); }

  get pow() { return this._player[this._props.pow]; }
  set pow(value) { this._player[this._props.pow] = value; }
}

DimensionStats.tierProps = [];