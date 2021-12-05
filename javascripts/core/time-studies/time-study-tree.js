/**
 * Abstract representation of a full time study tree object. The intended usage is to supply the constructor with
 * an import string and a budget of time/space theorems, which it will use together to determine which studies can
 * actually be purchased in the specified order. All of the complex purchasing logic should be handled here, and not
 * in any TimeStudyState objects. During parsing, some minor additional info is stored in order to improve user
 * feedback when attempting to import other study trees.
 * 
 * Usage notes:
 * - Unless commitToGameState() is called, this only ever creates a "virtual" tree object which does not change the
 *   overall game state. This class serves the purpose of having all the purchasing and locking logic in one place.
 *   Only upon calling commitToGameState() will the game actually try to get every study specified in tree.
 * - The general intent is that the logic in this class is meant to pull minimally from the extrenal game state; for
 *   example, how many dimension paths are allowed or which ECs are unlockable depend on only the data in the tree
 *   object itself and should not depend on the actual current game state
 * - All study entries must be Strings because numbers (normal TS), T# (triads), and EC# (ECs) need to be supported
 * 
 * @member {Number[]} theoremBudget      Two-element array containing the maximum allowed TT/ST to be spent on
 *  purchasing specified studies
 * @member {Number[]} spentTheorems      Two-element array containing TT/ST totals for studies which were actually
 *  purchased after accounting for various conditions which would forbid some being bought (eg. cost or tree structure)
 * @member {String[]} invalidStudies     Array of studies from the initial string which are correctly formatted
 *  but don't actually exist; used for informational purposes elsewhere
 * @member {String[]} purchasedStudies   Array of studies which were actually purchased, using the given amount
 *  of available theorems
 */
export class TimeStudyTree {
  // The first parameter will either be an import string or an array of studies (possibly with an EC at the end)
  constructor(studies, initialTT, initialST) {
    // Total theorems spent will never hit e308 anyway
    this.theoremBudget = [Decimal.min(initialTT, Number.MAX_VALUE).toNumber(), initialST];
    this.spentTheorems = [0, 0];
    this.invalidStudies = [];
    this.purchasedStudies = [];
    switch (typeof studies) {
      case "string":
        // Input parameter is an unparsed study import string
        if (TimeStudyTree.isValidImportString(studies)) {
          this.attemptBuyArray(this.parseStudyImport(studies));
        }
        break;
      case "object":
        // Input parameter is an array of Strings assumed to be already formatted as expected in the parsing method.
        // This allows code for combining trees to look simpler and more readable
        this.attemptBuyArray([...studies]);
        break;
    }
  }

  // Note that this only checks pure formatting, not whether or not a study/EC actually exists, but verifying correct
  // formatting separately from verifying existence allows us to produce more useful in-game error messages for
  // import strings which are formatted correctly but aren't entirely valid
  static isValidImportString(input) {
    return /^(\d+|T\d+)(,(\d+|T\d+))*(\|\d+)?$/u.test(input);
  }

  // Getter for all the studies in the current game state
  static get currentStudies() {
    const currentStudies = player.timestudy.studies.map(s => `${s}`)
      .concat(player.celestials.v.triadStudies.map(s => `T${s}`));
    if (player.challenge.eternity.current !== 0) currentStudies.push(`EC${player.challenge.eternity.current}`);
    return currentStudies;
  }

  // Creates and returns a TimeStudyTree object representing the current state of the time study tree
  static currentTree() {
    const currentStudies = player.timestudy.studies.map(s => `${s}`)
      .concat(player.celestials.v.triadStudies.map(s => `T${s}`));
    if (player.challenge.eternity.current !== 0) currentStudies.push(`EC${player.challenge.eternity.current}`);
    // We use Number.MAX_VALUE to guarantee all studies end up getting purchased, but set it properly afterward
    const currTree = new TimeStudyTree(currentStudies, Number.MAX_VALUE, Number.MAX_VALUE);
    currTree.theoremBudget =
      [Decimal.min(Currency.timeTheorems.value.add(currTree.spentTheorems[0]), Number.MAX_VALUE).toNumber(),
        currTree.spentTheorems[1] + V.availableST];
    return currTree;
  }

  // THIS METHOD HAS LASTING CONSEQUENCES ON THE GAME STATE. STUDIES WILL ACTUALLY BE PURCHASED IF POSSIBLE.
  // Uses the internal state of this TimeStudyTree to actually try to purchase all the listed studies within
  commitToGameState() {
    for (const study of this.purchasedStudies) {
      const id = `${study}`.match(/(T|EC)?(\d+)/u);
      const num = parseInt(id[2], 10);
      switch (id[1]) {
        case "EC":
          if (!TimeStudy.eternityChallenge(num).isBought) TimeStudy.eternityChallenge(num).purchase(true);
          break;
        default:
          if (TimeStudy(num)) TimeStudy(num).purchase();
          break;
      }
    }
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

    const studyArray = [];
    for (const study of treeStudies) {
      if (doesStudyExist(study)) studyArray.push(study);
      else this.invalidStudies.push(study);
    }

    // If the string has an EC indicated in it, append that to the end of the study array
    const ecString = input.split("|")[1];
    if (!ecString) {
      // Study strings without an ending "|##" are still valid, but will result in ecString being undefined
      return studyArray;
    }
    const ecID = parseInt(ecString, 10);
    const ecDB = GameDatabase.eternity.timeStudies.ec;
    // Specifically exclude 0 because saved presets will contain it by default
    if (!ecDB.map(c => c.id).includes(ecID) && ecID !== 0) {
      this.invalidStudies.push(`${ecID}`);
      return studyArray;
    }
    studyArray.push(`EC${ecID}`);
    return studyArray;
  }

  // Attempt to purchase all studies specified in the initial import string
  attemptBuyArray(studyArray) {
    const studyDB = GameDatabase.eternity.timeStudies;
    for (const study of studyArray) {
      const id = `${study}`.match(/^(T|EC)?(\d+)/u);
      const num = parseInt(id[2], 10);
      let toBuy;
      switch (id[1]) {
        case "T":
          toBuy = studyDB.triad.find(s => s.id === num);
          break;
        case "EC":
          toBuy = studyDB.ec.find(s => s.id === num);
          break;
        default:
          toBuy = studyDB.normal.find(s => s.id === num);
      }
      if (this.canBuySingle(toBuy, study)) this.purchasedStudies.push(`${study}`);
    }
  }

  // Tries to buy a single study, accounting for all various requirements and locking behavior in the game. If the
  // requirement is satisfied, then the running theorem costs will be updated (always) and the remaining usable
  // theorems will be decremented (only if there are enough left to actually purchase)
  canBuySingle(dbEntry, studyString) {
    // Import strings can contain repeated or undefined entries
    if (!dbEntry || this.purchasedStudies.includes(studyString)) return false;

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
    const canAfford = this.spentTheorems[0] + dbEntry.cost <= this.theoremBudget[0] &&
      this.spentTheorems[1] + stNeeded <= this.theoremBudget[1];

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

  get dimensionPaths() {
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

  get pacePaths() {
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

  get ec() {
    // This technically takes the very first EC entry if there's more than one, but that shouldn't happen in practice
    const ecStudies = this.purchasedStudies.filter(r => r.match(/EC(\d+)/u));
    if (ecStudies.length === 0) return 0;
    return parseInt(ecStudies[0].match(/EC(\d+)/u)[1], 10);
  }

  // Creates an export string based on all currently purchased studies
  get exportString() {
    return `${this.purchasedStudies.join(",")}|${this.ec}`;
  }
}
