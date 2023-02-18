import { GameMechanicState } from "../game-mechanics";

class GameProgressState extends GameMechanicState {
  get id() {
    return this.config.id;
  }

  get name() {
    return this.config.name;
  }

  get suggestedResource() {
    return typeof this.config.suggestedResource === "function"
      ? this.config.suggestedResource()
      : this.config.suggestedResource;
  }
}

export const GameProgress = GameProgressState.createAccessor(GameDatabase.progressStages);
GameProgress.all = GameDatabase.progressStages;

class CatchupResource extends GameMechanicState {
  get requiredStage() {
    return this.config.requiredStage;
  }

  get name() {
    return this.config.name;
  }

  get description() {
    return typeof this.config.description === "function" ? this.config.description() : this.config.description;
  }
}

export const CatchupResources = mapGameDataToObject(
  GameDatabase.catchupResources,
  config => new CatchupResource(config)
);

export const ProgressChecker = {
  getProgressStage(save) {
    const db = GameProgress.all;
    for (let stage = db.length - 1; stage >= 0; stage--) {
      if (db[stage].hasReached(save)) return db[stage];
    }
    throw Error("No valid progress stage found");
  },

  // Returns a value corresponding to keys in PROGRESS_STAGE, with a rough interpolation between stages
  getCompositeProgress(save) {
    if (!save) return 0;
    const stage = this.getProgressStage(save);
    return stage.id + Math.clampMax(stage.subProgressValue(save), 1);
  },

  // Returns -1 or 1 when one save is very likely to be farther than the other, otherwise returns 0 if they're close
  compareSaveProgress(first, second) {
    const progressDifference = this.getCompositeProgress(first) - this.getCompositeProgress(second);
    if (progressDifference > 0.05) return -1;
    if (progressDifference < -0.05) return 1;
    return 0;
  },

  // Returns -1 or 1 based on which save is older. Returns 0 if one is undefined, will be handled upstream
  compareSaveTimes(first, second) {
    if (!first || !second) return 0;
    const timeDifference = first.records?.realTimePlayed - second.records?.realTimePlayed;
    if (timeDifference >= 0) return -1;
    return 1;
  }
};
