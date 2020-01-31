"use strict";

const NormalTimeStudies = {};

NormalTimeStudies.pathList = [
  { path: TIME_STUDY_PATH.NORMAL_DIM, studies: [71, 81, 91, 101] },
  { path: TIME_STUDY_PATH.INFINITY_DIM, studies: [72, 82, 92, 102] },
  { path: TIME_STUDY_PATH.TIME_DIM, studies: [73, 83, 93, 103] },
  { path: TIME_STUDY_PATH.ACTIVE, studies: [121, 131, 141] },
  { path: TIME_STUDY_PATH.PASSIVE, studies: [122, 132, 142] },
  { path: TIME_STUDY_PATH.IDLE, studies: [123, 133, 143] },
  { path: TIME_STUDY_PATH.LIGHT, studies: [221, 223, 225, 227, 231, 233] },
  { path: TIME_STUDY_PATH.DARK, studies: [222, 224, 226, 228, 232, 234] }
];

NormalTimeStudies.paths = NormalTimeStudies.pathList.mapToObject(e => e.path, e => e.studies);

const TimeTheorems = {
  costMultipliers: {
    AM: new Decimal("1e20000"),
    IP: new Decimal(1e100),
    EP: 2,
  },

  checkForBuying(auto) {
    if (player.realities === 0 && TimeDimension(1).bought < 1) {
      if (!auto) Modal.message.show("You need to buy at least 1 Time Dimension before you can purchase Time Theorems.");
      return false;
    }
    if (player.eternities.lt(1)) {
      if (!auto) Modal.message.show("You need to eternity at least once before you can purchase Time Theorems.");
      return false;
    }
    return true;
  },

  buyWithAntimatter(auto = false) {
    if (!this.checkForBuying(auto)) return false;
    if (player.antimatter.lt(player.timestudy.amcost)) return false;
    player.antimatter = player.antimatter.minus(player.timestudy.amcost);
    player.timestudy.amcost = player.timestudy.amcost.times(TimeTheorems.costMultipliers.AM);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    player.noTheoremPurchases = false;
    return true;
  },

  buyWithIP(auto = false) {
    if (!this.checkForBuying(auto)) return false;
    if (player.infinityPoints.lt(player.timestudy.ipcost)) return false;
    player.infinityPoints = player.infinityPoints.minus(player.timestudy.ipcost);
    player.timestudy.ipcost = player.timestudy.ipcost.times(TimeTheorems.costMultipliers.IP);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    player.noTheoremPurchases = false;
    return true;
  },

  buyWithEP(auto = false) {
    if (!this.checkForBuying(auto)) return false;
    if (player.eternityPoints.lt(player.timestudy.epcost)) return false;
    player.eternityPoints = player.eternityPoints.minus(player.timestudy.epcost);
    player.timestudy.epcost = player.timestudy.epcost.times(TimeTheorems.costMultipliers.EP);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    player.noTheoremPurchases = false;
    return true;
  },

  buyMax(auto = false) {
    if (!this.checkForBuying(auto)) return;
    const AMowned = player.timestudy.amcost.e / 20000 - 1;
    if (player.antimatter.gte(player.timestudy.amcost)) {
      player.timestudy.amcost.e = Math.floor(player.antimatter.e / 20000 + 1) * 20000;
      player.timestudy.theorem = player.timestudy.theorem.plus(Math.floor(player.antimatter.e / 20000) - AMowned);
      player.antimatter =
        player.antimatter.minus(Decimal.fromMantissaExponent(1, Math.floor(player.antimatter.e / 20000) * 20000));
      player.noTheoremPurchases = false;
    }
    const IPowned = player.timestudy.ipcost.e / 100;
    if (player.infinityPoints.gte(player.timestudy.ipcost)) {
      player.timestudy.ipcost.e = Math.floor(player.infinityPoints.e / 100 + 1) * 100;
      player.timestudy.theorem = player.timestudy.theorem.plus(Math.floor(player.infinityPoints.e / 100 + 1) - IPowned);
      player.infinityPoints =
        player.infinityPoints.minus(Decimal.fromMantissaExponent(1, Math.floor(player.infinityPoints.e / 100) * 100));
      player.noTheoremPurchases = false;
    }
    if (player.eternityPoints.gte(player.timestudy.epcost)) {
      const EPowned = Math.round(player.timestudy.epcost.log2());
      const finalEPCost = new Decimal(2).pow(Math.floor(player.eternityPoints.log2()));
      const totalEPCost = finalEPCost.minus(player.timestudy.epcost);
      player.timestudy.epcost = finalEPCost;
      player.eternityPoints = player.eternityPoints.minus(totalEPCost);
      player.timestudy.theorem = player.timestudy.theorem.plus(Math.round(player.timestudy.epcost.log2()) - EPowned);
      player.noTheoremPurchases = false;
      // The above code block will sometimes buy one too few TT, but it never over-buys
      TimeTheorems.buyWithEP();
    }
  },

  totalPurchased() {
    return player.timestudy.amcost.e / 20000 - 1 +
      player.timestudy.ipcost.e / 100 +
      Math.round(player.timestudy.epcost.log2());
  }
};

