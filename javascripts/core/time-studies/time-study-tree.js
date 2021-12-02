/**
 * Abstract representation of a full time study tree object. The intended usage is to supply the constructor with
 * an import string and a budget of time/space theorems, which it will use together to determine which studies can
 * actually be purchased in the specified order. All of the complex purchasing logic should be handled here, and not
 * in any TimeStudyState objects. During parsing, additional info is stored in order to improve user feedback when
 * attempting to import other study trees.
 * 
 * @member {Array: Number} initialTheorems      Two-element array containing starting totals of TT/ST before buying
 * @member {Array: Number} spentTheorems        Two-element array containing TT/ST totals for purchased studies
 * @member {Array: Number} totalTheorems        Two-element array containing the total cost of buying all valid,
 *  buyable studies whether or not they are actually affordable
 * @member {Array: String} plannedStudies       Array of valid studies to be purchased from the initial import string;
 *  all entries are Strings because numbers (normal TS), T# (triads), and EC# (ECs) need to be supported
 * @member {Array: String} invalidStudies       Array of studies from the initial string which are correctly formatted
 *  but don't actually exist; used for informational purposes elsewhere
 * @member {Array: String} purchasedStudies     Array of studies which were actually purchased, using the given amount
 *  of available theorems. Will always be a subset of plannedStudies
 * @member {Number} ec              Numerical ID of the EC which is unlocked from the imported tree. Equal to 0 if no
 *  EC has been attempted, or the negative of the ID if purchasing was attempted but failed (needed for merging logic)
 */
export class TimeStudyTree {
  // The first parameter will either be an import string or an array of studies (possibly with an EC at the end)
  constructor(studies, initialTT, initialST) {
    // If we have above e308 TT there's no way buying studies will put a dent in our total anyway
    this.initialTheorems = [Decimal.min(initialTT, Number.MAX_VALUE).toNumber(), initialST];
    this.spentTheorems = [0, 0];
    this.totalTheorems = [0, 0];
    this.plannedStudies = [];
    this.invalidStudies = [];
    this.purchasedStudies = [];
    this.ec = 0;

    switch (typeof studies) {
      case "string":
        // Input parameter is an unparsed study import string
        if (TimeStudyTree.isValidImportString(studies)) {
          this.parseStudyImport(studies);
          this.attemptBuyAll();
        }
        break;
      case "object":
        // Input parameter is an array of strings assumed to be already formatted as plannedStudies would be after
        // import parsing.
        this.plannedStudies = [...studies];
        this.attemptBuyAll();
        break;
    }
  }

  // Note that this only checks pure formatting, not whether or not a study/EC actually exists, but verifying correct
  // formatting separately from verifying existence allows us to produce more useful in-game error messages for
  // import strings which are formatted correctly but aren't entirely valid
  static isValidImportString(input) {
    return /^(\d+|T\d+)(,(\d+|T\d+))*(\|\d+)?$/u.test(input);
  }

  // Creates and returns a TimeStudyTree object representing the current state of the time study tree
  static currentTree() {
    const currentStudies = player.timestudy.studies.map(s => `${s}`)
      .concat(player.celestials.v.triadStudies.map(s => `T${s}`));
    if (player.challenge.eternity.current !== 0) currentStudies.push(`EC${player.challenge.eternity.current}`);
    // We use Number.MAX_VALUE to guarantee all studies end up getting purchased, but set it properly afterward
    const currTree = new TimeStudyTree(currentStudies, Number.MAX_VALUE, Number.MAX_VALUE);
    currTree.initialTheorems =
      [Decimal.min(Currency.timeTheorems.value.add(currTree.spentTheorems[0]), Number.MAX_VALUE).toNumber(),
        currTree.spentTheorems[1] + V.spaceTheorems];
    return currTree;
  }

  // THIS METHOD HAS LASTING CONSEQUENCES ON THE GAME STATE. STUDIES WILL ACTUALLY BE PURCHASED IF POSSIBLE.
  // Purchases the studies specified by the given ID array, using the requirement locking and logic code in this class.
  static purchaseTimeStudyArray(studyArray) {
    // An undefined array may get passed in if attempting to buy an unspecified path
    if (!studyArray) return;
    for (const id of studyArray) {
      const study = TimeStudy(id);
      if (study) study.purchase();
    }
  }

  // THIS METHOD HAS LASTING CONSEQUENCES ON THE GAME STATE. STUDIES WILL ACTUALLY BE PURCHASED IF POSSIBLE.
  // Creates a tree object using the current game state and then, after minimal verification, actually buys it.
  static importIntoCurrentTree(importString, auto) {
    const importedTree = new TimeStudyTree(importString, Currency.timeTheorems.value, V.spaceTheorems);
    TimeStudyTree.purchaseTimeStudyArray(importedTree.purchasedStudies);
    const ecNum = importedTree.ec;
    if (ecNum > 0 && !TimeStudy.eternityChallenge(ecNum).isBought) {
      TimeStudy.eternityChallenge(ecNum).purchase(auto);
    }
  }

  // Takes this tree and imports the other tree on top of its state, returning a new composite tree with the studies of
  // both trees together. Note the order of combination matters since one tree may fulfill requirements in the other.
  // The only information taken from the other tree is studies; TT/ST counts are taken from this tree.
  createCombinedTree(otherTree) {
    const thisStudyList = [...this.purchasedStudies];
    if (this.ec > 0) currentStudies.push(`EC${this.ec}`);
    const compositeTree = new TimeStudyTree(thisStudyList, this.initialTheorems[0], this.initialTheorems[1]);
    compositeTree.plannedStudies = compositeTree.plannedStudies.concat(otherTree.plannedStudies);
    compositeTree.attemptBuyAll();
    return compositeTree;
  }

