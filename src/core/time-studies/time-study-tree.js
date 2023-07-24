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
 * @member {Boolean} startEC    Whether or not to start an EC within purchasedStudies when committing to game state
 */
export class TimeStudyTree {
  // The first parameter will either be an import string or an array of studies (possibly with an EC at the end)
  constructor(studies) {
    this.spentTheorems = [0, 0];
    this.invalidStudies = [];
    this.purchasedStudies = [];
    this.selectedStudies = [];
    this.startEC = false;
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
    if (input.trim() === "") {
      return false;
    }
    let test = input.replaceAll(/ +/gu, "");
    TimeStudyTree.sets.forEach((_, x) => test = test.replaceAll(new RegExp(`${x},?`, "gu"), ""));
    return /^,?((\d{2,3}(-\d{2,3})?)\b,?)*(\|\d{1,2}!?)?$/iu.test(test);
  }

  // Getter for all the studies in the current game state
  static get currentStudies() {
    const currentStudies = player.timestudy.studies.map(s => TimeStudy(s));
    if (player.challenge.eternity.unlocked !== 0) {
      currentStudies.push(TimeStudy.eternityChallenge(player.challenge.eternity.unlocked));
    }
    return currentStudies;
  }

  // Parses out the EC number from an import string (returns 0 for invalid or nonexistent EC ids)
  static getECFromString(input) {
    if (!this.isValidImportString(input)) return 0;
    const parts = input.split("|");
    if (parts.length < 1) return 0;
    // Note: parseInt() seems to silently ignore the presence of "!"
    return parseInt(parts[1], 10);
  }

  // THIS METHOD HAS LASTING CONSEQUENCES ON THE GAME STATE. STUDIES WILL ACTUALLY BE PURCHASED IF POSSIBLE.
  // This method attempts to take the parameter array and purchase all the studies specified, using the current game
  // state to determine if they are affordable. Input array may be either an id array or a TimeStudyState array
  static commitToGameState(studyArray, auto = true, startEC = false) {
    for (const item of studyArray) {
      const study = typeof item === "number" ? TimeStudy(item) : item;
      if (study && !study.isBought) study.purchase(auto);
      // Note: This will automatically (silently) fail if we try to start an EC while we have a different one unlocked
      if (startEC && study instanceof ECTimeStudyState) EternityChallenge(study.id).start(auto);
    }
    GameCache.currentStudyTree.invalidate();
  }

  static get sets() {
    // Grouping of studies. The key followed by an array of the studies the key is a shorthand for.
    return new Map([
      ["antimatter", [71, 81, 91, 101]],
      ["infinity", [72, 82, 92, 102]],
      ["time", [73, 83, 93, 103]],
      ["active", [121, 131, 141]],
      ["passive", [122, 132, 142]],
      ["idle", [123, 133, 143]],
      ["light", [221, 223, 225, 227, 231, 233]],
      ["dark", [222, 224, 226, 228, 232, 234]],
      ...(Ra.unlocks.unlockHardV.canBeApplied
        ? [["triad", [301, 302, 303, 304].slice(0, Ra.unlocks.unlockHardV.effectOrDefault(0))]]
        : [])
    ]);
  }

  static truncateInput(input) {
    let internal = input.toLowerCase();
    // Convert every name into the ids it is a shorthand for
    this.sets.forEach((ids, name) => (internal = internal.replace(name, ids.join())));
    return internal
      .replace(/[|,]$/u, "")
      .replaceAll(" ", "")
      // Allows 11,,21 to be parsed as 11,21 and 11,|1 to be parsed as 11|1
      .replace(/,{2,}/gu, ",")
      .replace(/,\|/gu, "|");
  }

  static formatStudyList(input) {
    const internal = input.toLowerCase().replaceAll(" ", "");
    return internal.replaceAll(",", ", ").replace("|", " | ");
  }