function autoBuyMaxTheorems(realDiff) {
  if (!player.ttbuyer) return;
  player.auto.ttTimer += realDiff;
  const period = Effects.min(
    Number.POSITIVE_INFINITY,
    Perk.autobuyerTT1,
    Perk.autobuyerTT2,
    Perk.autobuyerTT3,
    Perk.autobuyerTT4
  );
  const milliseconds = TimeSpan.fromSeconds(period).totalMilliseconds;
  if (player.auto.ttTimer > milliseconds) {
    TimeTheorems.buyMax(true);
    player.auto.ttTimer = Math.min(player.auto.ttTimer - milliseconds, milliseconds);
  }
}

function calculateTimeStudiesCost() {
  let totalCost = TimeStudy.boughtNormalTS()
    .map(ts => ts.cost)
    .reduce(Number.sumReducer, 0);
  const ecStudy = TimeStudy.eternityChallenge.current();
  if (ecStudy !== undefined) {
    totalCost += ecStudy.cost;
  }
  return totalCost;
}

function calculateDilationStudiesCost() {
  return TimeStudy.boughtDilationTS()
    .map(ts => ts.cost)
    .reduce(Number.sumReducer, 0);
}

function unlockDilation(quiet) {
  if (!quiet) {
    Tab.eternity.dilation.show();
  }
  if (Perk.autounlockDilation1.isBought) {
    for (const id of [4, 5, 6]) player.dilation.upgrades.add(id);
  }
  if (Perk.autounlockDilation2.isBought) {
    for (const id of [7, 8, 9]) player.dilation.upgrades.add(id);
  }
  player.dilation.tachyonParticles = player.dilation.tachyonParticles.plusEffectOf(Perk.startTP);
}

function hasRow(row) {
  for (let i = 1; i < 10; ++i) {
    const study = TimeStudy(row * 10 + i);
    if (!study) break;
    if (study.isBought) return true;
  }
  return false;
}

function canBuyStudy(id) {
  const study = TimeStudy(id);
  return study ? study.checkRequirement() : false;
}

function canBuyLocked(id) {
  return V.availableST >= TimeStudy(id).STCost &&
         TimeStudy(id) &&
         TimeStudy(id).checkVRequirement();
}

function getSelectedDimensionStudyPaths() {
  const paths = [];
  if (TimeStudy(71).isBought) paths.push(TIME_STUDY_PATH.NORMAL_DIM);
  if (TimeStudy(72).isBought) paths.push(TIME_STUDY_PATH.INFINITY_DIM);
  if (TimeStudy(73).isBought) paths.push(TIME_STUDY_PATH.TIME_DIM);
  return paths;
}

function getSelectedPacePaths() {
  const paths = [];
  if (TimeStudy(121).isBought) paths.push(TIME_STUDY_PATH.ACTIVE);
  if (TimeStudy(122).isBought) paths.push(TIME_STUDY_PATH.PASSIVE);
  if (TimeStudy(123).isBought) paths.push(TIME_STUDY_PATH.IDLE);
  return paths;
}

function buyTimeStudyRange(first, last) {
  for (let id = first; id <= last; ++id) {
    const study = TimeStudy(id);
    if (study) study.purchase();
  }
}

function buyTimeStudyListUntilID(list, maxId) {
  for (const i of list) {
    if (i <= maxId) TimeStudy(i).purchase();
  }
}

