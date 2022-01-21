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
 * - All study entries must be Strings because numbers (normal TS) and EC# (ECs) need to be supported
 *
 * @member {Number[]} spentTheorems      Two-element array containing TT/ST totals for studies which were actually
 *  purchased after accounting for various conditions which would forbid some being bought (eg. cost or tree structure)
 * @member {String[]} invalidStudies     Array of studies from the initial string which are correctly formatted
 *  but don't actually exist; used for informational purposes elsewhere
 * @member {TimeStudyState[]} selectedStudies   Array of all given valid studies, whether or not they are actually
 *  accessible or purchasable in the given order
 * @member {TimeStudyState[]} purchasedStudies  Array of studies which were actually purchased, using the given amount
 *  of available theorems
 */
export class TimeStudyTree {
  // The first parameter will either be an import string or an array of studies (possibly with an EC at the end)
  constructor(studies) {
    this.spentTheorems = [0, 0];
    this.invalidStudies = [];
    this.purchasedStudies = [];
    this.selectedStudies = [];
    switch (typeof studies) {
      case "string":
        // Input parameter is an unparsed study import string
        if (TimeStudyTree.isValidImportString(studies)) {
          this.attemptBuyArray(this.parseStudyImport(studies), false);
        }
        break;
      case "object":
        // Input parameter is an array of time study objects
        this.attemptBuyArray([...studies], false);
        this.selectedStudies = [...studies];
        break;
      case "undefined":
        // If not supplied with anything, we leave everything at default values and don't attempt to buy anything
        break;
      default:
        throw new Error("Unrecognized input parameter for TimeStudyTree constructor");
    }
  }

  // Note that this only checks pure formatting, not whether or not a study/EC actually exists, but verifying correct
  // formatting separately from verifying existence allows us to produce more useful in-game error messages for
  // import strings which are formatted correctly but aren't entirely valid
  static isValidImportString(input) {
    return /^(\d+)(,(\d+))*(\|\d+)?$/u.test(input);
  }

  // Getter for all the studies in the current game state
  static get currentStudies() {
    const currentStudies = player.timestudy.studies.map(s => TimeStudy(s));
    if (player.challenge.eternity.unlocked !== 0) {
      currentStudies.push(TimeStudy.eternityChallenge(player.challenge.eternity.unlocked));
    }
    return currentStudies;
  }

  // THIS METHOD HAS LASTING CONSEQUENCES ON THE GAME STATE. STUDIES WILL ACTUALLY BE PURCHASED IF POSSIBLE.
  // This method attempts to take the parameter array and purchase all the studies specified, using the current game
  // state to determine if they are affordable. Input array may be either an id array or a TimeStudyState array
  static commitToGameState(studyArray) {
    for (const item of studyArray) {
      const study = typeof item === "number" ? TimeStudy(item) : item;
      if (study && !study.isBought) study.purchase(true);
    }
    GameCache.currentStudyTree.invalidate();
  }

  // This reads off all the studies in the import string and splits them into invalid and valid study IDs. We hold on
  // to invalid studies for additional information to present to the player
  parseStudyImport(input) {
    const treeStudies = input.split("|")[0].split(",");
    const studyDB = GameDatabase.eternity.timeStudies.normal.map(s => s.id);
    const studyArray = [];
    for (const study of treeStudies) {
      if (studyDB.includes(parseInt(study, 10))) {
        const tsObject = TimeStudy(study);
        this.selectedStudies.push(tsObject);
        studyArray.push(tsObject);
      } else this.invalidStudies.push(study);
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
      this.invalidStudies.push(`EC${ecID}`);
      return studyArray;
    }
    if (ecID !== 0) studyArray.push(TimeStudy.eternityChallenge(ecID));
    return studyArray;
  }

  // Attempt to purchase all studies specified in the array which may be either study IDs (which get converted) or
  // study objects. The method needs to support both because turning it entirely to studies causes circular references
  // which make the game fail to load
  attemptBuyArray(studyArray, checkCosts) {
    for (const study of studyArray) {
      const toBuy = typeof study === "object" ? study : TimeStudy(study);
      if (this.hasRequirements(toBuy)) this.buySingleStudy(toBuy, checkCosts);
    }
  }

