"use strict";

const NormalTimeStudies = {};

NormalTimeStudies.pathList = [
  { path: TIME_STUDY_PATH.ANTIMATTER_DIM, studies: [71, 81, 91, 101] },
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
    return true;
  },

  buyWithAntimatter(auto = false) {
    if (!this.checkForBuying(auto)) return false;
    if (!Currency.antimatter.purchase(player.timestudy.amcost)) return false;
    player.timestudy.amcost = player.timestudy.amcost.times(TimeTheorems.costMultipliers.AM);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    player.achievementChecks.noTheoremPurchases = false;
    return true;
  },

  buyWithIP(auto = false) {
    if (!this.checkForBuying(auto)) return false;
    if (player.infinityPoints.lt(player.timestudy.ipcost)) return false;
    player.infinityPoints = player.infinityPoints.minus(player.timestudy.ipcost);
    player.timestudy.ipcost = player.timestudy.ipcost.times(TimeTheorems.costMultipliers.IP);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    player.achievementChecks.noTheoremPurchases = false;
    return true;
  },

  buyWithEP(auto = false) {
    if (!this.checkForBuying(auto)) return false;
    if (player.eternityPoints.lt(player.timestudy.epcost)) return false;
    player.eternityPoints = player.eternityPoints.minus(player.timestudy.epcost);
    player.timestudy.epcost = player.timestudy.epcost.times(TimeTheorems.costMultipliers.EP);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    player.achievementChecks.noTheoremPurchases = false;
    return true;
  },

  buyMax(auto = false) {
    if (!this.checkForBuying(auto)) return;
    const AMowned = player.timestudy.amcost.e / 20000 - 1;
    if (Currency.antimatter.gte(player.timestudy.amcost)) {
      player.timestudy.amcost.e = Math.floor(Currency.antimatter.exponent / 20000 + 1) * 20000;
      const boughtAmount = Math.floor(Currency.antimatter.exponent / 20000) - AMowned;
      player.timestudy.theorem = player.timestudy.theorem.plus(boughtAmount);
      const amCost = Decimal.fromMantissaExponent(1, Math.floor(Currency.antimatter.exponent / 20000) * 20000);
      Currency.antimatter.subtract(amCost);
      player.achievementChecks.noTheoremPurchases = false;
    }
    const IPowned = player.timestudy.ipcost.e / 100;
    if (player.infinityPoints.gte(player.timestudy.ipcost)) {
      player.timestudy.ipcost.e = Math.floor(player.infinityPoints.e / 100 + 1) * 100;
      player.timestudy.theorem = player.timestudy.theorem.plus(Math.floor(player.infinityPoints.e / 100 + 1) - IPowned);
      player.infinityPoints =
        player.infinityPoints.minus(Decimal.fromMantissaExponent(1, Math.floor(player.infinityPoints.e / 100) * 100));
      player.achievementChecks.noTheoremPurchases = false;
    }
    if (player.eternityPoints.gte(player.timestudy.epcost)) {
      const EPowned = Math.round(player.timestudy.epcost.log2());
      const finalEPCost = new Decimal(2).pow(Math.floor(player.eternityPoints.log2()));
      const totalEPCost = finalEPCost.minus(player.timestudy.epcost);
      player.timestudy.epcost = finalEPCost;
      player.eternityPoints = player.eternityPoints.minus(totalEPCost);
      player.timestudy.theorem = player.timestudy.theorem.plus(Math.round(player.timestudy.epcost.log2()) - EPowned);
      player.achievementChecks.noTheoremPurchases = false;
      // The above code block will sometimes buy one too few TT, but it never over-buys
      TimeTheorems.buyWithEP();
    }
  },

  totalPurchased() {
    return player.timestudy.amcost.e / 20000 - 1 +
      player.timestudy.ipcost.e / 100 +
      Math.round(player.timestudy.epcost.log2());
  },

  autoBuyMaxTheorems(realDiff) {
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
  },

  calculateTimeStudiesCost() {
    let totalCost = TimeStudy.boughtNormalTS()
      .map(ts => ts.cost)
      .reduce(Number.sumReducer, 0);
    const ecStudy = TimeStudy.eternityChallenge.current();
    if (ecStudy !== undefined) {
      totalCost += ecStudy.cost;
    }
    // Secret time study
    if (Enslaved.isRunning && player.secretUnlocks.viewSecretTS) totalCost -= 100;
    return totalCost;
  }
};

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
  if (Ra.has(RA_UNLOCKS.START_TP) && !isInCelestialReality()) {
    player.dilation.tachyonParticles = getTP(RA_UNLOCKS.START_TP.effect());
  }
  TabNotification.dilationAfterUnlock.tryTrigger();
}

