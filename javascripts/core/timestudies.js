// Time studies
const TimeTheorems = {
  costMultipliers: {
    AM: new Decimal("1e20000"),
    IP: new Decimal(1e100),
    EP: 2,
  },

  buyWithAntimatter() {
    if (player.money.lt(player.timestudy.amcost)) return false;
    player.money = player.money.minus(player.timestudy.amcost);
    player.timestudy.amcost = player.timestudy.amcost.times(TimeTheorems.costMultipliers.AM);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    return true;
  },

  buyWithIP() {
    if (player.infinityPoints.lt(player.timestudy.ipcost)) return false;
    player.infinityPoints = player.infinityPoints.minus(player.timestudy.ipcost);
    player.timestudy.ipcost = player.timestudy.ipcost.times(TimeTheorems.costMultipliers.IP);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    return true;
  },

  buyWithEP() {
    if (player.timeDimension1.bought < 1 && player.realities === 0) {
      alert("You need to buy at least 1 Time Dimension before you can purchase theorems with Eternity points.");
      return false;
    }
    if (player.eternityPoints.lt(player.timestudy.epcost)) return false;
    player.eternityPoints = player.eternityPoints.minus(player.timestudy.epcost);
    player.timestudy.epcost = player.timestudy.epcost.times(TimeTheorems.costMultipliers.EP);
    player.timestudy.theorem = player.timestudy.theorem.plus(1);
    return true;
  },

  buyMax() {
    const AMowned = player.timestudy.amcost.e / 20000 - 1;
    if (player.money.gte(player.timestudy.amcost)) {
      player.timestudy.amcost.e = Math.floor(player.money.e / 20000 + 1) * 20000;
      player.timestudy.theorem = player.timestudy.theorem.plus(Math.floor(player.money.e / 20000) - AMowned);
      player.money = player.money.minus(Decimal.fromMantissaExponent(1, Math.floor(player.money.e / 20000) * 20000));
    }
    const IPowned = player.timestudy.ipcost.e / 100;
    if (player.infinityPoints.gte(player.timestudy.ipcost)) {
      player.timestudy.ipcost.e = Math.floor(player.infinityPoints.e / 100 + 1) * 100;
      player.timestudy.theorem = player.timestudy.theorem.plus(Math.floor(player.infinityPoints.e / 100 + 1) - IPowned);
      player.infinityPoints =
        player.infinityPoints.minus(Decimal.fromMantissaExponent(1, Math.floor(player.infinityPoints.e / 100) * 100));
    }
    if (player.eternityPoints.gte(player.timestudy.epcost)) {
      const EPowned = Math.round(player.timestudy.epcost.log2());
      const finalEPCost = new Decimal(2).pow(Math.floor(player.eternityPoints.log2()));
      const totalEPCost = finalEPCost.minus(player.timestudy.epcost);
      player.timestudy.epcost = finalEPCost;
      player.eternityPoints = player.eternityPoints.minus(totalEPCost);
      player.timestudy.theorem = player.timestudy.theorem.plus(Math.round(player.timestudy.epcost.log2()) - EPowned);
      // The above code block will sometimes buy one too few TT, but it never over-buys
      TimeTheorems.buyWithEP();
    }
  },
};