  // This reads off all the studies in the import string and splits them into invalid and valid study IDs. We hold on
  // to invalid studies for additional information to present to the player
  parseStudyImport(input) {
    const treeStudies = input.split("|")[0].split(",");
    const normalIDs = GameDatabase.eternity.timeStudies.normal.map(s => s.id);
    const triadIDs = GameDatabase.eternity.timeStudies.triad.map(s => s.id);
    const doesStudyExist = str => (
      /^T\d+$/u.test(str)
        ? triadIDs.includes(parseInt(str.substr(1), 10))
        : normalIDs.includes(parseInt(str, 10))
    );

    for (const study of treeStudies) {
      if (doesStudyExist(study)) this.plannedStudies.push(study);
      else this.invalidStudies.push(study);
    }

    // If the string has an EC indicated in it, append that to the end of the study array
    const ecString = input.split("|")[1];
    if (!ecString) {
      // Study strings without an ending "|##" are still valid, but will result in ecString being undefined
      return;
    }
    const ecID = parseInt(ecString, 10);
    const ecDB = GameDatabase.eternity.timeStudies.ec;
    // Specifically exclude 0 because saved presets will contain it by default
    if (!ecDB.map(c => c.id).includes(ecID) && ecID !== 0) {
      this.invalidStudies.push(`${ecID}$`);
      return;
    }
    this.plannedStudies.push(`EC${ecID}`);
  }

  // Attempt to purchase all studies specified in the initial import string
  attemptBuyAll() {
    const studyDB = GameDatabase.eternity.timeStudies;
    const getStudyEntry = str => {
      const id = `${str}`.match(/(T|EC)?(\d+)/u);
      switch (id[1]) {
        case "T":
          return studyDB.triad.find(s => s.id === parseInt(id[2], 10));
        case "EC":
          return studyDB.ec.find(s => s.id === parseInt(id[2], 10));
        default:
          return studyDB.normal.find(s => s.id === parseInt(id[2], 10));
      }
    };

    for (const study of this.plannedStudies) {
      const toBuy = getStudyEntry(study);
      if (this.attemptBuySingle(toBuy)) this.purchasedStudies.push(study);
    }
  }

  // Tries to buy a single study, accounting for all various requirements and locking behavior in the game. If the
  // requirement is satisfied, then the running theorem costs will be updated (always) and the remaining usable
  // theorems will be decremented (only if there are enough left to actually purchase)
  attemptBuySingle(dbEntry) {
    // Import strings can contain repeated or undefined entries
    if (!dbEntry || this.purchasedStudies.includes(`${dbEntry.id}`)) return false;

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

    const stDiscount = V.has(V_UNLOCKS.RA_UNLOCK) ? 2 : 0;
    const stNeeded = dbEntry.STCost && dbEntry.requiresST.some(s => this.purchasedStudies.includes(`${s}`))
      ? Math.clampMin(dbEntry.STCost - stDiscount, 0)
      : 0;
    const canAfford = this.spentTheorems[0] + dbEntry.cost <= this.initialTheorems[0] &&
      this.spentTheorems[1] + stNeeded <= this.initialTheorems[1];

    // We have to handle ECs slightly differently because you can only have one at once and merging trees may attempt
    // to buy another. To distinguish between successful and failed purchases, we give failed ones a negative sign
    if (dbEntry.secondary) {
      if (this.ec !== 0) return false;
      this.ec = canAfford ? dbEntry.id : -dbEntry.id;
    }
    this.totalTheorems[0] += dbEntry.cost;
    this.totalTheorems[1] += stNeeded;
    if (!canAfford) return false;
    this.spentTheorems[0] += dbEntry.cost;
    this.spentTheorems[1] += stNeeded;
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

  get firstSplitPaths() {
    const pathSet = new Set();
    const validPaths = [TIME_STUDY_PATH.ANTIMATTER_DIM, TIME_STUDY_PATH.INFINITY_DIM, TIME_STUDY_PATH.TIME_DIM];
    for (const path of validPaths) {
      const pathEntry = NormalTimeStudies.pathList.find(p => p.path === path);
      for (const study of this.purchasedStudies) {
        if (pathEntry.studies.includes(parseInt(study, 10))) {
          pathSet.add(pathEntry.name);
          break;
        }
      }
    }
    return Array.from(pathSet);
  }

  get secondSplitPaths() {
    const pathSet = new Set();
    const validPaths = [TIME_STUDY_PATH.ACTIVE, TIME_STUDY_PATH.PASSIVE, TIME_STUDY_PATH.IDLE];
    for (const path of validPaths) {
      const pathEntry = NormalTimeStudies.pathList.find(p => p.path === path);
      for (const study of this.purchasedStudies) {
        if (pathEntry.studies.includes(parseInt(study, 10))) {
          pathSet.add(pathEntry.name);
          break;
        }
      }
    }
    return Array.from(pathSet);
  }

  // Creates an export string based on all currently purchased studies (ignores planned/unaffordable)
  get exportString() {
    // Note: clampMin is used here because negative EC indices are used to indicate planned but unpurchased ECs
    return `${this.purchasedStudies.join(",")}|${Math.clampMin(0, this.ec)}`;

  }
}