  // Tries to buy a single study, accounting for all various requirements and locking behavior in the game. Does not
  // update anything cost-related, use buySingleStudy() to actually purchase. checkOnlyStructure is used to ignore
  // EC secondary requirements
  hasRequirements(study, checkOnlyStructure = false) {
    // Import strings can contain repeated or undefined entries
    if (!study || this.purchasedStudies.includes(study)) return false;

    const check = req => (typeof req === "number"
      ? this.purchasedStudies.includes(TimeStudy(req))
      : req());
    const config = study.config;
    let reqSatisfied;
    switch (config.reqType) {
      case TS_REQUIREMENT_TYPE.AT_LEAST_ONE:
        reqSatisfied = config.requirement.some(r => check(r));
        break;
      case TS_REQUIREMENT_TYPE.ALL:
        reqSatisfied = config.requirement.every(r => check(r));
        break;
      case TS_REQUIREMENT_TYPE.DIMENSION_PATH:
        reqSatisfied = config.requirement.every(r => check(r)) && this.currDimPathCount < this.allowedDimPathCount;
        break;
      default:
        throw Error(`Unrecognized TS requirement type: ${this.reqType}`);
    }
    if (study instanceof ECTimeStudyState) {
      if (this.purchasedStudies.some(s => s instanceof ECTimeStudyState)) return false;
      const forbiddenStudies = study.config.secondary.forbiddenStudies ?? [];
      const buyCheck = checkOnlyStructure ? study.isAccessible : study.canBeBought;
      const hasForbiddenStudies = Perk.studyECRequirement.isBought
        ? false
        : forbiddenStudies.some(s => this.purchasedStudies.includes(TimeStudy(s)));
      reqSatisfied = reqSatisfied && buyCheck && !hasForbiddenStudies;
    }
    if (!reqSatisfied) return false;
    return true;
  }

  // Buys the specified study; no requirement verification beyond cost, use hasRequirements() to verify proper structure
  buySingleStudy(study, checkCosts) {
    const config = study.config;
    const stDiscount = V.has(V_UNLOCKS.RA_UNLOCK) ? 2 : 0;
    const stNeeded = config.STCost && config.requiresST.some(s => this.purchasedStudies.includes(TimeStudy(s)))
      ? Math.clampMin(config.STCost - stDiscount, 0)
      : 0;
    // Took these out of the checkCosts check as these aren't available early game
    const maxST = V.spaceTheorems;
    const hasST = this.spentTheorems[1] + stNeeded <= maxST;
    if (checkCosts) {
      const maxTT = Currency.timeTheorems.value.add(GameCache.currentStudyTree.value.spentTheorems[0])
        .clampMax(Number.MAX_VALUE).toNumber();
      const hasTT = this.spentTheorems[0] + config.cost <= maxTT;
      if (!hasTT || !hasST) return;
    }
    this.spentTheorems[0] += stNeeded ? 0 : config.cost;
    if (hasST) {
      this.spentTheorems[1] += stNeeded;
    } else {
      return;
    }
    this.purchasedStudies.push(study);
  }

  get currDimPathCount() {
    return [71, 72, 73].countWhere(x => this.purchasedStudies.includes(TimeStudy(x)));
  }

  get allowedDimPathCount() {
    if (DilationUpgrade.timeStudySplit.isBought) return 3;
    if (this.purchasedStudies.includes(TimeStudy(201))) return 2;
    return 1;
  }

  get dimensionPaths() {
    const pathSet = new Set();
    const validPaths = [TIME_STUDY_PATH.ANTIMATTER_DIM, TIME_STUDY_PATH.INFINITY_DIM, TIME_STUDY_PATH.TIME_DIM];
    for (const path of validPaths) {
      const pathEntry = NormalTimeStudies.pathList.find(p => p.path === path);
      for (const study of this.purchasedStudies) {
        if (pathEntry.studies.includes(study.id)) {
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
        if (pathEntry.studies.includes(study.id)) {
          pathSet.add(pathEntry.name);
          break;
        }
      }
    }
    return Array.from(pathSet);
  }

  get ec() {
    // This technically takes the very first EC entry if there's more than one, but that shouldn't happen in practice
    const ecStudies = this.purchasedStudies.find(s => s instanceof ECTimeStudyState);
    return ecStudies ? ecStudies.id : 0;
  }

  // Creates an export string based on all currently purchased studies
  get exportString() {
    return `${this.purchasedStudies
      .filter(s => s instanceof NormalTimeStudyState)
      .map(s => s.id)
      .join(",")}|${this.ec}`;
  }
}
