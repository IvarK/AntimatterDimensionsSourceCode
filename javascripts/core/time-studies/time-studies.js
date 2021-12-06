import { GameMechanicState } from "../game-mechanics/index.js";

export function newTreeFromStudyUntil(id, repeatFor201 = true) {
  const newTree = new TimeStudyTree(TimeStudyTree.currentStudies, Currency.timeTheorems.value, V.availableST);
  const lastInPrevRow = Math.floor(id / 10) * 10 - 1;
  const requestedPath = TimeStudy(id).path;
  const currTree = TimeStudyTree.currentTree;
  // Makes an array [start, start+1, ... , end], empty if end < start
  const range = (start, end) => [...Array(Math.clampMin(end - start + 1, 0)).keys()].map(i => i + start);

  // If the player tries to buy a study which is immediately buyable, we try to buy it first in case buying other
  // studies up to that point renders it unaffordable. Effectively the clicked study is higher priority than all others
  newTree.attemptBuyArray([id]);

  // Greddily buy all studies before the dimension split then try again; if the requested study was above the dimension
  // split, then we're done and don't need to attempt to buy any more
  newTree.attemptBuyArray(range(11, Math.min(lastInPrevRow, 70)));
  newTree.attemptBuyArray([id]);
  if (id < 71) return newTree;

  // Priority for behavior when buying in the Dimension split; we follow only the first applicable entry below:
  // - If we're buying a study within the split, we first buy just the requested path up to the requested study.
  //   If we still have additional available paths at this point, we also buy others in order specified first by the
  //   player's chosen priority and then numerically (stops buying)
  // - If we can't buy any additional paths or have 3 paths available, we attempt to buy everything here. With less
  //   than 3 paths available, this only purchases the rest of any unfinished paths (continues onward)
  // - If the player has a preferred path, we attempt to buy it (continues onward)
  // - If the player doesn't have a preferred path, we say so and do nothing (stops buying)
  if (id < 111) {
    newTree.attemptBuyArray(NormalTimeStudies.paths[requestedPath].filter(s => s <= id));
    // The purchasing logic is doing the heavy lifting here; studies can't be double-bought, nor can they be bought
    // if we don't have another available path
    const pathBuyOrder = TimeStudy.preferredPaths.dimensionPath.path
      .concat([TIME_STUDY_PATH.ANTIMATTER_DIM, TIME_STUDY_PATH.INFINITY_DIM, TIME_STUDY_PATH.TIME_DIM]);
    for (const path of pathBuyOrder) {
      newTree.attemptBuyArray(NormalTimeStudies.paths[path].filter(s => s <= lastInPrevRow));
    }
    return newTree;
  }
  if (currTree.currDimPathCount === currTree.allowedDimPathCount || currTree.allowedDimPathCount === 3) {
    newTree.attemptBuyArray(range(71, 120));
  } else if (TimeStudy.preferredPaths.dimensionPath.path.length > 0) {
    newTree.attemptBuyArray(TimeStudy.preferredPaths.dimensionPath.studies);
  } else {
    GameUI.notify.error("You haven't selected a preferred Dimension path!");
    return newTree;
  }

  // Explicitly purchase 111 here if it's included and stop if applicable, as it isn't covered by logic in either split.
  if (id >= 111) newTree.attemptBuyArray([111]);
  if (id < 121) return newTree;

  // Priority for behavior when buying in the Pace split; we follow only the first applicable entry below. In contrast
  // to the Dimension split, here we instead err on the side of not buying extra studies since they will cost ST.
  // - If we're buying a study within the split, we first buy just the requested path up to the requested study.
  //   We don't attempt to buy other paths here because that may waste ST (stops buying)
  // - If V has been fully completed, we just brute-force this whole group (continues onward)
  // - If we already have part of a single path, we buy the rest of it (continues onward)
  // - If we have a preferred path, we buy it all (continues onward)
  // - If we don't have any pace paths at this point, there's no way to objectively choose one (stops buying)
  // - Fallback case: we have more than one path and intentionally do nothing here (continues onward)
  const pacePaths = currTree.pacePaths
    .map(pathName => NormalTimeStudies.pathList.find(p => p.name === pathName).path);
  if (id < 151) {
    newTree.attemptBuyArray(NormalTimeStudies.paths[TimeStudy(id).path].filter(s => s <= id));
    return newTree;
  }
  if (V.isFullyCompleted) {
    const allPace = NormalTimeStudies.paths[TIME_STUDY_PATH.ACTIVE]
      .concat(NormalTimeStudies.paths[TIME_STUDY_PATH.PASSIVE])
      .concat(NormalTimeStudies.paths[TIME_STUDY_PATH.IDLE]);
    newTree.attemptBuyArray(allPace);
  } else if (pacePaths.length === 1) {
    newTree.attemptBuyArray(NormalTimeStudies.paths[pacePaths[0]]);
  } else if (TimeStudy.preferredPaths.pacePath.path !== 0) {
    newTree.attemptBuyArray(TimeStudy.preferredPaths.pacePath.studies);
  } else if (pacePaths.length === 0) {
    GameUI.notify.error("You haven't selected a preferred Pace path!");
    return newTree;
  }

  // Buy up to 201, then if applicable we recursively call this function again in order to attempt to buy another path
  newTree.attemptBuyArray(range(151, Math.min(id, 201)));
  if (id >= 201 && repeatFor201) newTreeFromStudyUntil(id, false);
  else if (id < 201) return newTree;
  newTree.attemptBuyArray(range(211, Math.min(id, 214)));
  newTree.attemptBuyArray([id]);

  // Don't bother buying any more studies at or below row 22 unless the player has fully finished V,
  // in which case just brute-force all of them
  if (!V.isFullyCompleted) return newTree;
  newTree.attemptBuyArray(range(221, 234));
  return newTree;
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
  TimeStudyTree.addStudyToGameState();
}

export class TimeStudyState extends GameMechanicState {
  constructor(config, type) {
    super(config);
    this.type = type;
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
