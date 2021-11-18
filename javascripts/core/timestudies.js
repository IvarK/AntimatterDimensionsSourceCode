import { GameMechanicState } from "./game-mechanics/index.js";

export const NormalTimeStudies = {};

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

export function unlockDilation(quiet) {
  if (!quiet) {
    Tab.eternity.dilation.show();
  }
  if (Perk.autounlockDilation1.isBought) {
    for (const id of [4, 5, 6]) player.dilation.upgrades.add(id);
  }
  if (Perk.autounlockDilation2.isBought) {
    for (const id of [7, 8, 9]) player.dilation.upgrades.add(id);
  }
  Currency.tachyonParticles.bumpTo(Perk.startTP.effectOrDefault(0));
  if (Ra.has(RA_UNLOCKS.START_TP) && !isInCelestialReality()) {
    Currency.tachyonParticles.bumpTo(getTP(RA_UNLOCKS.START_TP.effect()));
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
    if (TimeStudy.preferredPaths.dimensionPath.path.length === 0) {
      GameUI.notify.error("You haven't selected a preferred dimension path!");
      return;
    }
    // If we have a preferred path setup we should buy that one
    buyTimeStudyListUntilID(TimeStudy.preferredPaths.dimensionPath.studies, id);
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
  if (id < 151) {
    // This click is choosing a path
    buyTimeStudyListUntilID(NormalTimeStudies.paths[TimeStudy(id).path], id);
  } else if (TimeStudy.preferredPaths.pacePath.path) {
    // If we have a preferred path setup we should buy that one
    buyTimeStudyListUntilID(TimeStudy.preferredPaths.pacePath.studies, id);
  } else if (!(TimeStudy(141).isBought || TimeStudy(142).isBought || TimeStudy(143).isBought)) {
    // If we have already purchased one or more of the final pace paths, do not display the unselected error message.
    GameUI.notify.error("You haven't selected a preferred pace path!");
  }

  const pacePaths = getSelectedPacePaths();
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
  // First we buy up to 201 so we can buy the the second preferred path if needed
  if (!TimeStudy(141).isBought && !TimeStudy(142).isBought && !TimeStudy(143).isBought) return;
  buyTimeStudyRange(151, Math.min(id, 201));

  // If we have study 201 we should try and buy our second preferred path, granted we have one selected
  if (TimeStudy(201).isBought && TimeStudy.preferredPaths.dimensionPath.path.length === 2)
    buyTimeStudyListUntilID(TimeStudy.preferredPaths.dimensionPath.studies, id);

  buyTimeStudyRange(151, Math.min(id, Math.min(lastInPrevRow, 214)));
  study.purchase();

  // Don't bother buying any more studies beyond row 22 unless the player has fully finished V,
  // in which case just brute-force buy all of them
  if (!V.isFullyCompleted) return;
  buyTimeStudyRange(221, 234);
}

export function respecTimeStudies(auto) {
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

export function studyTreeExportString() {
  let studyString = player.timestudy.studies.toString();
  if (player.celestials.v.triadStudies.length !== 0) {
    const triadString = player.celestials.v.triadStudies.map(id => `T${id}`);
    studyString += `,${triadString}`;
  }
  return `${studyString}|${player.challenge.eternity.unlocked}`;
}

export function exportStudyTree() {
  copyToClipboard(studyTreeExportString());
  GameUI.notify.info("Exported current Time Studies to your clipboard");
}

export function importStudyTree(input, auto) {
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

export const TimeStudyType = {
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
    Currency.timeTheorems.add(this.cost);
  }

  get isAffordable() {
    return Currency.timeTheorems.gte(this.cost);
  }

  get canBeBought() {
    return true;
  }
}

function currPathCount() {
  return [71, 72, 73].countWhere(x => TimeStudy(x).isBought);
}

function allowedPathCount() {
  if (DilationUpgrade.timeStudySplit.isBought) return 3;
  if (TimeStudy(201).isBought) return 2;
  return 1;
}

export class NormalTimeStudyState extends TimeStudyState {
  constructor(config) {
    super(config, TimeStudyType.NORMAL);
    const path = NormalTimeStudies.pathList.find(p => p.studies.includes(this.id));
    this._path = path === undefined ? TIME_STUDY_PATH.NONE : path.path;
  }

  get isBought() {
    return GameCache.timeStudies.value[this.id];
  }

  // The requiresST prop is an array containing IDs indicating other studies which, if ANY in the array are purchased,
  // will cause the study to also cost space theorems. This array is effectively assumed to be empty if not present.
  costsST() {
    return this.config.requiresST && this.config.requiresST.some(s => TimeStudy(s).isBought);
  }

  checkRequirement() {
    const check = req => (typeof req === "number"
      ? TimeStudy(req).isBought
      : req());
    switch (this.config.reqType) {
      case TS_REQUIREMENT_TYPE.AT_LEAST_ONE:
        return this.config.requirement.some(r => check(r));
      case TS_REQUIREMENT_TYPE.ALL:
        return this.config.requirement.every(r => check(r));
      case TS_REQUIREMENT_TYPE.DIMENSION_PATH:
        return this.config.requirement.every(r => check(r)) && currPathCount() < allowedPathCount();
      default:
        throw Error(`Unrecognized TS requirement type: ${this.reqType}`);
    }
  }

  // This checks for and forbids buying studies due to being part of a set which can't normally be bought
  // together (eg. active/passive/idle and light/dark) unless the player has the requisite ST.
  checkSetRequirement() {
    return this.costsST() ? V.availableST >= this.STCost : true;
  }

  get canBeBought() {
    return this.checkRequirement() && this.checkSetRequirement();
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (this.isBought || !this.isAffordable || !this.canBeBought) return false;
    if (this.costsST()) player.celestials.v.STSpent += this.STCost;
    player.timestudy.studies.push(this.id);
    player.requirementChecks.reality.maxStudies = Math.clampMin(player.requirementChecks.reality.maxStudies,
      player.timestudy.studies.length);
    Currency.timeTheorems.subtract(this.cost);
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
 * Abstract representation of a full time study tree object. The intended usage is to supply the constructor with
 * an import string and a budget of time/space theorems, which it will use together to determine which studies can
 * actually be purchased in the specified order. All of the complex purchasing logic should be handled here, and not
 * in any TimeStudyState objects. During parsing, additional info is stored in order to improve user feedback when
 * attempting to import other study trees.
 * 
 * @member {Number} usableTT  Time theorems remaining after attempting import
 * @member {Number} usableST  Space theorems remaining after attempting import
 * @member {Number} totalTT   Total time theorem cost for importing all valid studies
 * @member {Number} totalST   Total space theorem cost for importing all valid studies
 * @member {Array: String} plannedStudies       Array of valid studies to be purchased from the initial import string;
 *  all entries are Strings because both numbers (normal TS) and T# (triads) need to be supported
 * @member {Array: String} invalidStudies       Array of studies from the initial string which are correctly formatted
 *  but don't actually exist; used for informational purposes elsewhere
 * @member {Array: String} purchasedStudies     Array of studies which were actually purchased, using the given amount
 *  of available theorems. Will always be a subset of plannedStudies
 * @member {Array: String} errors   Array of Strings indicating possible reasons the import string is invalid
 * @member {Number} ec              Numerical ID of the EC which is unlocked from the imported tree, zero if none
 */
export class TimeStudyTree {
  constructor(importString, usableTT, usableST) {
    this.usableTT = usableTT;
    this.usableST = usableST;
    this.totalTT = 0;
    this.totalST = 0;
    this.plannedStudies = [];
    this.invalidStudies = [];
    this.errors = [];
    if (TimeStudyTree.isValidImportString(importString)) {
      this.parseValidStudies(importString);
      this.parseEC(importString);
      this.attemptBuyAll();
    } else {
      this.plannedStudies = [];
      this.invalidStudies = [];
      this.ec = 0;
    }
  }

  // Note that this only checks pure formatting, not whether or not a study/EC actually exists, but verifying correct
  // formatting separately from verifying existence allows us to produce more useful in-game error messages for
  // import strings which are formatted correctly but aren't entirely valid
  static isValidImportString(input) {
    return /^(\d+|T\d+)(,(\d+|T\d+))*(\|\d+)?$/u.test(input);
  }

  // This reads off all the studies in the import string and splits them into invalid and valid study IDs. We hold on
  // to invalid studies for additional information to present to the player
  parseValidStudies(input) {
    const treeStudies = input.split("|")[0].split(",");
    const normalIDs = GameDatabase.eternity.timeStudies.normal.map(s => s.id);
    const triadIDs = GameDatabase.celestials.v.triadStudies.map(s => s.id);
    const doesStudyExist = str => (
      /^T\d+$/u.test(str)
        ? triadIDs.includes(parseInt(str.substr(1), 10))
        : normalIDs.includes(parseInt(str, 10))
    );

    let hasInvalidStudies = false;
    for (const study of treeStudies) {
      if (doesStudyExist(study)) this.plannedStudies.push(study);
      else {
        hasInvalidStudies = true;
        this.invalidStudies.push(study);
      }
    }
    if (hasInvalidStudies) this.errors.push("String has invalid study IDs.");
  }

  // Parses out the EC from the import string, pushing an error message if it doesn't exist
  parseEC(input) {
    const ecString = input.split("|")[1];
    if (!ecString) {
      // Study strings without an ending "|##" are still valid, but will result in ecString being undefined
      this.ec = 0;
      return;
    }
    const ecID = parseInt(ecString, 10);
    if (!GameDatabase.challenges.eternity.map(c => c.id).includes(ecID)) {
      this.ec = 0;
      this.errors.push(`Eternity Challenge ${ecID} does not exist.`);
      return;
    }
    this.ec = ecID;
  }

  // Attempt to purchase all studies specified in the initial import string
  attemptBuyAll() {
    const normalDB = GameDatabase.eternity.timeStudies.normal;
    const triadDB = GameDatabase.celestials.v.triadStudies;
    const getStudyEntry = str => (
      /^T\d+$/u.test(str)
        ? triadDB.find(s => s.id === parseInt(str.substr(1), 10))
        : normalDB.find(s => s.id === parseInt(str, 10))
    );

    this.purchasedStudies = [];
    for (const study of this.plannedStudies) {
      const toBuy = getStudyEntry(study);
      if (this.attemptBuySingle(toBuy)) this.purchasedStudies.push(study);
    }
  }

  // Tries to buy a single study, accounting for all various requirements and locking behavior in the game. If the
  // requirement is satisfied, then the running theorem costs will be updated (always) and the remaining usable
  // theorems will be decremented (only if there are enough left to actually purchase)
  attemptBuySingle(dbEntry) {
    const check = req => (typeof req === "number"
      ? this.purchasedStudies.includes(`${req}`)
      : req());
    let reqSatisfied;
    switch (dbEntry.reqType) {
      case TS_REQUIREMENT_TYPE.AT_LEAST_ONE:
        reqSatisfied = dbEntry.requirement.some(r => check(r));
        break;
      case TS_REQUIREMENT_TYPE.ALL:
        reqSatisfied = dbEntry.requirement.every(r => check(r));
        break;
      case TS_REQUIREMENT_TYPE.DIMENSION_PATH:
        reqSatisfied = dbEntry.requirement.every(r => check(r)) && this.currDimPathCount < this.allowedDimPathCount;
        break;
      default:
        throw Error(`Unrecognized TS requirement type: ${this.reqType}`);
    }
    if (!reqSatisfied) return false;

    const stNeeded = dbEntry.STCost && dbEntry.requiresST.some(id => this.purchasedStudies.includes(id))
      ? dbEntry.STCost
      : 0;
    this.totalTT += dbEntry.cost;
    this.totalST += stNeeded;
    if (dbEntry.cost > this.usableTT || stNeeded > this.usableST) return false;
    this.usableTT -= dbEntry.cost;
    this.usableST -= stNeeded;
    return true;
  }

  get currDimPathCount() {
    return [71, 72, 73].countWhere(x => this.purchasedStudies.includes(`${x}`));
  }

  get allowedDimPathCount() {
    if (DilationUpgrade.timeStudySplit.isBought) return 3;
    if (this.purchasedStudies.includes("201")) return 2;
    return 1;
  }
}

/**
 * @returns {NormalTimeStudyState}
 */
export function TimeStudy(id) {
  if (/^T[1-4]$/u.test(id)) return TriadStudy(id.slice(1));
  return NormalTimeStudyState.studies[id];
}

/**
 * @returns {NormalTimeStudyState[]}
 */
TimeStudy.boughtNormalTS = function() {
  return player.timestudy.studies.map(id => TimeStudy(id));
};

TimeStudy.preferredPaths = {
  get dimensionPath() {
    return {
      path: player.timestudy.preferredPaths[0],
      studies: player.timestudy.preferredPaths[0].reduce((acc, path) =>
        acc.concat(NormalTimeStudies.paths[path]), [])
    };
  },
  set dimensionPath(value) {
    const options = [1, 2, 3];
    player.timestudy.preferredPaths[0] = value.filter(id => options.includes(id));
  },
  get pacePath() {
    return {
      path: player.timestudy.preferredPaths[1],
      studies: NormalTimeStudies.paths[player.timestudy.preferredPaths[1]]
    };
  },
  set pacePath(value) {
    const options = [4, 5, 6];
    player.timestudy.preferredPaths[1] = options.includes(value) ? value : 0;
  }
};

export class ECTimeStudyState extends TimeStudyState {
  constructor(config) {
    super(config, TimeStudyType.ETERNITY_CHALLENGE);
    this.invalidateRequirement();
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
      Currency.timeTheorems.subtract(this.cost);
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
    const current = this.config.requirement.current();
    if (this.cachedCurrentRequirement === undefined) {
      this.cachedCurrentRequirement = current;
    } else if (typeof current === "number") {
      this.cachedCurrentRequirement = Math.max(this.cachedCurrentRequirement, current);
    } else {
      this.cachedCurrentRequirement = this.cachedCurrentRequirement.clampMin(current);
    }
    return this.cachedCurrentRequirement;
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

  invalidateRequirement() {
    this.cachedCurrentRequirement = undefined;
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

ECTimeStudyState.invalidateCachedRequirements = function() {
  ECTimeStudyState.studies.forEach(study => study.invalidateRequirement());
};

export class DilationTimeStudyState extends TimeStudyState {
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
      if (Currency.realities.eq(0)) {
        Modal.message.show(`Reality Machine gain for your first Reality is reduced above ${format("1e6000")} Eternity
          Points and capped at ${format("1e8000")} Eternity Points. This is due to balance changes made in the Reality
          update which affect the difficulty of reaching those amounts, such as the increased Time Dimension cost
          scaling above ${format("1e6000")}.`);
      }
      Tab.reality.glyphs.show();
    }
    player.dilation.studies.push(this.id);
    Currency.timeTheorems.subtract(this.cost);
    if (this.id === 6 && !PlayerProgress.realityUnlocked()) {
      // We need to do this at the end so that rupgs can be unlocked.
      EventHub.dispatch(GAME_EVENT.REALITY_FIRST_UNLOCKED);
    }
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


export class TimeStudyConnection {
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


export class TriadStudyState extends TimeStudyState {
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
    player.requirementChecks.reality.noTriads = false;
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

export function TriadStudy(id) {
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
