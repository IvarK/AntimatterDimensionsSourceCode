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
  
  tryUnlock() {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement()) return;
    this.unlock();
  }

  unlock() {
    if (this.isUnlocked) return false;
    player.achievements.add(this.id);
    if (this.id === 85 || this.id === 93) {
      Autobuyer.infinity.bumpLimit(4);
    }
    GameUI.notify.success(this.name);
    kong.submitAchievements();
    GameCache.achievementPower.invalidate();
    GameUI.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
    return true;
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

/**
 * @type {AchievementState[]}
 */
AchievementState.list = mapGameData(
  GameDatabase.achievements.normal,
  data => new AchievementState(data)
);

/**
 * @param {number} id
 * @returns {AchievementState}
 */
function Achievement(id) {
  return AchievementState.list[id];
}

const Achievements = {
  /**
   * @type {AchievementState[]}
   */
  list: AchievementState.list.compact(),  
  byName: AchievementState.list.compact().mapToObject(ach => ach.name, ach => ach),  
  row: row => Array.range(1, 8).map(column => Achievement(row * 10 + column)),
  tryUnlock: ids => {
    for (const id of ids) Achievement(id).tryUnlock();
  }
};

class SecretAchievementState extends GameMechanicState {
  get name() {
    return this.config.name;
  }

  get isUnlocked() {
    return player.secretAchievements.has(this.id);
  }

  unlock() {
    if (this.isUnlocked) return false;
    player.secretAchievements.add(this.id);
    GameUI.notify.success(this.name);
    kong.submitAchievements();
    GameUI.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
    return true;
  }
}

SecretAchievementState.list = mapGameData(
  GameDatabase.achievements.secret,
  data => new SecretAchievementState(data)
);

/**
 * @param {number} id
 * @returns {SecretAchievementState}
 */
function SecretAchievement(id) {
  return SecretAchievementState.list[id];
}

const SecretAchievements = {
  /**
   * @type {SecretAchievementState[]}
   */
  list: SecretAchievementState.list.compact(),
  byName: SecretAchievementState.list.compact().mapToObject(ach => ach.name, ach => ach),
};

function clearOldAchieves() {
  const oldIdMatch = /^[rs][1-9][0-9]+/u;
  for (const achId of player.achievements) {
    // Numeric ID's are the new thing, leave them alone
    if (!isNaN(parseInt(achId, 10))) continue;
    // ID's like r123 and s123 are pre-version 13; we let the version update code handle them
    if (oldIdMatch.test(achId)) continue;
    const achByName = Achievements.byName[achId];
    if (achByName !== undefined) {
      player.achievements.delete(achByName.name);
      player.achievements.add(achByName.id);
      continue;
    }
    if (Achievement(achId) === undefined) {
      player.achievements.delete(achId);
    }
  }
}

function giveAchievement(name) {
  const achievement = Achievements.byName[name] || SecretAchievements.byName[name];
  if (achievement === undefined) throw crash(`giveAchievement of unknown "${name}"`);
  if (!achievement.unlock()) return;
  GameUI.notify.success(name);
  kong.submitStats("Achievements", player.achievements.size + player.secretAchievements.size);
  GameCache.achievementPower.invalidate();
  GameUI.dispatch(GameEvent.ACHIEVEMENT_UNLOCKED);
}

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
  let currentSeconds = player.thisReality / 1000;
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
  return (timeReq - currentSeconds) * 1000
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

// TODO: further optimization:
// pre-generate ach times on reality
function updateRealityAchievementModifiers() {
  if (realityAchievementModifiers.realities === player.realities) {
    return;
  }
  const requiredTimeModifier = Math.pow(0.9, Math.max(player.realities - 1, 0));
  const secondsForAllAchs = DEFAULT_SECONDS_FOR_ALL_ACHS * requiredTimeModifier;
  realityAchievementModifiers = {
    realities: player.realities,
    // how much it takes for row 7 achievement to get
    baseAchTime: secondsForAllAchs / TOTAL_PRE_REALITY_ACHS,
    rowModifier: 100 * DAYS_FOR_ALL_ACHS * requiredTimeModifier,
    secondsForAllAchs: secondsForAllAchs
  };
}