function getSelectedDimensionStudyPaths() {
  const paths = [];
  if (TimeStudy(71).isBought) paths.push(TIME_STUDY_PATH.ANTIMATTER_DIM);
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
  const lastInPrevRow = Math.floor(id / 10) * 10 - 1;
  const study = TimeStudy(id);
  const requestedPath = study.path;

  // If the player tries to buy a study which isimmeidately buyable, we try to buy it first
  // in case buying other studies up to that point renders it unaffordable.
  study.purchase();

  // Greddily buy all studies before the dimension split, then try again
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
  const pacePaths = getSelectedPacePaths();
  if (id < 151) {
    // This click is choosing a path
    buyTimeStudyListUntilID(NormalTimeStudies.paths[TimeStudy(id).path], id);
  }

  if (pacePaths.length === 1) {
    // We've chosen a path already
    buyTimeStudyListUntilID(NormalTimeStudies.paths[pacePaths[0]], id);
  } else if (pacePaths.length === 0) {
    // Only brute-force buying all pace studies if the player is done with V
    if (!V.isFullyCompleted) return;
    buyTimeStudyListUntilID(NormalTimeStudies.paths[TIME_STUDY_PATH.ACTIVE], id);
    buyTimeStudyListUntilID(NormalTimeStudies.paths[TIME_STUDY_PATH.PASSIVE], id);
    buyTimeStudyListUntilID(NormalTimeStudies.paths[TIME_STUDY_PATH.IDLE], id);
  } else {
    // If the player has more than one pace path, we explicitly do nothing here so that we don't potentially waste ST
    // they might be saving for lower studies. However, we keep continuing since up to row 22 the choices are obvious.
  }

  // Attempt to buy things below the pace split, up to the requested study
  if (!TimeStudy(141).isBought && !TimeStudy(142).isBought && !TimeStudy(143).isBought) return;
  buyTimeStudyRange(151, Math.min(lastInPrevRow, 214));
  study.purchase();

  // Don't bother buying any more studies beyond row 22 unless the player has fully finished V,
  // in which case just brute-force buy all of them
  if (!V.isFullyCompleted) return;
  buyTimeStudyRange(221, 234);
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
  let studyString = player.timestudy.studies.toString();
  if (player.celestials.v.triadStudies.length !== 0) {
    const triadString = player.celestials.v.triadStudies.map(id => `T${id}`);
    studyString += `,${triadString}`;
  }
  return `${studyString}|${player.challenge.eternity.unlocked}`;
}

function exportStudyTree() {
  copyToClipboard(studyTreeExportString());
  GameUI.notify.info("Exported current Time Studies to your clipboard");
}

function importStudyTree(input, auto) {
  const splitOnEC = input.split("|");
  splitOnEC[0].split(",")
    .map(TimeStudy)
    .filter(study => study !== undefined)
    .forEach(study => study.purchase());

  if (splitOnEC.length === 2) {
    const ecNumber = parseInt(splitOnEC[1], 10);
    if (ecNumber !== 0 && !TimeStudy.eternityChallenge(ecNumber).isBought && !isNaN(ecNumber)) {
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
    return V.has(V_UNLOCKS.RA_UNLOCK)
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
    return req === undefined
      ? false
      : req() && V.availableST >= this.STCost;
  }

  get canBeBought() {
    return this.checkRequirement() || this.checkVRequirement();
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (this.isBought || !this.isAffordable) return false;
    if (!this.checkRequirement()) {
      if (!this.checkVRequirement()) return false;
      player.celestials.v.STSpent += this.STCost;
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
  if (/^T[1-4]$/u.test(id)) return TriadStudy(id.slice(1));
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
    const clickTime = Date.now();

    if (this.isBought && player.challenge.eternity.current === 0 && !auto) {
      // If it is bought and you aren't in a Eternity Challenge, check
      if (clickTime - ui.lastClickTime < 750) {
        // If you last clicked on it within 3/4ths of a second, enter them in or ask confirmation if they have that on
        ui.lastClickTime = 0;
        EternityChallenge(this.id).requestStart();
      } else {
        // Otherwise, record it for the next time they click
        ui.lastClickTime = clickTime;
      }
    } else if (!this.isBought && this.canBeBought) {
      // If you haven't bought it and can buy it, reset the time of click, and
      // send you into the EC, deduct your resources, and move you to the EC tab if that isn't disabled
      ui.lastClickTime = 0;

      player.challenge.eternity.unlocked = this.id;
      if (!auto) {
        Tab.challenges.eternity.show();
      }
      if (this.id !== 11 && this.id !== 12) player.etercreq = this.id;
      player.timestudy.theorem = player.timestudy.theorem.minus(this.cost);
      return true;
    }
    return false;
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
           !this.isBought && this.config.unlocked();
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
    player.achievementChecks.noTriadStudies = false;
  }

  purchaseUntil() {
    studiesUntil(214);
    for (const id of this.config.requirement) TimeStudy(id).purchase();
    this.purchase();
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

    [TS(171), TS(181),
      () => !Perk.bypassEC1Lock.isBought || !Perk.bypassEC2Lock.isBought || !Perk.bypassEC3Lock.isBought],

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