// eslint-disable-next-line complexity
function studiesUntil(id) {
  const row = Math.floor(id / 10);
  const col = id % 10;
  const lastInPrevRow = row * 10 - 1;
  const study = TimeStudy(id);
  // This process is greedy (starts buying studies from the top). However, if the
  // player shift clicks a study that is immeidately buyable, we try to buy it first --
  // in case buying studies up to that point renders it unaffordable.
  study.purchase();
  const requestedPath = study.path;
  buyTimeStudyRange(11, Math.min(lastInPrevRow, 70));
  study.purchase();
  if (id < 71) return;
  const dimPaths = getSelectedDimensionStudyPaths();
  // If we have already selected as many dimension paths as available, we can brute
  // force our way through buying them; any locked paths will fail to purchase.
  if (DilationUpgrade.timeStudySplit.isBought ||
    (dimPaths.length === 2 && TimeStudy(201).isBought) ||
    (dimPaths.length === 1 && !TimeStudy(201).isBought)) {
    buyTimeStudyRange(71, Math.min(id, 120));
  } else if (id > 103) {
    // If we haven't chosen dimension paths, and shift clicked something below
    // them, we don't buy anything until the player makes their selection
    return;
  } else {
    // We buy the requested path first
    buyTimeStudyListUntilID(NormalTimeStudies.paths[requestedPath], id);
    // If we have TS201 and previously had a different path than we just bought,
    // we can buy things in that path as well:
    if (dimPaths.length > 0 && dimPaths[0] !== requestedPath) {
      buyTimeStudyListUntilID(NormalTimeStudies.paths[dimPaths[0]], lastInPrevRow);
    }
    return;
  }
  if (id >= 111) TimeStudy(111).purchase();
  if (id < 121) return;
  // If we clicked on a active/idle/passive path, purchase things on that path
  // before doing anything else
  if (id <= 143) {
    buyTimeStudyListUntilID(NormalTimeStudies.paths[requestedPath], id);
  }
  // If we've maxed out V rewards, we can brute force buy studies. Otherwise,
  // we don't assume we know which locked studies the player wants, if any.
  /* TODO: modify this block to work with the flipped achievements as well
  if (V.totalAdditionalStudies >= 12) {
    buyTimeStudyRange(121, Math.min(lastInPrevRow, 214));
  }
  */
  const pacePaths = getSelectedPacePaths();
  // If we don't have a middle path chosen at this point, we either can't decide
  // or can't afford any more studies
  if (pacePaths.length === 0) return;
  // If we have V, and have started on more than one pace path, but haven't finished
  // it, we don't know how to proceed. If only one path is selected, we'll assume that
  // it's the path the player wants
  if (pacePaths.length > 1) {
    if (!TimeStudy(141).isBought && !TimeStudy(142).isBought && !TimeStudy(143).isBought) return;
  } else {
    // Buy as much of the rest of the selected middle path as we need
    buyTimeStudyListUntilID(NormalTimeStudies.paths[pacePaths[0]], id);
  }
  buyTimeStudyRange(151, Math.min(lastInPrevRow, 214));
  // If the user clicked on a study in rows 19-22, we've tried to buy up to the previous
  // row. Try to buy that study now:
  study.purchase();
  if (id < 230) return;
  // If the user clicked on a study in row 23, then either a) the above purchase call bought it (in
  // which case, they must have had one of the prerequisites) or b) it didn't, but the user has V
  // rewards so will be able to buy both prerequisites or c) they can't buy it
  // We only buy both if the player has maxed out V.
  /* TODO: modify this block to work with the flipped achievements as well
  if (V.totalAdditionalStudies >= 12) {
    TimeStudy(220 + col * 2 - 1).purchase();
    TimeStudy(220 + col * 2).purchase();
    // Try to buy the rest of the row 22 studies
    for (let i = 221; i <= 228; ++i) TimeStudy(i).purchase();
    study.purchase();
  }
  */
}

function respecTimeStudies(auto) {
  for (const study of TimeStudy.boughtNormalTS()) {
    study.refund();
  }
  if (player.timestudy.studies.length === 0) {
    SecretAchievement(34).unlock();
  }
  player.timestudy.studies = [];
  GameCache.timeStudies.invalidate();
  player.celestials.v.STSpent = 0;
  player.celestials.v.triadStudies = [];
  const ecStudy = TimeStudy.eternityChallenge.current();
  if (ecStudy !== undefined) {
    ecStudy.refund();
    player.challenge.eternity.unlocked = 0;
  }
  if (!auto) {
    Tab.eternity.studies.show();
  }
}

function studyTreeExportString() {
  return `${player.timestudy.studies}|${player.challenge.eternity.unlocked}`;
}

function exportStudyTree() {
  copyToClipboardAndNotify(studyTreeExportString());
}

