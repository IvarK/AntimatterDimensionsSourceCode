import { TimeStudyState } from "./time-studies";

export const NormalTimeStudies = {};

NormalTimeStudies.pathList = [
  { path: TIME_STUDY_PATH.ANTIMATTER_DIM, studies: [71, 81, 91, 101], name: "Antimatter Dims" },
  { path: TIME_STUDY_PATH.INFINITY_DIM, studies: [72, 82, 92, 102], name: "Infinity Dims" },
  { path: TIME_STUDY_PATH.TIME_DIM, studies: [73, 83, 93, 103], name: "Time Dims" },
  { path: TIME_STUDY_PATH.ACTIVE, studies: [121, 131, 141], name: "Active" },
  { path: TIME_STUDY_PATH.PASSIVE, studies: [122, 132, 142], name: "Passive" },
  { path: TIME_STUDY_PATH.IDLE, studies: [123, 133, 143], name: "Idle" },
  { path: TIME_STUDY_PATH.LIGHT, studies: [221, 223, 225, 227, 231, 233], name: "Light" },
  { path: TIME_STUDY_PATH.DARK, studies: [222, 224, 226, 228, 232, 234], name: "Dark" }
];

NormalTimeStudies.paths = NormalTimeStudies.pathList.mapToObject(e => e.path, e => e.studies);

export class NormalTimeStudyState extends TimeStudyState {
  constructor(config) {
    const type = config.id > 300 ? TIME_STUDY_TYPE.TRIAD : TIME_STUDY_TYPE.NORMAL;
    super(config, type);
    const path = NormalTimeStudies.pathList.find(p => p.studies.includes(this.id));
    this._path = path?.path ?? TIME_STUDY_PATH.NONE;
  }

  get isUnlocked() {
    return this.config.unlocked?.() ?? true;
  }

  get isTriad() {
    return this.id > 300;
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
    const currTree = GameCache.currentStudyTree.value;
    switch (this.config.reqType) {
      case TS_REQUIREMENT_TYPE.AT_LEAST_ONE:
        return this.config.requirement.some(r => check(r));
      case TS_REQUIREMENT_TYPE.ALL:
        return this.config.requirement.every(r => check(r));
      case TS_REQUIREMENT_TYPE.DIMENSION_PATH:
        // In some cases of loading, sometimes the current tree might be undefined when this code is executed. The
        // exact situations seem unclear, but it may be an interaction between the automator and offline progress
        return this.config.requirement.every(r => check(r)) && currTree &&
          currTree.currDimPathCount < currTree.allowedDimPathCount;
      default:
        throw Error(`Unrecognized TS requirement type: ${this.reqType}`);
    }
  }

  // This checks for and forbids buying studies due to being part of a set which can't normally be bought
  // together (eg. active/passive/idle and light/dark) unless the player has the requisite ST.
  checkSetRequirement() {
    return this.costsST() ? !Pelle.isDisabled("V") && (V.availableST >= this.STCost) : true;
  }

  get canBeBought() {
    return this.checkRequirement() && this.checkSetRequirement();
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase(auto = false) {
    if (this.isBought || !this.isAffordable || !this.canBeBought) return false;
    if (GameEnd.creditsEverClosed) return false;
    if (ImaginaryUpgrade(19).isLockingMechanics && player.timestudy.studies.length === 8) {
      if (!auto) ImaginaryUpgrade(19).tryShowWarningModal();
      return false;
    }
    if (this.costsST()) player.celestials.v.STSpent += this.STCost;
    player.timestudy.studies.push(this.id);
    player.requirementChecks.reality.maxStudies = Math.clampMin(player.requirementChecks.reality.maxStudies,
      player.timestudy.studies.length);
    if (this.id > 300) player.requirementChecks.reality.noTriads = false;
    Currency.timeTheorems.subtract(this.cost);
    GameCache.timeStudies.invalidate();
    TimeStudyTree.commitToGameState([TimeStudy(this.id)]);
    if (this.id === 181 && Pelle.isDoomed) Achievement(186).unlock();
    return true;
  }

  purchaseUntil() {
    TimeStudyTree.commitToGameState(buyStudiesUntil(this.id));
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
export function TimeStudy(id) {
  return NormalTimeStudyState.studies[id];
}

/**
 * @returns {NormalTimeStudyState[]}
 */
TimeStudy.boughtNormalTS = function() {
  return player.timestudy.studies.map(id => TimeStudy(id));
};

TimeStudy.preferredPaths = {
  dimension: {
    get path() {
      return player.timestudy.preferredPaths[0];
    },
    set path(value) {
      const options = [1, 2, 3];
      player.timestudy.preferredPaths[0] = value.filter(id => options.includes(id));
    },
    get studies() {
      return player.timestudy.preferredPaths[0].flatMap(path => NormalTimeStudies.paths[path]);
    },
    get usePriority() {
      return this.path.length > 1 ||
        TimeStudy(201).isBought ||
        DilationUpgrade.timeStudySplit.isBought ||
        PlayerProgress.realityUnlocked();
    }
  },
  pace: {
    get path() {
      return player.timestudy.preferredPaths[1];
    },
    set path(value) {
      const options = [4, 5, 6];
      player.timestudy.preferredPaths[1] = options.includes(value) ? value : 0;
    },
    get studies() {
      return NormalTimeStudies.paths[player.timestudy.preferredPaths[1]];
    }
  }
};