  // This reads off all the studies in the import string and splits them into invalid and valid study IDs. We hold on
  // to invalid studies for additional information to present to the player
  parseStudyImport(input) {
    const studyDB = GameDatabase.eternity.timeStudies.normal.map(s => s.id);
    const output = [];
    const studiesString = TimeStudyTree.truncateInput(input).split("|")[0];
    if (studiesString.length) {
      const studyCluster = studiesString.split(",");
      for (const studyRange of studyCluster) {
        const studyRangeSplit = studyRange.split("-");
        const studyArray = studyRangeSplit[1]
          ? this.studyRangeToArray(studyRangeSplit[0], studyRangeSplit[1])
          : studyRangeSplit;
        for (const study of studyArray) {
          if (studyDB.includes(parseInt(study, 10))) {
            const tsObject = TimeStudy(study);
            this.selectedStudies.push(tsObject);
            output.push(tsObject);
          } else {
            this.invalidStudies.push(study);
          }
        }
      }
    }

    // If the string has an EC indicated in it, append that to the end of the study array
    const ecString = input.split("|")[1];
    this.startEC = input.endsWith("!");
    if (!ecString) {
      // Study strings without an ending "|##" are still valid, but will result in ecString being undefined
      return output;
    }
    // Note: parseInt() seems to silently ignore the presence of "!"
    const ecID = parseInt(ecString, 10);
    const ecDB = GameDatabase.eternity.timeStudies.ec;
    // Specifically exclude 0 because saved presets will contain it by default
    if (!ecDB.map(c => c.id).includes(ecID) && ecID !== 0) {
      this.invalidStudies.push(`EC${ecID}`);
      return output;
    }
    if (ecID !== 0) output.push(TimeStudy.eternityChallenge(ecID));
    return output;
  }

  studyRangeToArray(firstNumber, lastNumber) {
    const studiesArray = [];
    const first = this.checkTimeStudyNumber(firstNumber);
    const last = this.checkTimeStudyNumber(lastNumber);
    if ((first !== 0) && (last !== 0)) {
      for (let id = first; id <= last; id++) {
        if (TimeStudy(id)) {
          studiesArray.push(id);
        }
      }
    }
    return studiesArray;
  }

  checkTimeStudyNumber(token) {
    const tsNumber = parseFloat(token);
    if (!TimeStudy(tsNumber) || (TimeStudy(tsNumber).isTriad && !Ra.canBuyTriad)) {
      return 0;
    }
    return tsNumber;
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

    // Because the player data may not reflect the state of the TimeStudyTree object's purchasedStudies,
    // we have to do all the checks here with purchasedStudies. study.isBought and similar functions cannot be used.
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
      const hasForbiddenStudies = !Perk.studyECRequirement.isBought &&
        study.config.secondary.forbiddenStudies?.some(s => check(s));
      // We want to only check the structure for script template error instructions
      if (checkOnlyStructure) {
        return reqSatisfied && !hasForbiddenStudies;
      }
      const totalTT = player.timestudy.theorem.plus(TimeTheorems.calculateTimeStudiesCost());
      const hasEnoughTT = totalTT.subtract(this.spentTheorems[0]).gte(study.cost);
      const secondaryGoal = Perk.studyECRequirement.isBought || study.isEntryGoalMet;
      return reqSatisfied && !hasForbiddenStudies && (study.isBought || (secondaryGoal && hasEnoughTT));
    }
    return reqSatisfied;
  }

  // Buys the specified study; no requirement verification beyond cost, use hasRequirements() to verify proper structure
  buySingleStudy(study, checkCosts) {
    const config = study.config;
    const stDiscount = VUnlocks.raUnlock.effectOrDefault(0);
    const stNeeded = config.STCost && config.requiresST.some(s => this.purchasedStudies.includes(TimeStudy(s)))
      ? Math.clampMin(config.STCost - stDiscount, 0)
      : 0;
    // Took these out of the checkCosts check as these aren't available early game
    const maxST = Pelle.isDoomed ? 0 : V.spaceTheorems;
    const hasST = this.spentTheorems[1] + stNeeded <= maxST;
    if (checkCosts) {
      const maxTT = Currency.timeTheorems.value.add(GameCache.currentStudyTree.value.spentTheorems[0])
        .clampMax(Number.MAX_VALUE).toNumber();
      const hasTT = this.spentTheorems[0] + config.cost <= maxTT;
      if (!hasTT || !hasST) return;
    }

    // Don't add the costs nor add the study if it is one using ST and there are none
    if (maxST === 0 && stNeeded > 0) return;
    this.spentTheorems[0] += config.cost;
    this.spentTheorems[1] += stNeeded;

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

  // Creates an export string based on all currently purchased studies; gives an ! at the end if currently in an EC
  get exportString() {
    return `${this.purchasedStudies
      .filter(s => s instanceof NormalTimeStudyState)
      .map(s => s.id)
      .join(",")}|${this.ec}${player.challenge.eternity.current === 0 ? "" : "!"}`;
  }
}