function importStudyTree(input, auto) {
  const splitOnEC = input.split("|");
  splitOnEC[0].split(",")
    .map(id => parseInt(id, 10))
    .filter(id => !isNaN(id))
    .map(TimeStudy)
    .filter(study => study !== undefined)
    .forEach(study => study.purchase());

  if (splitOnEC.length === 2) {
    const ecNumber = parseInt(splitOnEC[1], 10);
    if (ecNumber !== 0 && !isNaN(ecNumber)) {
      TimeStudy.eternityChallenge(ecNumber).purchase(auto);
    }
  }
}

const TimeStudyType = {
  NORMAL: 0,
  ETERNITY_CHALLENGE: 1,
  DILATION: 2,
  TRIAD: 3
};

class TimeStudyState extends GameMechanicState {
  constructor(config, type) {
    super(config);
    this.type = type;
    /**
     * @type {TimeStudyConnection[]}
     */
    this.incomingConnections = [];
  }

  get cost() {
    return this.config.cost;
  }

  get STCost() {
    const base = this.config.STCost;
    return V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[4])
      ? base - 2
      : base;
  }

  refund() {
    player.timestudy.theorem = player.timestudy.theorem.plus(this.cost);
  }

  get isAffordable() {
    return player.timestudy.theorem.gte(this.cost);
  }

  get canBeBought() {
    return true;
  }
}

class NormalTimeStudyState extends TimeStudyState {
  constructor(config) {
    super(config, TimeStudyType.NORMAL);
    const path = NormalTimeStudies.pathList.find(p => p.studies.includes(this.id));
    this._path = path === undefined ? TIME_STUDY_PATH.NONE : path.path;
  }

  get isBought() {
    return GameCache.timeStudies.value[this.id];
  }

  checkRequirement() {
    const req = this.config.requirement;
    return typeof req === "number" ? TimeStudy(req).isBought : req();
  }

  checkVRequirement() {
    const req = this.config.requirementV;
    return req === undefined ? false : req();
  }

  get canBeBought() {
    return canBuyStudy(this.id) || canBuyLocked(this.id);
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (this.isBought || !this.isAffordable) return false;
    if (!canBuyStudy(this.id)) {
      if (!canBuyLocked(this.id)) return false;
      player.celestials.v.STSpent += this.STCost;
      player.timestudy.studies.push(this.id);
      GameCache.timeStudies.invalidate();
      return true;
    }
    player.timestudy.studies.push(this.id);
    player.timestudy.theorem = player.timestudy.theorem.minus(this.cost);
    GameCache.timeStudies.invalidate();
    return true;
  }

  purchaseUntil() {
    studiesUntil(this.id);
  }

  get path() {
    return this._path;
  }
}

NormalTimeStudyState.studies = mapGameData(
  GameDatabase.eternity.timeStudies.normal,
  config => new NormalTimeStudyState(config)
);

NormalTimeStudyState.all = NormalTimeStudyState.studies.filter(e => e !== undefined);

/**
 * @returns {NormalTimeStudyState}
 */
function TimeStudy(id) {
  return NormalTimeStudyState.studies[id];
}

/**
 * @returns {NormalTimeStudyState[]}
 */
TimeStudy.boughtNormalTS = function() {
  return player.timestudy.studies.map(id => TimeStudy(id));
};

class ECTimeStudyState extends TimeStudyState {
  constructor(config) {
    super(config, TimeStudyType.ETERNITY_CHALLENGE);
  }

  get isBought() {
    return player.challenge.eternity.unlocked === this.id;
  }

  purchase(auto) {
    if (!this.canBeBought) return false;
    if (player.challenge.eternity.unlocked === 0) {
      player.challenge.eternity.unlocked = this.id;
      if (!auto) {
        Tab.challenges.eternity.show();
      }
      if (this.id !== 11 && this.id !== 12) player.etercreq = this.id;
    }
    player.timestudy.theorem = player.timestudy.theorem.minus(this.cost);
    return true;
  }

  purchaseUntil() {
    const studiesToBuy = [
      undefined,
      171, 171, 171,
      143, 42, 121,
      111, 123, 151,
      181, 212, 214
    ];
    studiesUntil(studiesToBuy[this.id]);
    // For EC 11 and 12, we can't choose between light and dark, but we can buy the
    // pair of row 21 things
    if (this.id === 11) {
      TimeStudy(211).purchase();
    } else if (this.id === 12) {
      TimeStudy(213).purchase();
    }
    this.purchase();
  }

