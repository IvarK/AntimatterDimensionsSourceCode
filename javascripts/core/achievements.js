"use strict";

class AchievementState extends GameMechanicState {
  constructor(config) {
    super(config);
    if (config.secondaryEffect) {
      const secondaryConfig = {
        id: config.id,
        effect: config.secondaryEffect
      };
      this._secondaryState = new AchievementState(secondaryConfig);
    }
  }

  get name() {
    return this.config.name;
  }

  get isUnlocked() {
    return player.achievements.has(this.id);
  }
  
  tryUnlock(a1, a2, a3) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(a1, a2, a3)) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return;
    player.achievements.add(this.id);
    if (this.id === 85 || this.id === 93) {
      Autobuyer.infinity.bumpLimit(4);
    }
    GameUI.notify.success(this.name);
    kong.submitAchievements();
    GameCache.achievementPower.invalidate();
    EventHub.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
  }

  get isEnabled() {
    return isAchEnabled(this.id);
  }

  get isEffectConditionSatisfied() {
    return this.config.effectCondition === undefined || this.config.effectCondition();
  }

  get canBeApplied() {
    return this.isEnabled && this.isEffectConditionSatisfied;
  }

  get secondaryEffect() {
    return this._secondaryState;
  }
}

AchievementState.createIndex(GameDatabase.achievements.normal);

/**
 * @param {number} id
 * @returns {AchievementState}
 */
const Achievement = id => AchievementState.index[id];

const Achievements = {
  /**
   * @type {AchievementState[]}
   */
  all: AchievementState.index.compact(),
  row: row => Array.range(row * 10 + 1, 8).map(Achievement)
};

class SecretAchievementState extends GameMechanicState {
  get name() {
    return this.config.name;
  }

  get isUnlocked() {
    return player.secretAchievements.has(this.id);
  }

  tryUnlock(a1, a2, a3) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(a1, a2, a3)) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return;
    player.secretAchievements.add(this.id);
    GameUI.notify.success(this.name);
    kong.submitAchievements();
    EventHub.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
  }
}

SecretAchievementState.createIndex(GameDatabase.achievements.secret);

/**
 * @param {number} id
 * @returns {SecretAchievementState}
 */
const SecretAchievement = id => SecretAchievementState.index[id];

const SecretAchievements = {
  /**
   * @type {SecretAchievementState[]}
   */
  all: SecretAchievementState.index.compact()
};

setInterval(() => Math.random() < 0.00001 && SecretAchievement(18).unlock(), 1000);

EventHub.registerStateCollectionEvents(
  Achievements.all.concat(SecretAchievements.all),
  achievement => achievement.config.checkEvent,
  // eslint-disable-next-line max-params
  (achievement, a1, a2, a3) => achievement.tryUnlock(a1, a2, a3)
);

class AchievementTimer {
  constructor() {
    this.time = 0;
  }
  
  reset() {
    this.time = 0;
  }
  
  advance() {
    this.time += player.options.updateRate / 1000;
  }
  
  check(condition, duration) {
    if (!condition) {
      this.reset();
      return false;
    }
    this.advance();
    return this.time >= duration;    
  }
}

const AchievementTimers = {
  marathon1: new AchievementTimer(),
  marathon2: new AchievementTimer(),
  pain: new AchievementTimer(),
  stats: new AchievementTimer()
};

function isAchEnabled(achId) {
  if (!player.achievements.has(achId)) return false;
  if (player.realities === 0) return true;
  if (achId > 140) return true;
  const row = Math.floor(achId / 10);
  if (row <= GameCache.achSkipPerkCount.value) return true;
  const currentSeconds = player.thisReality / 1000;
  return timeRequiredForAchievement(achId) <= currentSeconds;
}

function timeForAllAchievements() {
  if (GameCache.achSkipPerkCount.value === TOTAL_PRE_REALITY_ACH_ROWS) {
    return 0;
  }
  return totalAchRowTime(TOTAL_PRE_REALITY_ACH_ROWS - GameCache.achSkipPerkCount.value);
}

