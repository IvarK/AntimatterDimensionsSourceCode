import { deepmergeAll } from "@/utility/deepmerge";

// WARNING: Don't use state accessors and functions from global scope here, that's not safe in long-term
export const migrations = {
  firstRealityMigration: 13,
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
          player[`infinityDimension${i}`].amount = Decimal.div(player[`infinityDimension${i}`].amount,
            Sacrifice.totalBoost.pow(0.02));
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

      // Last update version check, fix emoji/cancer issue,
      // change diff value from 1/10 of a second to 1/1000 of a second, delete pointless properties from player
      // And all other kinds of stuff
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
      window.uiChoiceModalInterval = setInterval(() => {
        if (GameUI.initialized) {
          Modal.uiChoice.show();
          clearInterval(window.uiChoiceModalInterval);
        }
      }, 1000);

      migrations.normalizeTimespans(player);
      migrations.convertAutobuyerMode(player);
      migrations.fixChallengeIds(player);
      migrations.adjustMultCosts(player);
      migrations.convertAchivementsToNumbers(player);
      migrations.adjustGameCreatedTime(player);
      migrations.moveSavedStudyTrees(player);
      migrations.convertEPMult(player);
      migrations.moveChallengeInfo(player);
      migrations.infinitiedConversion(player);
      migrations.adjustWhy(player);
      migrations.removeAchPow(player);
      migrations.adjustSacrificeConfirmation(player);
      migrations.migrateNotation(player);
      migrations.fixAutobuyers(player);
      migrations.removeAutoIPProperties(player);
      migrations.adjustAchievementVars(player);
      migrations.uniformDimensions(player);
      migrations.removeEternityChallGoal(player);
      migrations.removeTickspeed(player);
      migrations.removePostC3Reward(player);
      migrations.renameMoney(player);
      migrations.moveAutobuyers(player);
      migrations.convertEternityCountToDecimal(player);
      migrations.renameDimboosts(player);
      migrations.migrateConfirmations(player);
      migrations.removeOtherTickspeedProps(player);
      migrations.renameNewsOption(player);
      migrations.removeDimensionCosts(player);
      migrations.changeC8Handling(player);
      migrations.convertAchievementsToBits(player);
      migrations.setNoInfinitiesOrEternitiesThisReality(player);
      migrations.setTutorialState(player);
      migrations.migrateLastTenRuns(player);
      migrations.migrateIPGen(player);
      migrations.renameCloudVariable(player);
      migrations.standardizeUncompletedTimes(player);
      migrations.makeRecords(player);
      migrations.deleteOldRecords(player);
      migrations.migrateAutobuyers(player);
      migrations.migratePlayerVars(player);
      migrations.consolidateAuto(player);
      migrations.convertTimeTheoremPurchases(player);
      migrations.deleteDimboostBulk(player);
      migrations.deleteFloatingTextOption(player);
      migrations.refactorDoubleIPRebuyable(player);
      migrations.infMultNameConversion(player);
      migrations.convertNews(player);
      migrations.etercreqConversion(player);
      migrations.moveTS33(player);
      migrations.addBestPrestigeCurrency(player);
      migrations.migrateTheme(player);
    },

    // ALL MIGRATIONS BELOW THIS POINT ARE POST-RELEASE FOR THE REALITY UPDATE! THE PRECEEDING MIGRATION (13) IS
    // THE FIRST MIGRATION WHICH DOES THE MAJORITY OF DATA FORMAT CHANGES

    14: player => {
      migrations.reworkBHPulsing(player);

      // Added glyph auto-sort by level; in order to keep the button state cycling consistent with the sort buttons' UI
      // order, AUTO_SORT_MODE had to be changed to insert LEVEL mode at the top and shift the others down. This
      // makes sure that older saves maintain the same settings after this shift
      if (player.reality.autoSort !== 0) player.reality.autoSort++;
    },
    15: player => {
      // Added additional resource tracking in last 10 prestige records and adjusted data format to be more consistent
      // by reordering to be [game time, real time, prestige currency, prestige count, challenge, ...(other resources)]
      // Also fixes a migration bug where values could be undefined or null by assigning defaults when necessary
      for (let i = 0; i < 10; i++) {
        if (player.records.lastTenInfinities) {
          const infRec = player.records.lastTenInfinities[i];
          player.records.recentInfinities[i] = [
            infRec[0] ?? Number.MAX_VALUE,
            Number(infRec[3] ?? Number.MAX_VALUE),
            new Decimal(infRec[1] ?? 1),
            new Decimal(infRec[2] ?? 1),
            ""
          ];
        }

        if (player.records.lastTenEternities) {
          const eterRec = player.records.lastTenEternities[i];
          player.records.recentEternities[i] = [
            eterRec[0] ?? Number.MAX_VALUE,
            Number(eterRec[3] ?? Number.MAX_VALUE),
            new Decimal(eterRec[1] ?? 1),
            new Decimal(eterRec[2] ?? 1),
            "",
            new Decimal(0)
          ];
        }

        if (player.records.lastTenRealities) {
          const realRec = player.records.lastTenRealities[i];
          player.records.recentRealities[i] = [
            realRec[0] ?? Number.MAX_VALUE,
            Number(realRec[3] ?? Number.MAX_VALUE),
            new Decimal(realRec[1] ?? 1),
            realRec[2] ?? 1,
            "",
            0,
            0
          ];
        }
      }

      delete player.records.lastTenInfinities;
      delete player.records.lastTenEternities;
      delete player.records.lastTenRealities;
      delete player.options.showLastTenResourceGain;

      // Fixes a desync which occasionally causes unique > total seen due to total not being updated properly
      if (player.news.seen) {
        let unique = 0;
        for (const bitmaskArray of Object.values(player.news.seen)) {
          for (const bitmask of bitmaskArray) {
            unique += countValuesFromBitmask(bitmask);
          }
        }
        player.news.totalSeen = Math.max(player.news.totalSeen, unique);
      }
    },
    16: player => {
      // Migrate perk layouts to the new format which has more than a boolean toggle
      player.options.perkLayout = player.options.fixedPerkStartingPos ? 0 : 1;
      delete player.options.fixedPerkStartingPos;

      // This won't preserve *current* glyph choices, but is necessary to give uniformity moving forward. We need to
      // prevent either seed from being 0 due to it being a special case that freezes up the RNG code
      player.reality.initialSeed = player.reality.seed;
      if (player.reality.initialSeed === 0) player.reality.initialSeed = 1;

      // In order to add cross-run speedrun time tracking without inflating savefile size too much, there was a
      // refactor which changed the format from an object with a bunch of named props, to an array of times using
      // the key-id pairs in GameDatabase.speedrunMilestones
      const newArr = Array.repeat(0, 26);
      for (const entry of GameDatabase.speedrunMilestones) {
        newArr[entry.id] = player.speedrun.records[entry.key];
      }
      player.speedrun.records = newArr;
      player.speedrun.seedSelection = SPEEDRUN_SEED_STATE.UNKNOWN;

      // This contains redundant info and was never cleaned up during the initial implementation
      delete player.speedrun.milestones;

      // Add more glyph presets (older version had only 5, now default is 7)
      while (player.reality.glyphs.sets.length < 7) {
        player.reality.glyphs.sets.push({ name: "", glyphs: [] });
      }
    },
    17: player => {
      // Moved all multiplier tab attributes to be scoped, and added replicanti subtab in the middle to preserve
      // progression order - shift it up as needed in order to keep players on the same subtab
      const oldSubtab = player.options.currentMultiplierSubtab ?? 0;
      player.options.multiplierTab.currTab = oldSubtab + (oldSubtab > 5 ? 1 : 0);
      delete player.options.currentMultiplierSubtab;
    },
    18: player => {
      // These two props are technically redundant in their values, but we always update both in tandem in order
      // to ensure a consistent UI sort order. However, before this version the sort order didn't exist, so we have
      // to immediately fill it
      player.reality.automator.constantSortOrder = Object.keys(player.reality.automator.constants);
    },
    19: player => {
      // This was removed in favor of the more generic "Exit challenge" modal, but a few references were missing and
      // this prop was left in the save file instead of being cleaned up
      delete player.options.confirmations.resetCelestial;
    },
    20: player => {
      // GLYPH FILTER INTERNAL FORMAT REFACTOR
      // For the case of importing a save created before the reality update, many of these props are undefined due to
      // having never been in the player object in the first place. In this case we fill with defaults, which are mostly
      // zeroes. Otherwise we do our best to transfer over all the data we can

      // Move all the filter props out of celestial/effarig scope and into reality/glyph scope, renaming a few of them.
      const effarig = player.celestials.effarig;
      player.reality.glyphs.filter = {
        select: effarig?.mode ?? 0,
        trash: effarig?.glyphTrashMode ?? 0,
        simple: effarig?.simpleEffectCount ?? 0
      };

      // There are a few big things going on in this loop which are annotated within, but this largely transfers all the
      // old filter data into the new prop
      const reducedFilter = {};
      const effectDB = Object.values(GameDatabase.reality.glyphEffects);
      // The previous filter format had entries for companion/reality/cursed glyphs, which are removed by only copying
      // the types in ALCHEMY_BASIC_GLYPH_TYPES. Any errors which show up elsewhere for have also been resolved
      for (const type of ALCHEMY_BASIC_GLYPH_TYPES) {
        const oldData = effarig.glyphScoreSettings?.types[type];
        const typeEffects = effectDB
          .filter(t => t.glyphTypes.includes(type))
          .sort((a, b) => a.bitmaskIndex - b.bitmaskIndex);

        // Two of these effects were renamed to be shorter
        reducedFilter[type] = {
          rarity: oldData?.rarityThreshold ?? 0,
          score: oldData?.scoreThreshold ?? 0,
          effectCount: oldData?.effectCount ?? 0,
        };

        // These all used to stored as { effectKey: value } where effectKey is the ID string "powerpow" or similar,
        // but have now been refactored to be stored as a bitmask and Number array instead. This significantly shortens
        // filter data for serialization into glyph filter export strings
        reducedFilter[type].specifiedMask = 0;
        reducedFilter[type].effectScores = [];
        if (!oldData) continue;
        for (const effect of typeEffects) {
          // The way we filter to generate typeEffects also gives an undefined entry which needs to be ignored
          if (!effect) continue;
          reducedFilter[type].specifiedMask |= oldData.effectChoices[effect.id] ? 1 << effect.bitmaskIndex : 0;
          reducedFilter[type].effectScores.push(oldData.effectScores[effect.id]);
        }
      }
      player.reality.glyphs.filter.types = reducedFilter;

      // Remove the old data after copying it all over
      delete player.celestials.effarig.glyphScoreSettings;
      delete player.celestials.effarig.glyphTrashMode;

      // EFFARIG GLYPH INTERNAL CHANGE
      // In order to display all effarig glyph effects in "celestial order" we needed to either special-case a ton
      // of UI code, or migrate all existing saves - the latter option seems safer and less likely to lead to repeated
      // bug reports related to Vue reactivity. Worst case scenario if something is incorrect here is that some people
      // will have some slightly weird saves. We don't need to modify the glyph filter settings here because these are
      // migrated above by their effect keys; this properly places them into the correct bit positions automatically
      const updateBitmask = bitmask => {
        const modifiedBits = [20, 21, 22].map(b => 1 << b).sum();
        const foundBits = [20, 21, 22].map(b => (bitmask & (1 << b)) !== 0);
        foundBits.push(foundBits.shift());
        let newSubmask = 0;
        for (let bit = 20; bit <= 22; bit++) {
          if (foundBits[bit - 20]) newSubmask |= 1 << bit;
        }
        return (bitmask & ~modifiedBits) | newSubmask;
      };
      const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
      for (const glyph of allGlyphs) glyph.effects = updateBitmask(glyph.effects);

      // We also need to update glyphs that appear in the statistics tab records too
      const glyphSetProps = ["RMSet", "RMminSet", "glyphLevelSet", "bestEPSet", "speedSet", "iMCapSet", "laitelaSet"];
      for (const prop of glyphSetProps) {
        const glyphSet = player.records.bestReality[prop];
        for (const glyph of glyphSet) glyph.effects = updateBitmask(glyph.effects);
      }

      // Glyph light/dark formatting was refactored as well; these values are in reference to the GLYPH_BG_SETTING enum
      player.options.glyphBG = player.options.lightGlyphs ? 1 : 2;
      delete player.options.lightGlyphs;
    },
    21: player => {
      // Added tracking for unlocked ECs even after they re-lock - makes old save data consistent
      for (let ec = 1; ec <= 12; ec++) {
        if (player.eternityChalls[`eterc${ec}`] > 0) player.reality.unlockedEC |= 1 << ec;
      }

      // Added max RM tracking for cel1 records - also for data consistency (though not 100% accurate)
      player.reality.maxRM = new Decimal(player.reality.realityMachines);
    },
    22: player => {
      // Added 3 new perk layouts, inserted before blob
      if (player.options.perkLayout > 2) player.options.perkLayout += 3;

      // Changed recent prestige tab to allow for more than just gain rate and absolute gain
      player.options.statTabResources = player.options.showRecentRate ? 1 : 0;
      delete player.options.showRecentRate;

      // Added iM cap value to recent realities
      for (let index = 0; index < player.records.recentRealities.length; index++) {
        player.records.recentRealities[index].push(0);
      }

      // This seems to have slipped through in some edge cases due to an old botched migration
      if (player.options.themeClassic === undefined) player.options.themeClassic = "Normal";
      if (player.options.themeModern === undefined) player.options.themeModern = "Normal";

      // The glyph uniformity change did a few things to migrate old seeds as best it could, but it also had the
      // side-effect of relying on player initialization and deepmerge for randomization in many cases. This made
      // all existing pre-reality saves get initialized with a seed of 1, which we forcibly randomize here.
      // A "valid" save can potentially get messed up, but this is exceedingly rare and impossible to detect
      const newSeed = Math.floor(Date.now() * Math.random() + 1);
      if (player.reality.seed === 1) player.reality.seed = newSeed;
      if (player.reality.initialSeed === 1) player.reality.initialSeed = newSeed;
    },
    23: player => {
      // We missed presets in effarig format migration
      const updateBitmask = bitmask => {
        const modifiedBits = [20, 21, 22].map(b => 1 << b).sum();
        const foundBits = [20, 21, 22].map(b => (bitmask & (1 << b)) !== 0);
        foundBits.push(foundBits.shift());
        let newSubmask = 0;
        for (let bit = 20; bit <= 22; bit++) {
          if (foundBits[bit - 20]) newSubmask |= 1 << bit;
        }
        return (bitmask & ~modifiedBits) | newSubmask;
      };
      for (const preset of player.reality.glyphs.sets) {
        for (const glyph of preset.glyphs) {
          glyph.effects = updateBitmask(glyph.effects);
        }
      }
    },
    24: player => {
      // Automator constants didn't copy over properly across new games - retroactively fix bugged saves as well
      const definedConstants = Object.keys(player.reality.automator.constants);
      if (definedConstants.length !== player.reality.automator.constantSortOrder.length) {
        player.reality.automator.constantSortOrder = [...definedConstants];
      }
    },
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
    player.requirementChecks.permanent.singleTickspeed = player.why ?? 0;
    delete player.why;
  },

  adjustAchievementVars(player) {
    player.requirementChecks.eternity.onlyAD1 = player.dead;
    delete player.dead;
    player.requirementChecks.eternity.onlyAD8 = player.dimlife;
    delete player.dimlife;
    // Just initialize all these to false, which is basically always correct.
    player.requirementChecks.reality.noAM = false;
    player.requirementChecks.eternity.noAD1 = false;
    player.requirementChecks.infinity.noAD8 = false;
    // If someone has 0 max replicanti galaxies, they can't have gotten any.
    // If they have more than 0 max replicanti galaxies, we don't give them
    // the benefit of the doubt.
    player.requirementChecks.eternity.noRG = player.replicanti.gal === 0;
    if (
      player.timestudy.theorem.gt(0) ||
      player.timestudy.studies.length > 0 ||
      player.challenge.eternity.unlocked !== 0
    ) player.requirementChecks.reality.noPurchasedTT = false;
    if (player.sacrificed.gt(0)) player.requirementChecks.infinity.noSacrifice = false;
    player.requirementChecks.permanent.emojiGalaxies = player.spreadingCancer;
    delete player.spreadingCancer;
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
      const autobuyer = player.auto.antimatterDims.all[i];
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
          autobuyer.xHighest = condition;
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

  convertNews(player) {
    if (player.newsArray === undefined) {
      player.newsArray = [];
    } else {
      player.newsArray = player.newsArray.map(x => (typeof(x) === "number" ? `a${x}` : x));
    }
    const oldNewsArray = new Set(player.newsArray);
    player.news = {};
    player.news.seen = {};
    player.news.specialTickerData = {
      uselessNewsClicks: 0,
      paperclips: 0,
      newsQueuePosition: 1000,
      eiffelTowerChapter: 0
    };

    // This loop is copied more or less straight out of NewsHandler.addSeenNews with the extraneous comments and
    // spacing removed. There was something strange with variable scoping that was causing player.news.seen to be
    // updated within NewsHandler, but then immediately becoming empty again once we were back at this level of
    // function calls (ie. out of the scope of NewsHandler). Sloppy, but nevertheless it does seem to work.
    const maskLength = NewsHandler.BITS_PER_MASK;
    for (const id of oldNewsArray) {
      const groups = id.match(/([a-z]+)(\d+)/u);
      const type = groups[1];
      const number = parseInt(groups[2], 10);
      if (!player.news.seen[type]) player.news.seen[type] = [];
      while (maskLength * player.news.seen[type].length < number) player.news.seen[type].push(0);
      player.news.seen[type][Math.floor(number / maskLength)] |= 1 << (number % maskLength);
    }

    player.news.totalSeen = NewsHandler.uniqueTickersSeen;
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
    // So far there've been three swaps
    // (1) a three-way swap of zero deaths, 1 million is a lot, and antitables
    // (2) a two-way swap of costco sells dimboosts now and 8 nobody got time for that
    // (3) a two-way swap of long lasting relationship and eternities are the new infinity
    const swaps = { "4,3": "6,4", "6,4": "7,7", "7,7": "4,3",
      "10,1": "11,7", "11,7": "10,1", "11,3": "12,4", "12,4": "11,3" };
    const convertAchievementArray = (newAchievements, oldAchievements, isSecret) => {
      for (const oldId of oldAchievements) {
        let row = Math.floor(oldId / 10);
        let column = oldId % 10;
        if (!isSecret && [row, column].join(",") in swaps) {
          [row, column] = swaps[[row, column].join(",")].split(",");
        }
        newAchievements[row - 1] |= (1 << (column - 1));
      }
      // Handle the changed achievement "No DLC Required" correctly (otherwise saves could miss it).
      if (!isSecret && (player.infinityUpgrades.size >= 16 || player.eternities.gt(0) || player.realities > 0)) {
        newAchievements[3] |= 1;
      } else {
        newAchievements[3] &= ~1;
      }

      // "Professional Bodybuilder" (s38) was changed and shouldn't be migrated
      if (isSecret) {
        newAchievements[2] &= ~128;
      }
    };

    player.achievementBits = Array.repeat(0, 15);
    convertAchievementArray(player.achievementBits, player.achievements, false);
    delete player.achievements;

    player.secretAchievementBits = Array.repeat(0, 4);
    convertAchievementArray(player.secretAchievementBits, player.secretAchievements, true);
    delete player.secretAchievements;
  },

  setNoInfinitiesOrEternitiesThisReality(player) {
    player.requirementChecks.reality.noInfinities = player.infinities.eq(0) && player.eternities.eq(0);
    player.requirementChecks.reality.noEternities = player.eternities.eq(0);
  },

  setTutorialState(player) {
    if (player.infinities.gt(0) || player.eternities.gt(0) || player.realities > 0 || player.galaxies > 0) {
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
    player.infinityRebuyables[2] = player.offlineProd / 5;
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
    player.records.thisInfinity.realTime = player.thisInfinityTime;
    player.records.bestInfinity.time = player.bestInfinityTime;
    player.records.thisEternity.time = player.thisEternity;
    player.records.thisEternity.realTime = player.thisEternity;
    player.records.bestEternity.time = player.bestEternity;
    player.records.thisReality.time = player.thisReality;
    player.records.thisReality.realTime = player.thisReality;
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

  consolidateAuto(player) {
    for (let i = 0; i < 8; i++) {
      player.auto.infinityDims.all[i].isActive = player.infDimBuyers[i];
    }
    for (let i = 0; i < 3; i++) {
      player.auto.replicantiUpgrades.all[i].isActive = player.replicanti.auto[i];
    }
    player.auto.replicantiGalaxies.isActive = player.replicanti.galaxybuyer;
    player.auto.ipMultBuyer.isActive = player.infMultBuyer;

    delete player.infDimBuyers;
    delete player.auto.infDimTimer;
    delete player.replicanti.galaxybuyer;
    delete player.replicanti.auto;
    delete player.auto.repUpgradeTimer;
    delete player.infMultBuyer;
  },

  convertTimeTheoremPurchases(player) {
    player.timestudy.amBought = new Decimal(player.timestudy.amcost).exponent / 20000 - 1;
    player.timestudy.ipBought = new Decimal(player.timestudy.ipcost).exponent / 100;
    player.timestudy.epBought = Math.round(new Decimal(player.timestudy.epcost).log2());

    delete player.timestudy.amcost;
    delete player.timestudy.ipcost;
    delete player.timestudy.epcost;
  },

  infinitiedConversion(player) {
    player.infinities = new Decimal(player.infinitied);
    player.infinitiesBanked = new Decimal(player.infinitiedBank);

    delete player.infinitied;
    delete player.infinitiedBank;
  },

  deleteDimboostBulk(player) {
    delete player.auto.dimBoost.bulk;
    if (player.infinityUpgrades.delete("bulkBoost")) {
      player.infinityUpgrades.add("autobuyMaxDimboosts");
    }
  },

  removePriority(player) {
    const dims = player.auto.antimatterDims.all ?? player.auto.antimatterDims;
    for (let i = 0; i < 8; i++) {
      delete dims[i].priority;
    }
    delete player.auto.tickspeed.priority;
  },

  deleteFloatingTextOption(player) {
    delete player.options.animations.floatingText;
  },

  refactorDoubleIPRebuyable(player) {
    // A bit of a hack, but needs to be done this way to not trigger the non-Decimal assignment crash check code
    const purchases = new Decimal(player.infMult).log2();
    delete player.infMult;
    player.infMult = Math.round(purchases);
    delete player.infMultCost;
  },

  deletePostChallUnlocked(player) {
    delete player.postChallUnlocked;
  },

  infMultNameConversion(player) {
    player.IPMultPurchases = player.infMult;
    delete player.infMult;
  },

  etercreqConversion(player) {
    if (player.etercreq) player.challenge.eternity.requirementBits |= 1 << player.etercreq;
    delete player.etercreq;
  },

  moveTS33(player) {
    if (player.timestudy.studies.includes(33) && !player.timestudy.studies.includes(22)) {
      player.timestudy.studies.splice(player.timestudy.studies.indexOf(33), 1);
      player.timestudy.theorem = new Decimal(player.timestudy.theorem).plus(2);
    }
  },

  addBestPrestigeCurrency(player) {
    player.records.thisReality.maxEP = player.eternityPoints;
    player.records.bestReality.bestEP = player.eternityPoints;
    player.records.thisEternity.maxIP = player.infinityPoints;
    player.records.thisReality.maxIP = player.infinityPoints;
  },

  migrateTheme(player) {
    player.options.themeClassic = player.options.theme === undefined
      ? "Normal"
      : player.options.theme;
    delete player.options.themes;
    delete player.options.secretThemeKey;
  },

  // This change removed the ability to adjust stored time rate after Ra-Nameless 10, instead forcing it to be 99%
  reworkBHPulsing(player) {
    delete player.celestials.enslaved.storedFraction;
  },

  prePatch(saveData) {
    // Initialize all possibly undefined properties that were not present in
    // previous versions and which could be overwritten by deepmerge
    saveData.totalAntimatter = saveData.totalAntimatter || saveData.totalmoney || saveData.money;
    saveData.thisEternity = saveData.thisEternity || saveData.totalTimePlayed;
    saveData.version = saveData.version || 0;
  },

  // Patch up to the specified version; we need this functionality in order to properly migrate both saves from
  // much older versions and saves from in-development versions
  patch(saveData, maxVersion) {
    this.prePatch(saveData);
    // This adds all the undefined properties to the save which are in player.js
    const player = deepmergeAll([Player.defaultStart, saveData]);
    const versions = Object.keys(this.patches).map(parseFloat).sort();
    let version;
    while ((version = versions.find(v => player.version < v && v < maxVersion)) !== undefined) {
      const patch = this.patches[version];
      patch(player);
      player.version = version;
    }
    return player;
  },

  patchPreReality(saveData) {
    return this.patch(saveData, this.firstRealityMigration);
  },

  patchPostReality(saveData) {
    // Plus 1 because this the threshold is exclusive (it migrates up to but not including the maxVersion)
    return this.patch(saveData, Object.keys(migrations.patches).map(k => Number(k)).max() + 1);
  }
};