  get canBeBought() {
    if (!this.isAffordable) {
      return false;
    }
    if (player.challenge.eternity.unlocked !== 0) {
      return false;
    }
    const isConnectionSatisfied = this.incomingConnections
      .some(connection => connection.isSatisfied);
    if (!isConnectionSatisfied) {
      return false;
    }
    if (player.etercreq === this.id && this.id !== 11 && this.id !== 12) {
      return true;
    }
    if (!Perk.studyECRequirement.isBought) {
      return this.isSecondaryRequirementMet;
    }
    return true;
  }

  /**
   * @returns {EternityChallengeState}
   */
  get challenge() {
    return EternityChallenge(this.id);
  }

  get requirementTotal() {
    return this.config.requirement.required(this.challenge.completions);
  }

  get requirementCurrent() {
    return this.config.requirement.current();
  }

  get isSecondaryRequirementMet() {
    if (this.id === 11) {
      return !TimeStudy(72).isBought && !TimeStudy(73).isBought;
    }
    if (this.id === 12) {
      return !TimeStudy(71).isBought && !TimeStudy(72).isBought;
    }
    const current = this.requirementCurrent;
    const total = this.requirementTotal;
    return typeof current === "number" ? current >= total : current.gte(total);
  }
}

ECTimeStudyState.studies = mapGameData(
  GameDatabase.eternity.timeStudies.ec,
  config => new ECTimeStudyState(config)
);

/**
 * @param {number} id
 * @returns {ECTimeStudyState}
 */
TimeStudy.eternityChallenge = function(id) {
  return ECTimeStudyState.studies[id];
};

/**
 * @returns {ECTimeStudyState|undefined}
 */
TimeStudy.eternityChallenge.current = function() {
  return player.challenge.eternity.unlocked
    ? TimeStudy.eternityChallenge(player.challenge.eternity.unlocked)
    : undefined;
};

class DilationTimeStudyState extends TimeStudyState {
  constructor(config) {
    super(config, TimeStudyType.DILATION);
  }

  get isBought() {
    return player.dilation.studies.includes(this.id);
  }

  get canBeBought() {
    return this.isAffordable && this.config.requirement();
  }

  get description() {
    return this.config.description;
  }

  get cost() {
    return typeof this.config.cost === "function" ? this.config.cost() : this.config.cost;
  }

  purchase(quiet = false) {
    if (this.isBought || !this.canBeBought) return false;
    if (this.id === 1) unlockDilation(quiet);
    if (this.id === 6 && !Perk.autounlockReality.isBought) {
      Tab.reality.glyphs.show();
    }
    player.dilation.studies.push(this.id);
    player.timestudy.theorem = player.timestudy.theorem.minus(this.cost);
    return true;
  }
}

DilationTimeStudyState.studies = mapGameData(
  GameDatabase.eternity.timeStudies.dilation,
  config => new DilationTimeStudyState(config)
);

/**
 * @type {DilationTimeStudyState}
 */
TimeStudy.dilation = DilationTimeStudyState.studies[1];

/**
 * @param {number} tier
 * @returns {DilationTimeStudyState}
 */
TimeStudy.timeDimension = function(tier) {
  return DilationTimeStudyState.studies[tier - 3];
};

/**
 * @type {DilationTimeStudyState}
 */
TimeStudy.reality = DilationTimeStudyState.studies[6];

TimeStudy.boughtDilationTS = function() {
  return player.dilation.studies.map(id => DilationTimeStudyState.studies[id]);
};


class TimeStudyConnection {
  constructor(from, to, override) {
    this._from = from;
    this._to = to;
    this._override = override;
  }

  get from() {
    return this._from;
  }

  get to() {
    return this._to;
  }

  get isOverridden() {
    return this._override !== undefined && this._override();
  }

  get isSatisfied() {
    return this.isOverridden || this._from.isBought;
  }
}


class TriadStudyState extends TimeStudyState {
  constructor(config) {
    super(config, TimeStudyType.TRIAD);
  }

  get canBeBought() {
    return this.config.requirement.every(s => player.timestudy.studies.includes(s)) &&
           V.availableST >= this.STCost &&
           !this.isBought;
  }

  get isBought() {
    return player.celestials.v.triadStudies.includes(this.config.id);
  }

  get description() {
    return this.config.description;
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (!this.canBeBought) return;
    player.celestials.v.triadStudies.push(this.config.id);
    player.celestials.v.STSpent += this.STCost;
  }
}