function nextAchIn() {
  updateRealityAchievementModifiers();
  const currentSeconds = player.thisReality / 1000;
  if (currentSeconds > timeForAllAchievements()) return 0;
  const baseAchTime = realityAchievementModifiers.baseAchTime;
  const rowModifier = realityAchievementModifiers.rowModifier;
  let timeReq = 0;

  let row = 1;
  function achTime() {
    return baseAchTime + ((row - 7) * rowModifier);
  }
  function rowTime() {
    return achTime() * ACH_PER_ROW;
  }

  while (currentSeconds > timeReq + rowTime()) {
    timeReq += rowTime();
    row++;
  }

  while (currentSeconds > timeReq) {
    timeReq += achTime();
  }
  return (timeReq - currentSeconds) * 1000;
}

function timeUntilAch(achId) {
  if (achId > 140 || isNaN(achId)) return NaN;
  if (!player.achievements.has(achId)) return NaN;
  const row = Math.floor(achId / 10);
  if (row <= GameCache.achSkipPerkCount.value) return NaN;
  const currentSeconds = player.thisReality / 1000;
  return timeRequiredForAchievement(achId) - currentSeconds;
}

function timeRequiredForAchievement(achId) {
  updateRealityAchievementModifiers();
  const baseAchTime = realityAchievementModifiers.baseAchTime;
  const rowModifier = realityAchievementModifiers.rowModifier;

  const row = Math.floor(achId / 10);
  const perkAdjustedRow = Math.clamp(row - GameCache.achSkipPerkCount.value, 1, row);
  const previousRowCount = perkAdjustedRow - 1;
  const previousRowsTime = totalAchRowTime(previousRowCount);
  const currentRowAchTime = baseAchTime + (perkAdjustedRow - 7) * rowModifier;
  const column = achId % 10;
  const currentRowTime = currentRowAchTime * column;
  return previousRowsTime + currentRowTime;
}

// Total time required for a row count if we go from the first perk-adjusted row
function totalAchRowTime(rowCount) {
  updateRealityAchievementModifiers();
  const baseAchTime = realityAchievementModifiers.baseAchTime;
  const rowModifier = realityAchievementModifiers.rowModifier;
  const achCount = rowCount * ACH_PER_ROW;
  // Unoptimized version
  // const achTime = row => baseAchTime + (row - 7) * rowModifier;
  // totalTime = 0;
  // for (let i = 1; i < row; i++) {
  //   totalTime += achTime(i) * 8
  // }
  return achCount * (baseAchTime + (rowCount - 13) * rowModifier / 2);
}

let realityAchievementModifiers = {
  realities: -1,
  baseAchTime: -1,
  rowModifier: -1,
  secondsForAllAchs: -1
};

const SECONDS_IN_DAY = TimeSpan.fromDays(1).totalSeconds;
const DAYS_FOR_ALL_ACHS = 2;
const DEFAULT_SECONDS_FOR_ALL_ACHS = SECONDS_IN_DAY * DAYS_FOR_ALL_ACHS;
const ACH_PER_ROW = 8;
const TOTAL_ACH_ROWS = 14;
const TOTAL_PRE_REALITY_ACH_ROWS = 13;
const TOTAL_PRE_REALITY_ACHS = TOTAL_PRE_REALITY_ACH_ROWS * ACH_PER_ROW;
const REDUCTION_PER_REALITY = 0.9;

// TODO: further optimization:
// pre-generate ach times on reality
function updateRealityAchievementModifiers() {
  if (realityAchievementModifiers.realities === player.realities) {
    return;
  }
  const requiredTimeModifier = Math.pow(REDUCTION_PER_REALITY, Math.max(player.realities - 1, 0));
  const secondsForAllAchs = DEFAULT_SECONDS_FOR_ALL_ACHS * requiredTimeModifier;
  realityAchievementModifiers = {
    realities: player.realities,
    // How much it takes for row 7 achievement to get
    baseAchTime: secondsForAllAchs / TOTAL_PRE_REALITY_ACHS,
    rowModifier: 100 * DAYS_FOR_ALL_ACHS * requiredTimeModifier,
    secondsForAllAchs
  };
}

function currentAchievementCount() {
  const additionalAchievements = Ra.has(RA_UNLOCKS.V_UNLOCK)
    ? Ra.pets.v.level
    : 0;
  return player.achievements.size + additionalAchievements;
}
