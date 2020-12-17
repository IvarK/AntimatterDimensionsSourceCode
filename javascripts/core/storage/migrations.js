"use strict";

// WARNING: Don't use state accessors and functions from global scope here, that's not safe in long-term
GameStorage.migrations = {
  patches: {
    1: player => {
      for (let i = 0; i < player.autobuyers.length; i++) {
        if (player.autobuyers[i] % 1 !== 0) {
          player.infinityPoints = player.infinityPoints.plus(player.autobuyers[i].cost - 1);
        }
      }
      player.autobuyers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    },
    2: player => {
      if (player.dimensionMultDecrease !== 10) {
        if (player.dimensionMultDecrease === 9) {
          player.dimensionMultDecrease = 10;
          player.dimensionMultDecreaseCost = 1e8;
          player.infinityPoints = player.infinityPoints.plus(1e8);
        }
        if (player.dimensionMultDecrease === 8) {
          player.dimensionMultDecrease = 10;
          player.dimensionMultDecreaseCost = 1e8;
          player.infinityPoints = player.infinityPoints.plus(2.1e9);
        }
        if (player.dimensionMultDecrease === 7) {
          player.dimensionMultDecrease = 10;
          player.dimensionMultDecreaseCost = 1e8;
          player.infinityPoints = player.infinityPoints.plus(4.21e10);
        }
      }
    },
    5: player => {
      player.newsArray = [];
    },
    9: player => {
      const achs = [];
      if (player.achievements.delete("r22")) achs.push("r35");
      if (player.achievements.delete("r35")) achs.push("r76");
      if (player.achievements.delete("r41")) achs.push("r22");
      if (player.achievements.delete("r76")) achs.push("r41");
      for (const id of achs) player.achievements.add(id);
      player.replicanti.intervalCost = player.replicanti.intervalCost.dividedBy(1e20);
    },
    9.5: player => {
      if (player.timestudy.studies.includes(191)) player.timestudy.theorem = player.timestudy.theorem.plus(100);
    },
    10: player => {
      if (player.timestudy.studies.includes(72)) {
        for (let i = 4; i < 8; i++) {
          player[`infinityDimension${i}`].amount = player[`infinityDimension${i}`].amount
            .div(Sacrifice.totalBoost.pow(0.02));
        }
      }
    },
    12: player => {
      const timeDimStartCosts = [null, 1, 5, 100, 1000];
      const timeDimCostMults = [null, 3, 9, 27, 81];
      // Updates TD costs to harsher scaling
      if (player.timeDimension1) {
        for (let i = 1; i < 5; i++) {
          if (new Decimal("1e300").lt(player[`timeDimension${i}`].cost)) {
            player[`timeDimension${i}`].cost = Decimal.pow(
              timeDimCostMults[i] * 2.2,
              player[`timeDimension${i}`].bought
            ).times(timeDimStartCosts[i]);
          }
        }
      }
    },
    12.1: player => {
      for (const achievement of player.achievements) {
        if (achievement.includes("s") && achievement.length <= 3) {
          player.achievements.splice(player.achievements.indexOf("r36"), 1);
          break;
        }
      }
    },
    13: player => {
      // 12.3 is currently on live, will be updated to 13 after release

      // TODO: REMOVE THE FOLLOWING LINE BEFORE RELEASE/MERGE FROM TEST
      if (isDevEnvironment()) GameStorage.devMigrations.setLatestTestVersion(player);

      // Last update version check, fix emoji/cancer issue, account for new handling of r85/r93 rewards,
      // change diff value from 1/10 of a second to 1/1000 of a second, delete pointless properties from player
      // And all other kinds of stuff
      if (player.achievements.includes("r85")) player.infMult = player.infMult.div(4);
      if (player.achievements.includes("r93")) player.infMult = player.infMult.div(4);

      player.realTimePlayed = player.totalTimePlayed;
      player.thisReality = player.totalTimePlayed;
      player.thisInfinityRealTime = player.thisInfinityTime * 100;
      player.thisEternityRealTime = player.thisEternity * 100;
      player.thisRealityRealTime = player.thisReality * 100;
      player.thisInfinityLastBuyTime = player.thisInfinityTime * 100;
      for (let i = 0; i < 10; i++) {
        player.lastTenEternities[i][2] = player.lastTenEternities[i][0];
        player.lastTenRuns[i][2] = player.lastTenRuns[i][0];
      }
      player.options.newUI = false;
      Modal.uiChoice.show();

      GameStorage.migrations.normalizeTimespans(player);
      GameStorage.migrations.convertAutobuyerMode(player);
      GameStorage.migrations.fixChallengeIds(player);
      GameStorage.migrations.adjustMultCosts(player);
      GameStorage.migrations.convertAchivementsToNumbers(player);
      GameStorage.migrations.adjustGameCreatedTime(player);
      GameStorage.migrations.moveSavedStudyTrees(player);
      GameStorage.migrations.convertEPMult(player);
      GameStorage.migrations.moveChallengeInfo(player);
      GameStorage.migrations.adjustWhy(player);
      GameStorage.migrations.adjustThemes(player);
      GameStorage.migrations.removeAchPow(player);
      GameStorage.migrations.adjustSacrificeConfirmation(player);
      GameStorage.migrations.migrateNotation(player);
      GameStorage.migrations.fixAutobuyers(player);
      GameStorage.migrations.removeAutoIPProperties(player);
      GameStorage.migrations.adjustAchievementVars(player);
      GameStorage.migrations.uniformDimensions(player);
      GameStorage.migrations.removeEternityChallGoal(player);
      GameStorage.migrations.clearNewsArray(player);
      GameStorage.migrations.removeTickspeed(player);
      GameStorage.migrations.removePostC3Reward(player);
      GameStorage.migrations.renameMoney(player);
      GameStorage.migrations.moveAutobuyers(player);
      GameStorage.migrations.convertNewsToSet(player);
      GameStorage.migrations.convertEternityCountToDecimal(player);
      GameStorage.migrations.renameDimboosts(player);
      GameStorage.migrations.migrateConfirmations(player);
      GameStorage.migrations.removeOtherTickspeedProps(player);
      GameStorage.migrations.renameNewsOption(player);
      GameStorage.migrations.removeDimensionCosts(player);
      GameStorage.migrations.changeC8Handling(player);
      GameStorage.migrations.convertAchievementsToBits(player);
      GameStorage.migrations.setNoInfinitiesOrEternitiesThisReality(player);
      GameStorage.migrations.setTutorialState(player);
      GameStorage.migrations.migrateLastTenRuns(player);
      GameStorage.migrations.migrateIPGen(player);
      GameStorage.migrations.renameCloudVariable(player);
      GameStorage.migrations.standardizeUncompletedTimes(player);
      GameStorage.migrations.makeRecords(player);
      GameStorage.migrations.deleteOldRecords(player);
      GameStorage.migrations.migrateAutobuyers(player);
      GameStorage.migrations.migratePlayerVars(player);

      kong.migratePurchases();
      if (player.eternityPoints.gt("1e6000")) player.saveOverThresholdFlag = true;
    }
  },

  normalizeTimespans(player) {
    player.realTimePlayed *= 100;
    player.totalTimePlayed *= 100;
    player.thisInfinityTime *= 100;
    player.thisEternity *= 100;
    player.thisReality *= 100;
    player.bestInfinityTime = player.bestInfinityTime === 9999999999
      ? 999999999999
      : player.bestInfinityTime * 100;
    player.bestEternity = player.bestEternity === 9999999999
      ? 999999999999
      : player.bestEternity * 100;
    for (let i = 0; i < 10; i++) {
      player.lastTenEternities[i][0] *= 100;
      player.lastTenRuns[i][0] *= 100;
      // Nowadays this would be player.lastTenEternities[i][3] *= 100;
      // However, this migration is done so early that it was player.lastTenEternities[i][2]
      // (but late enough that player.lastTenEternities[i][2] is defined).
      player.lastTenEternities[i][2] *= 100;
      player.lastTenRuns[i][2] *= 100;
    }

    if (player.challengeTimes) {
      player.challengeTimes = player.challengeTimes.map(e => e * 100);
    }
    if (player.infchallengeTimes) {
      player.infchallengeTimes = player.infchallengeTimes.map(e => e * 100);
    }
  },

  convertAutobuyerMode(player) {
    for (let i = 0; i < 8; i++) {
      const autobuyer = player.autobuyers[i];
      if (autobuyer % 1 !== 0) {
        if (autobuyer.target < 10) {
          autobuyer.target = AUTOBUYER_MODE.BUY_SINGLE;
        } else {
          autobuyer.target = AUTOBUYER_MODE.BUY_10;
        }
      }
    }
    const tickspeedAutobuyer = player.autobuyers[8];
    if (tickspeedAutobuyer % 1 !== 0) {
      if (tickspeedAutobuyer.target < 10) {
        tickspeedAutobuyer.target = AUTOBUYER_MODE.BUY_SINGLE;
      } else {
        tickspeedAutobuyer.target = AUTOBUYER_MODE.BUY_MAX;
      }
    }
  },

  fixChallengeIds(player) {
    let wasFucked = false;
    function unfuckChallengeId(id) {
      if (!id.startsWith("challenge")) return id;
      wasFucked = true;
      const legacyId = parseInt(id.substr(9), 10);
      const config = GameDatabase.challenges.normal.find(c => c.legacyId === legacyId);
      return `challenge${config.id}`;
    }
    player.currentChallenge = unfuckChallengeId(player.currentChallenge);
    player.challenges = player.challenges.map(unfuckChallengeId);
    if (wasFucked && player.challengeTimes) {
      player.challengeTimes = GameDatabase.challenges.normal
        .slice(1)
        .map(c => player.challengeTimes[c.legacyId - 2]);
    }
  },

  adjustMultCosts(player) {
    if (player.tickSpeedMultDecreaseCost !== undefined) {
      player.infinityRebuyables[0] = Math.round(Math.log(player.tickSpeedMultDecreaseCost / 3e6) / Math.log(5));
    }
    if (player.dimensionMultDecreaseCost !== undefined) {
      player.infinityRebuyables[1] = Math.round(Math.log(player.dimensionMultDecreaseCost / 1e8) / Math.log(5e3));
    }
    delete player.tickSpeedMultDecrease;
    delete player.tickSpeedMultDecreaseCost;
    delete player.dimensionMultDecrease;
    delete player.dimensionMultDecreaseCost;
  },

  convertAchivementsToNumbers(player) {
    if (player.achievements.length > 0 && player.achievements.every(e => typeof e === "number")) return;
    const old = player.achievements;
    // In this case, player.secretAchievements should be an empty set
    player.achievements = new Set();
    player.secretAchievements = new Set();
    for (const oldId of old) {
      const achByName = GameDatabase.achievements.normal.find(a => a.name === oldId);
      if (achByName !== undefined) {
        // Legacy format
        player.achievements.add(achByName.id);
        continue;
      }
      const newId = parseInt(oldId.slice(1), 10);
      if (isNaN(newId)) throw new Error(`Could not parse achievement id ${oldId}`);
      if (oldId.startsWith("r")) {
        if (GameDatabase.achievements.normal.find(a => a.id === newId) === undefined) {
          throw new Error(`Unrecognized achievement ${oldId}`);
        }
        player.achievements.add(newId);
      } else if (oldId.startsWith("s")) {
        if (GameDatabase.achievements.secret.find(a => a.id === newId) === undefined) {
          throw new Error(`Unrecognized secret achievement ${newId}`);
        }
        player.secretAchievements.add(newId);
      }
    }
  },

  adjustGameCreatedTime(player) {
    player.gameCreatedTime = player.lastUpdate - player.realTimePlayed;
  },

  moveSavedStudyTrees(player) {
    for (let num = 1; num <= 3; ++num) {
      const tree = localStorage.getItem(`studyTree${num}`);
      if (tree) player.timestudy.presets[num - 1].studies = tree;
    }
  },

  convertEPMult(player) {
    if (player.epmult === undefined) return;
    const mult = new Decimal(player.epmult);
    delete player.epmultCost;
    delete player.epmult;
    // The multiplier should never be less than 1, but we don't want to break anyone's save
    if (mult.lte(1)) {
      player.epmultUpgrades = 0;
      return;
    }
    player.epmultUpgrades = mult.log(5);
  },

  moveChallengeInfo(player) {
    function parseChallengeName(name) {
      if (name.startsWith("challenge")) {
        return { type: "normal", id: parseInt(name.slice(9), 10) };
      }
      if (name.startsWith("postc")) {
        return { type: "infinity", id: parseInt(name.slice(5), 10) };
      }
      if (name !== "") throw new Error(`Unrecognized challenge ID ${name}`);
      return null;
    }
    if (player.challengeTimes) {
      for (let i = 0; i < player.challengeTimes.length; ++i) {
        player.challenge.normal.bestTimes[i] = Math.min(player.challenge.normal.bestTimes[i],
          player.challengeTimes[i]);
      }
      delete player.challengeTimes;
    }
    if (player.infchallengeTimes) {
      for (let i = 0; i < player.infchallengeTimes.length; ++i) {
        player.challenge.infinity.bestTimes[i] = Math.min(player.challenge.infinity.bestTimes[i],
          player.infchallengeTimes[i]);
      }
      delete player.infchallengeTimes;
    }
    if (player.currentChallenge !== undefined) {
      const saved = parseChallengeName(player.currentChallenge);
      delete player.currentChallenge;
      if (saved) {
        player.challenge[saved.type].current = saved.id;
      }
    }
    if (player.challenges) {
      for (const fullID of player.challenges) {
        const parsed = parseChallengeName(fullID);
        // eslint-disable-next-line no-bitwise
        player.challenge[parsed.type].completedBits |= 1 << parsed.id;
      }
      delete player.challenges;
    }
    if (player.currentEternityChall !== undefined) {
      const saved = player.currentEternityChall;
      delete player.currentEternityChall;
      if (saved.startsWith("eterc")) {
        player.challenge.eternity.current = parseInt(saved.slice(5), 10);
      } else if (saved !== "") throw new Error(`Unrecognized eternity challenge ${saved}`);
    }
    if (player.eternityChallUnlocked !== undefined) {
      player.challenge.eternity.unlocked = player.eternityChallUnlocked;
      delete player.eternityChallUnlocked;
    }
    delete player.challengeTarget;
  },

  adjustWhy(player) {
    delete player.why;
  },

  adjustAchievementVars(player) {
    player.achievementChecks.onlyFirstDimensions = player.dead;
    delete player.dead;
    player.achievementChecks.onlyEighthDimensions = player.dimlife;
    delete player.dimlife;
    // Just initialize all these to false, which is basically always correct.
    player.achievementChecks.noAntimatterProduced = false;
    player.achievementChecks.noFirstDimensions = false;
    player.achievementChecks.noEighthDimensions = false;
    // If someone has 0 max replicanti galaxies, they can't have gotten any.
    // If they have more than 0 max replicanti galaxies, we don't give them
    // the benefit of the doubt.
    player.achievementChecks.noReplicantiGalaxies = player.replicanti.gal === 0;
    if (
      player.timestudy.theorem.gt(0) ||
      player.timestudy.studies.length > 0 ||
      player.challenge.eternity.unlocked !== 0
    ) player.achievementChecks.noTheoremPurchases = false;
    if (player.sacrificed.gt(0)) player.achievementChecks.noSacrifices = false;
  },

  adjustThemes(player) {
    delete player.options.themes;
    if (player.options.theme === undefined) player.options.theme = "Normal";
    delete player.options.secretThemeKey;
  },

  removeAchPow(player) {
    delete player.achPow;
  },

  adjustSacrificeConfirmation(player) {
    if (player.options.sacrificeConfirmation !== undefined) {
      player.options.confirmations.sacrifice = player.options.sacrificeConfirmation;
      delete player.options.sacrificeConfirmation;
    }
  },

  migrateNotation(player) {
    const notation = player.options.notation;
    if (notation === undefined) {
      player.options.notation = "Standard";
    }
    const notationMigration = {
      "Mixed": "Mixed scientific",
      "Default": "Brackets",
      "Emojis": "Cancer"
    };
    if (notationMigration[notation] !== undefined) {
      player.options.notation = notationMigration[notation];
    }
  },

  fixAutobuyers(player) {
    for (let i = 0; i < 12; i++) {
      if (player.autobuyers[i] % 1 !== 0 && player.autobuyers[i].target % 1 !== 0) {
        player.autobuyers[i].target = AUTOBUYER_MODE.BUY_SINGLE;
      }

      if (
        player.autobuyers[i] % 1 !== 0 &&
          (player.autobuyers[i].bulk === undefined ||
            isNaN(player.autobuyers[i].bulk) ||
            player.autobuyers[i].bulk === null)
      ) {
        player.autobuyers[i].bulk = 1;
      }
    }
    if (typeof player.autobuyers[9] !== "number" && typeof player.autobuyers[9].bulk !== "number") {
      player.autobuyers[9].bulk = 1;
    }
    if (
      player.autobuyers[11] % 1 !== 0 &&
      player.autobuyers[11].priority !== undefined &&
      player.autobuyers[11].priority !== null &&
      player.autobuyers[11].priority !== "undefined"
    ) {
      player.autobuyers[11].priority = new Decimal(player.autobuyers[11].priority);
    }
  },

  removeAutoIPProperties(player) {
    delete player.autoIP;
    delete player.autoTime;
  },

  removeEternityChallGoal(player) {
    delete player.eternityChallGoal;
  },

  clearNewsArray(player) {
    player.newsArray = [];
  },

  removeTickspeed(player) {
    delete player.tickspeed;
    player.tickSpeedCost = new Decimal(1000);
    player.tickspeedMultiplier = new Decimal(10);
  },

  removeOtherTickspeedProps(player) {
    delete player.tickSpeedCost;
    delete player.tickspeedMultiplier;
  },

  renameNewsOption(player) {
    player.options.news.enabled = !player.options.newsHidden;
    delete player.options.newsHidden;
  },

  removeDimensionCosts(player) {
    for (const dimension of player.dimensions.antimatter) {
      delete dimension.cost;
      delete dimension.costMultiplier;
    }
  },

  renameTickspeedPurchaseBumps(player) {
    if (player.chall9TickspeedPurchaseBumps !== undefined) {
      player.chall9TickspeedCostBumps = player.chall9TickspeedPurchaseBumps;
      delete player.chall9TickspeedPurchaseBumps;
    }
  },

  removePostC3Reward(player) {
    delete player.postC3Reward;
  },

  renameMoney(player) {
    player.antimatter = new Decimal(player.money);
    player.totalAntimatter = new Decimal(player.totalmoney);
    delete player.money;
    delete player.totalmoney;
  },

  uniformDimensions(player) {
    for (let tier = 1; tier <= 8; tier++) {
      const name = [null, "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eight"][tier];
      const oldProps = {
        cost: `${name}Cost`,
        amount: `${name}Amount`,
        bought: `${name}Bought`,
        pow: `${name}Pow`
      };
      const dimension = player.dimensions.antimatter[tier - 1];
      dimension.cost = new Decimal(player[oldProps.cost]);
      dimension.amount = new Decimal(player[oldProps.amount]);
      dimension.bought = player[oldProps.bought];
      if (player.costmultipliers) {
        dimension.costMultiplier = new Decimal(player.costMultipliers[tier - 1]);
      }
      delete player[oldProps.cost];
      delete player[oldProps.amount];
      delete player[oldProps.bought];
      delete player[oldProps.pow];
    }
    delete player.costMultipliers;

    if (player.infinityDimension1) {
      for (let tier = 1; tier <= 8; tier++) {
        const dimension = player.dimensions.infinity[tier - 1];
        const oldName = `infinityDimension${tier}`;
        const old = player[oldName];
        dimension.cost = new Decimal(old.cost);
        dimension.amount = new Decimal(old.amount);
        dimension.bought = old.bought;
        dimension.baseAmount = old.baseAmount;
        dimension.isUnlocked = player.infDimensionsUnlocked[tier - 1];
        delete player[oldName];
      }
      delete player.infDimensionsUnlocked;
    }

    if (player.timeDimension1) {
      for (let tier = 1; tier <= 8; tier++) {
        const dimension = player.dimensions.time[tier - 1];
        const oldName = `timeDimension${tier}`;
        const old = player[oldName];
        if (old !== undefined) {
          dimension.cost = new Decimal(old.cost);
          dimension.amount = new Decimal(old.amount);
          dimension.bought = old.bought;
          delete player[oldName];
        }
      }
    }
  },

  moveAutobuyers(player) {
    if (
      player.autobuyers[11] % 1 !== 0 &&
      player.autobuyers[11].priority !== undefined &&
      player.autobuyers[11].priority !== null &&
      player.autobuyers[11].priority !== "undefined"
    ) {
      player.autobuyers[11].priority = new Decimal(player.autobuyers[11].priority);
    }

    for (let i = 0; i < 8; i++) {
      const old = player.autobuyers[i];
      if (old % 1 === 0) continue;
      const autobuyer = player.auto.dimensions[i];
      autobuyer.cost = old.cost;
      autobuyer.interval = old.interval;
      autobuyer.bulk = old.bulk;
      autobuyer.mode = old.target;
      autobuyer.priority = old.priority;
      autobuyer.isActive = old.isOn;
      autobuyer.lastTick = player.realTimePlayed;
    }

    if (player.autobuyers[8] % 1 !== 0) {
      const old = player.autobuyers[8];
      const autobuyer = player.auto.tickspeed;
      autobuyer.cost = old.cost;
      autobuyer.interval = old.interval;
      autobuyer.mode = old.target;
      autobuyer.priority = old.priority;
      autobuyer.isActive = old.isOn;
      autobuyer.lastTick = player.realTimePlayed;
    }

    if (player.autobuyers[9] % 1 !== 0) {
      const old = player.autobuyers[9];
      const autobuyer = player.auto.dimBoost;
      autobuyer.cost = old.cost;
      autobuyer.interval = old.interval;
      autobuyer.maxDimBoosts = old.priority;
      autobuyer.galaxies = player.overXGalaxies;
      autobuyer.bulk = old.bulk;
      autobuyer.buyMaxInterval = old.bulk;
      autobuyer.isActive = old.isOn;
      autobuyer.lastTick = player.realTimePlayed;
    }

    delete player.overXGalaxies;

    if (player.autobuyers[10] % 1 !== 0) {
      const old = player.autobuyers[10];
      const autobuyer = player.auto.galaxy;
      autobuyer.cost = old.cost;
      autobuyer.interval = old.interval;
      autobuyer.maxGalaxies = old.priority;
      autobuyer.buyMaxInterval = old.bulk;
      autobuyer.buyMax = old.bulk > 0;
      autobuyer.isActive = old.isOn;
      autobuyer.lastTick = player.realTimePlayed;
    }

    if (player.autobuyers[11] % 1 !== 0) {
      const old = player.autobuyers[11];
      const autobuyer = player.auto.bigCrunch;
      autobuyer.cost = old.cost;
      autobuyer.interval = old.interval;
      autobuyer.mode = ["amount", "time", "relative"].indexOf(player.autoCrunchMode);
      const condition = new Decimal(old.priority);
      switch (player.autoCrunchMode) {
        case "amount":
          autobuyer.amount = condition;
          break;
        case "time":
          autobuyer.time = condition.lt(Decimal.NUMBER_MAX_VALUE) ? condition.toNumber() : autobuyer.time;
          break;
        case "relative":
          autobuyer.xCurrent = condition;
          break;
      }
      autobuyer.isActive = old.isOn;
      autobuyer.lastTick = player.realTimePlayed;
    }

    delete player.autoCrunchMode;
    delete player.autobuyers;

    if (player.autoSacrifice && player.autoSacrifice % 1 !== 0) {
      const old = player.autoSacrifice;
      const autobuyer = player.auto.sacrifice;
      autobuyer.multiplier = new Decimal(old.priority);
      autobuyer.isActive = old.isOn;
    }

    delete player.autoSacrifice;

    if (player.eternityBuyer !== undefined) {
      const old = player.eternityBuyer;
      const autobuyer = player.auto.eternity;
      // Development saves have additional modes
      if (player.autoEternityMode === undefined) {
        autobuyer.time = Number(old.limit);
      }
      autobuyer.isActive = old.isOn;
    }

    delete player.eternityBuyer;
  },

  convertNewsToSet(player) {
    player.news = new Set(player.newsArray);
    delete player.newsArray;
  },

  convertEternityCountToDecimal(player) {
    player.eternities = new Decimal(player.eternities);
    player.reality.partEternitied = new Decimal(player.reality.partEternitied);
  },

  renameDimboosts(player) {
    player.dimensionBoosts = player.resets;
    delete player.resets;
  },

  migrateConfirmations(player) {
    player.options.confirmations.challenges = !player.options.challConf;
    delete player.options.challConf;
    player.options.confirmations.eternity = player.options.eternityconfirm;
    delete player.options.eternityconfirm;

    // This did nothing on live and continues to do nothing...?
    delete player.tickDecrease;
  },

  changeC8Handling(player) {
    player.chall8TotalSacrifice = Decimal.pow(player.chall11Pow, 2);
    delete player.chall11Pow;
  },

  convertAchievementsToBits(player) {
    // Also switches achievement positions
    const swaps = { "4,3": "6,4", "6,4": "7,7", "7,7": "4,3", "10,1": "11,7", "11,7": "10,1" };
    const convertAchievementArray = (newAchievements, oldAchievements) => {
      for (const oldId of oldAchievements) {
        let row = Math.floor(oldId / 10);
        let column = oldId % 10;
        // eslint-disable-next-line no-bitwise
        if (
          [row, column].join(",") in swaps) {
          [row, column] = swaps[[row, column].join(",")].split(",");
        }
        // eslint-disable-next-line no-bitwise
        newAchievements[row - 1] |= (1 << (column - 1));
      }
    };

    player.achievementBits = Array.repeat(0, 15);
    convertAchievementArray(player.achievementBits, player.achievements);
    delete player.achievements;

    player.secretAchievementBits = Array.repeat(0, 4);
    convertAchievementArray(player.secretAchievementBits, player.secretAchievements);
    delete player.secretAchievements;
  },

  setNoInfinitiesOrEternitiesThisReality(player) {
    player.achievementChecks.noInfinitiesThisReality = player.infinitied.eq(0) && player.eternities.eq(0);
    player.achievementChecks.noEternitiesThisReality = player.eternities.eq(0);
  },

  setTutorialState(player) {
    if (player.infinitied.gt(0) || player.eternities.gt(0) || player.realities > 0 || player.galaxies > 0) {
      player.tutorialState = 4;
    } else if (player.dimensionBoosts > 0) player.tutorialState = TUTORIAL_STATE.GALAXY;
  },

  migrateLastTenRuns(player) {
    // Move infinities before time in infinity, and make them Decimal.
    // I know new Decimal(x).toNumber() can't actually be the best way of converting a value
    // that might be either Decimal or number to number, but it's the best way I know.
    player.lastTenRuns = player.lastTenRuns.map(
      x => [x[0], x[1], new Decimal(x[3]), new Decimal(x[2]).toNumber()]);
    // Put in a default value of 1 for eternities.
    player.lastTenEternities = player.lastTenEternities.map(
      x => [x[0], x[1], new Decimal(1), new Decimal(x[2]).toNumber()]);
  },

  migrateIPGen(player) {
    player.infinityRebuyables.push(player.offlineProd / 5);
    delete player.offlineProd;
    delete player.offlineProdCost;
  },

  renameCloudVariable(player) {
    player.options.cloudEnabled = player.options.cloud;
    delete player.options.cloud;
  },

  standardizeUncompletedTimes(player) {
    if (player.bestInfinityTime === 999999999999) player.bestInfinityTime = Number.MAX_VALUE;
    if (player.bestInfinityRealTime === 999999999999) player.bestInfinityRealTime = Number.MAX_VALUE;
    if (player.bestEternity === 999999999999) player.bestEternity = Number.MAX_VALUE;
    for (let i = 0; i < player.challenge.normal.bestTimes.length; i++) {
      if (player.challenge.normal.bestTimes[i] === 2678400000) player.challenge.normal.bestTimes[i] = Number.MAX_VALUE;
    }
    for (let i = 0; i < player.challenge.infinity.bestTimes.length; i++) {
      if (player.challenge.infinity.bestTimes[i] === 2678400000) {
        player.challenge.infinity.bestTimes[i] = Number.MAX_VALUE;
      }
    }
    for (let i = 0; i < 10; i++) {
      if (player.lastTenRuns[i][0] === 2678400000) player.lastTenRuns[i][0] = Number.MAX_VALUE;
      if (player.lastTenRuns[i][3] === 26784000) player.lastTenRuns[i][3] = Number.MAX_VALUE;
      if (player.lastTenEternities[i][0] === 2678400000) player.lastTenEternities[i][0] = Number.MAX_VALUE;
      if (player.lastTenEternities[i][3] === 26784000) player.lastTenEternities[i][3] = Number.MAX_VALUE;
    }
  },

  makeRecords(player) {
    player.records.gameCreatedTime = player.gameCreatedTime;
    player.records.totalTimePlayed = player.totalTimePlayed;
    player.records.realTimePlayed = player.realTimePlayed;
    player.records.totalAntimatter = new Decimal(player.totalAntimatter);
    player.records.lastTenInfinities = player.lastTenRuns;
    player.records.lastTenEternities = player.lastTenEternities;
    for (let i = 0; i < 10; i++) {
      player.records.lastTenInfinities[i][1] = new Decimal(player.lastTenRuns[i][1]);
      player.records.lastTenEternities[i][1] = new Decimal(player.lastTenEternities[i][1]);
    }
    player.records.thisInfinity.time = player.thisInfinityTime;
    player.records.bestInfinity.time = player.bestInfinityTime;
    player.records.thisEternity.time = player.thisEternity;
    player.records.bestEternity.time = player.bestEternity;
    player.records.thisReality.time = player.thisReality;
  },

  deleteOldRecords(player) {
    delete player.gameCreatedTime;
    delete player.totalTimePlayed;
    delete player.realTimePlayed;
    delete player.totalAntimatter;
    delete player.lastTenRuns;
    delete player.lastTenEternities;
    delete player.thisInfinityTime;
    delete player.bestInfinityTime;
    delete player.thisEternity;
    delete player.bestEternity;
    delete player.thisReality;
  },

  migrateAutobuyers(player) {
    player.auto.bulkOn = player.options.bulkOn;
    player.auto.autobuyerOn = player.options.autobuyerOn;

    delete player.options.bulkOn;
    delete player.options.autobuyerOn;
  },

  migratePlayerVars(player) {
    player.replicanti.boughtGalaxyCap = player.replicanti.gal;
    player.dilation.totalTachyonGalaxies = player.dilation.freeGalaxies;

    delete player.replicanti.gal;
    delete player.dilation.freeGalaxies;
  },

  prePatch(saveData) {
    // Initialize all possibly undefined properties that were not present in
    // previous versions and which could be overwritten by deepmerge
    saveData.totalAntimatter = saveData.totalAntimatter || saveData.totalmoney || saveData.money;
    saveData.thisEternity = saveData.thisEternity || saveData.totalTimePlayed;
    saveData.version = saveData.version || 0;
  },

  patch(saveData) {
    this.prePatch(saveData);
    // This adds all the undefined properties to the save which are in player.js
    const player = deepmerge.all([Player.defaultStart, saveData]);
    const versions = Object.keys(this.patches)
      .map(parseFloat)
      .sort();
    let version;
    while ((version = versions.find(v => player.version < v)) !== undefined) {
      const patch = this.patches[version];
      patch(player);
      player.version = version;
    }
    return player;
  },
};