TriadStudyState.studies = mapGameData(
  GameDatabase.celestials.v.triadStudies,
  config => new TriadStudyState(config)
);

function TriadStudy(id) {
  return TriadStudyState.studies[id];
}

/**
 * @type {TimeStudyConnection[]}
 */
TimeStudy.allConnections = (function() {
  const TS = id => TimeStudy(id);
  const EC = id => TimeStudy.eternityChallenge(id);
  const connections = [
    [TS(11), TS(21)],
    [TS(11), TS(22)],

    [TS(21), TS(31)],
    [TS(21), TS(33)],
    [TS(22), TS(32)],

    [TS(31), TS(41)],
    [TS(32), TS(42)],

    [TS(41), TS(51)],
    [TS(42), TS(51)],
    [TS(42), EC(5)],

    [TS(42), TS(62), () => !Perk.bypassEC5Lock.isBought],

    [TS(51), TS(61)],
    [EC(5), TS(62), () => Perk.bypassEC5Lock.isBought],

    [TS(61), TS(71)],
    [TS(61), TS(72)],
    [TS(61), TS(73)],

    [TS(71), TS(81)],
    [TS(72), TS(82)],
    [TS(73), TS(83)],

    [TS(81), TS(91)],
    [TS(82), TS(92)],
    [TS(83), TS(93)],

    [TS(91), TS(101)],
    [TS(92), TS(102)],
    [TS(93), TS(103)],

    [TS(101), TS(111)],
    [TS(102), TS(111)],
    [TS(103), TS(111)],

    [TS(111), EC(7)],

    [TS(111), TS(121)],
    [TS(111), TS(122)],
    [TS(111), TS(123)],

    [TS(121), TS(131)],
    [TS(122), TS(132)],
    [TS(123), TS(133)],
    [TS(121), EC(6)],
    [TS(123), EC(8)],

    [TS(131), TS(141)],
    [TS(132), TS(142)],
    [TS(133), TS(143)],

    [TS(141), TS(151)],
    [TS(142), TS(151)],
    [TS(143), TS(151)],
    [TS(143), EC(4)],

    [TS(151), EC(9)],

    [TS(151), TS(161)],
    [TS(151), TS(162)],

    [TS(161), TS(171)],
    [TS(162), TS(171)],

    [TS(171), EC(1)],
    [TS(171), EC(2)],
    [TS(171), EC(3)],

    [TS(171), TS(181), () => !Perk.bypassEC1Lock.isBought || !Perk.bypassEC2Lock.isBought || !Perk.bypassEC3Lock.isBought],

    [EC(1), TS(181), () => Perk.bypassEC1Lock.isBought],
    [EC(2), TS(181), () => Perk.bypassEC2Lock.isBought],
    [EC(3), TS(181), () => Perk.bypassEC3Lock.isBought],

    [TS(181), EC(10)],

    [EC(10), TS(191)],
    [EC(10), TS(192)],
    [EC(10), TS(193)],

    [TS(192), TS(201)],

    [TS(191), TS(211)],
    [TS(191), TS(212)],
    [TS(193), TS(213)],
    [TS(193), TS(214)],

    [TS(211), TS(221)],
    [TS(211), TS(222)],
    [TS(212), TS(223)],
    [TS(212), TS(224)],
    [TS(213), TS(225)],
    [TS(213), TS(226)],
    [TS(214), TS(227)],
    [TS(214), TS(228)],

    [TS(221), TS(231)],
    [TS(222), TS(231)],
    [TS(223), TS(232)],
    [TS(224), TS(232)],
    [TS(225), TS(233)],
    [TS(226), TS(233)],
    [TS(227), TS(234)],
    [TS(228), TS(234)],

    [TS(231), EC(11)],
    [TS(232), EC(11)],
    [TS(233), EC(12)],
    [TS(234), EC(12)],

    [EC(11), TimeStudy.dilation],
    [EC(12), TimeStudy.dilation],

    [TimeStudy.dilation, TimeStudy.timeDimension(5)],
    [TimeStudy.timeDimension(5), TimeStudy.timeDimension(6)],
    [TimeStudy.timeDimension(6), TimeStudy.timeDimension(7)],
    [TimeStudy.timeDimension(7), TimeStudy.timeDimension(8)],
    [TimeStudy.timeDimension(8), TimeStudy.reality]
  ].map(props => new TimeStudyConnection(props[0], props[1], props[2]));

  for (const connection of connections) {
    connection.to.incomingConnections.push(connection);
  }
  return connections;
}());