function autoBuyMaxTheorems() {
  if (!player.ttbuyer) return false;
  if (Perk.autobuyerTT4.isBought ||
    (Perk.autobuyerTT3.isBought && ttMaxTimer >= 3) ||
    (Perk.autobuyerTT2.isBought && ttMaxTimer >= 5) ||
    (Perk.autobuyerTT1.isBought && ttMaxTimer >= 10)) {
    TimeTheorems.buyMax();
    return true;
  }
  return false;
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

function buyDilationStudy(name, cost, quiet) {
    if ((player.timestudy.theorem.gte(cost) || (name === 6 && player.realities > 0)) && canBuyDilationStudy(name) && !player.dilation.studies.includes(name)) {
        if (name === 1) {
            if (!quiet) {
              Tab.eternity.dilation.show();
            }
          if (Perk.autounlockDilation1.isBought) {
            for (const id of [4, 5, 6]) player.dilation.upgrades.add(id);
          }
          if (Perk.autounlockDilation2.isBought) {
            for (const id of [7, 8, 9]) player.dilation.upgrades.add(id);
          }
          if (Perk.startTP.isBought) {
            player.dilation.tachyonParticles =
              player.dilation.tachyonParticles.plus(Enslaved.isRunning ? 1 : 10);
          }
        }
        if (name === 6 && !Perk.autounlockReality.isBought) {
            showRealityTab("glyphstab");
        }
        player.dilation.studies.push(name)
        if (name !== 6) player.timestudy.theorem = player.timestudy.theorem.minus(cost)
        else if (player.realities === 0 && name === 6) player.timestudy.theorem = player.timestudy.theorem.minus(cost)
        return true
    } return false
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
  return V.canBuyLockedPath() && TimeStudy(id) && TimeStudy(id).checkRaRequirement();
}

function canBuyDilationStudy(name) {
  if (name === 1) {
    const requirementSatisfied = Perk.bypassECDilation.isBought ||
      EternityChallenge(11).isFullyCompleted &&
      EternityChallenge(12).isFullyCompleted &&
      player.timestudy.theorem.plus(calculateTimeStudiesCost()).gte(13000);
    const isAffordable = player.timestudy.theorem.gte(5000);
    const studiesAreBought = [231, 232, 233, 234].some(id => TimeStudy(id).isBought);
    return requirementSatisfied && isAffordable && studiesAreBought;
  }
  if (name === 6) {
    const isAffordable = player.timestudy.theorem.gte(5000000000) || player.realities > 0;
    return player.eternityPoints.gte("1e4000") && TimeStudy.timeDimension(8).isBought && isAffordable;
  }
  // TODO
  const config = Object.values(GameDatabase.eternity.timeStudies.dilation).find(config => config.id === name);
  return player.dilation.studies.includes(name - 1) && player.timestudy.theorem.gte(config.cost);
}

function studiesUntil(id) {
  const col = id % 10;
  const row = Math.floor(id / 10);
  let path = [0, 0];
  for (let i = 1; i < 4; i++) {
    if (player.timestudy.studies.includes(70 + i)) path[0] = i;
    if (player.timestudy.studies.includes(120 + i)) path[1] = i;
  }
  if ((row > 10 && path[0] === 0 && !DilationUpgrade.timeStudySplit.isBought) || (row > 14 && path[1] === 0)) return;
  for (let i = 1; i < row; i++) {
    let chosenPath = path[i > 11 ? 1 : 0];
    let secondPath;
    if (row > 6 && row < 11) secondPath = col;
    if ((i > 6 && i < 11) || (i > 11 && i < 15)) {
      TimeStudy(i * 10 + (chosenPath === 0 ? col : chosenPath)).purchase();
    }
    if ((i > 6 && i < 11) && player.timestudy.studies.includes(201)) {
      TimeStudy(i * 10 + secondPath).purchase();
    } else {
      for (let j = 1; j < 10; j++) {
        const study = TimeStudy(i * 10 + j);
        if (!study) break;
        study.purchase();
      }
    }
  }
  TimeStudy(id).purchase();
}

function studyPath(mode, args) {
    if (!(mode === 'none' || mode === 'all')) return false;
    if (args === undefined) args = [];
    args = args.map(function (x) { if (!isNaN(x)) return parseInt(x); else return x; });
    let row = 0;
    let master = [];
    let locks = [0, 0, 0];
    main: while (row < 24) {
        row++;
        if (mode === 'none') {
            if (row >= 2 && row <= 4) {
                for (let i = 20; i <= 40; i += 10) {
                    if (args.includes(i + 1) && !master.includes(row*10 + 1)) master.push(row*10 + 1);
                    if (args.includes(i + 2) && !master.includes(row*10 + 2)) master.push(row*10 + 2);
                }
                if (row === 3 && args.includes(33)) master.push(33);
                continue main;
            }
            if (row === 6) {
                if (args.includes(62)) master.push(61, 62);
                else master.push(61);
                continue main;
            }
            if (row === 16) {
                if (args.includes(161)) master.push(161);
                if (args.includes(162)) master.push(162);
                continue main;
            }
            if (row === 19) {
                if (args.includes(191)) master.push(191);
                if (args.includes(192) || args.includes(201)) master.push(192);
                if (args.includes(193)) master.push(193);
                continue main;
            }
            if (row === 21) {
                for (let i = 0; i < args.length; i++) {
                    if (!isNaN(args[i])) {
                        if (Math.floor(args[i] / 10) === 21 && args[i] % 10 < 5 && args[i] % 10 > 0) {
                            master.push(args[i]);
                        }
                    }

                }
                continue main;
            }
        }
        if (row >= 7 && row <= 10) {
            if (mode === 'all' && DilationUpgrade.timeStudySplit.isBought) {
                master.push(row*10 + 1, row*10 + 2, row*10 + 3);
                continue main;
            }
            if (locks[0] === 0) {
                let temp = [];
                let options = ['nd', 'id', 'td', 'normal', 'infinity', 'time'];
                for (let k = 0; k < args.length; k++) {
                    for (let i = 70; i <= 100; i += 10) {
                        for (let j = 1; j <= 3; j++) {
                            if (args[k] === i + j || args[k] === options[j - 1] || args[k] === options[j+3]) temp.push(j);
                        }
                    }
                }
                if (temp.length === 0) break main;
                locks[0] = temp[0];
                temp = temp.filter(function (x) { if (x !== locks[0]) return x;});
                if (temp.length > 0) locks[2] = temp[0];
            }
            master.push(row*10 + locks[0]);
            continue main;
        }
        if (row >= 12 && row <= 14) {
            if (locks[1] === 0) {
                let temp = [];
                let options = ['active', 'passive', 'idle'];
                for (let k = 0; k < args.length; k++) {
                    for (let i = 120; i <= 140; i += 10) {
                        for (let j = 1; j <= 3; j++) {
                            if (args[k] === i + j || args[k] === options[j - 1]) temp.push(j);
                        }
                    }
                }
                if (temp.length === 0) break main;
                locks[1] = temp[0];
            }
            master.push(row*10 + locks[1]);
            continue main;
        }
        if (row === 22 || row === 23) {
            col: for (let i = 1; i <= 8 / (row - 21); i += 2) {
                for (let j = 0; j < args.length; j++) {
                    for (let k = 0; k < 2; k++) {
                        if (args[j] === row*10 + i + k) {
                            master.push(args[j]);
                            continue col;
                        }
                    }
                }
            }
            continue main;
        }
      for (let i = 1; TimeStudy(row * 10 + i) !== undefined; i++) {
        master.push(row * 10 + i);
      }
    }
    if (locks[2] > 0) {
        master.push(70 + locks[2], 80 + locks[2], 90 + locks[2], 100 + locks[2]);
    }
    let string = master.reduce(function (acc, x) {
        return acc += x + ',';
    }, '');
    string = string.slice(0, -1);
    string += '|0';
    importStudyTree(string);
}


function respecTimeStudies() {
  for (const study of TimeStudy.boughtNormalTS()) {
    study.refund();
  }
  if (player.timestudy.studies.length === 0) {
    SecretAchievement(34).unlock();
  }
  player.timestudy.studies = [];
  GameCache.timeStudies.invalidate();
  player.celestials.v.additionalStudies = 0
  const ecStudy = TimeStudy.eternityChallenge.current();
  if (ecStudy !== undefined) {
    ecStudy.refund();
    player.challenge.eternity.unlocked = 0;
  }
  if (!justImported) {
    Tab.eternity.timeStudies.show();
  }
}

function studyTreeExportString() {
  return `${player.timestudy.studies}|${player.challenge.eternity.unlocked}`;
}

function exportStudyTree() {
  copyToClipboardAndNotify(studyTreeExportString());
}

function importStudyTree(input) {
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
      justImported = true;
      TimeStudy.eternityChallenge(ecNumber).purchase();
      setTimeout(() => {
        justImported = false;
      }, 100);
    }
  }
}

const TimeStudyType = {
  NORMAL: 0,
  ETERNITY_CHALLENGE: 1,
  DILATION: 2
};

const TimeStudyPath = {
  NONE: 0,
  NORMAL_DIM: 1,
  INFINITY_DIM: 2,
  TIME_DIM: 3,
  ACTIVE: 4,
  PASSIVE: 5,
  IDLE: 6,
  LIGHT: 7,
  DARK: 8
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

  get canBeApplied() {
    return this.isBought;
  }

  purchase() {
    if (this.isBought || !this.isAffordable) return false;
    if (!canBuyStudy(this.id)) {
      if (!canBuyLocked(this.id)) return false;
      player.celestials.v.additionalStudies++;
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
    const path = NormalTimeStudyState.paths.find(p => p.studies.includes(this.id));
    return path === undefined ? TimeStudyPath.NONE : path.path;
  }
}

NormalTimeStudyState.paths = [
  { path: TimeStudyPath.NORMAL_DIM, studies: [71, 81, 91, 101] },
  { path: TimeStudyPath.INFINITY_DIM, studies: [72, 82, 92, 102] },
  { path: TimeStudyPath.TIME_DIM, studies: [73, 83, 93, 103] },
  { path: TimeStudyPath.ACTIVE, studies: [121, 131, 141] },
  { path: TimeStudyPath.PASSIVE, studies: [122, 132, 142] },
  { path: TimeStudyPath.IDLE, studies: [123, 133, 143] },
  { path: TimeStudyPath.LIGHT, studies: [221, 223, 225, 227, 231, 233] },
  { path: TimeStudyPath.DARK, studies: [222, 224, 226, 228, 232, 234] }
];

NormalTimeStudyState.studies = mapGameData(
  GameDatabase.eternity.timeStudies.normal,
  config => new NormalTimeStudyState(config)
);

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

  purchase() {
    if (!this.canBeBought) return false;
    unlockEChall(this.id);
    player.timestudy.theorem = player.timestudy.theorem.minus(this.cost);
    return true;
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
    return canBuyDilationStudy(this.id);
  }

  get description() {
    return this.config.description;
  }

  purchase() {
    if (!this.canBeBought) return false;
    buyDilationStudy(this.id, this.cost);
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
