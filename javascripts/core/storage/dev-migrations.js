"use strict";

function arrayToBits(array) {
  let bits = 0;
  // eslint-disable-next-line no-bitwise
  for (const id of array) bits |= (1 << id);
  return bits;
}

// WARNING: Don't use state accessors and functions from global scope here, that's not safe in long-term
GameStorage.devMigrations = {
  patches: [
    player => {
      GameStorage.migrations.normalizeTimespans(player);
      player.bestReality = player.bestReality === 9999999999
        ? 999999999999
        : player.bestReality * 100;
      for (let i = 0; i < 10; i++) {
        player.lastTenRealities[i][0] *= 100;
      }
    },
    player => {
      player.reality.glyphs.last = "";
    },
    player => {
      player.secretUnlocks.themes = [];
    },
    player => {
      player.wormhole.power *= 36;
    },
    player => {
      player.reality.rebuyables = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (let i = 1; i < 6; i++) {
        if (player.reality.upg.includes(i)) {
          player.reality.rebuyables[i] = 1;
          player.reality.upg.splice(player.reality.upg.indexOf(i), 1);
        }
      }
    },
    player => {
      player.reality.tdbuyer = {
        on: false,
        threshhold: 1
      };
      player.reality.epmultbuyer = {
        on: false,
        threshhold: 1
      };
    },
    player => {
      player.reality.perks = new Set();
    },
    player => {
      player.reality.pp = 0;
    },
    player => {
      player.reality.pp = player.realities;
    },
    player => {
      // Give starting perk
      if (player.reality.pp > 0) {
        player.reality.pp -= 1;
        player.reality.perks.add(0);
      }
    },
    player => {
      // Var for s45
      player.secretUnlocks.dragging = 0;
    },
    player => {
      for (let i = 0; i < player.reality.glyphs.active.length; i++) {
        const glyph = player.reality.glyphs.active[i];
        if (glyph.effects.autochall !== undefined) {
          delete glyph.effects.autochall;
          glyph.effects.buy10 = 1 + Math.pow(glyph.level * glyph.strength, 0.8) / 10;
        }
      }

      for (let i = 0; i < player.reality.glyphs.inventory.length; i++) {
        const glyph = player.reality.glyphs.inventory[i];
        if (glyph.effects.autochall !== undefined) {
          delete glyph.effects.autochall;
          glyph.effects.buy10 = 1 + Math.pow(glyph.level * glyph.strength, 0.8) / 10;
        }
      }
    },
    player => {
      player.reality.upgReqs.push(false, false, false, false, false);
    },
    player => {
      player.reality.realityMachines = new Decimal(player.reality.realityMachines);
    },
    player => {
      player.reality.glyphs.sac = {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0,
      };
    },
    player => {
      player.wormhole.pause = false;
    },
    player => {
      player.wormholePause = false;
      if (player.wormhole[0] !== undefined) return;
      player.wormhole = [
        player.wormhole,
        {
          speed: 60 * 6,
          power: 90,
          duration: 7,
          phase: 0,
          active: false,
          unlocked: false,
        },
        {
          speed: 6 * 6,
          power: 45,
          duration: 4,
          phase: 0,
          active: false,
          unlocked: false,
        }
      ];
    },
    player => {
      if (player.reality.upg.includes(20)) {
        player.wormhole[1].unlocked = true;
      }
    },
    player => {
      player.reality.upgReqs.push(false, false, false, false, false);
    },
    player => {
      player.reality.tdbuyer = undefined;
      player.reality.tdbuyers = [false, false, false, false, false, false, false, false];
      player.reality.epmultbuyer = false;
    },
    player => {
      if (!["rm", "glyph", "either", "both"].includes(player.autoRealityMode)) {
        player.autoRealityMode = "rm";
      }
    },
    GameStorage.migrations.convertAutobuyerMode,
    player => {
      for (const key in player.celestials.effarig.glyphWeights) {
        player.celestials.effarig.glyphWeights[key] *= 100;
      }
    },
    player => {
      // The previous migration didn't work if loading a test save before celestials were added, whoops
      for (const key in player.celestials.effarig.glyphWeights) {
        player.celestials.effarig.glyphWeights[key] = 25;
      }
    },
    // eslint-disable-next-line no-unused-vars
    player => {
      // The following patch is deeply incompatible with current player object:
      // Patch that changes wormhole => black hole will be applied later in this patch chain
      // (see the warning at the top of this file)

      // Following logic from autobuyers (before the addition of wall clock time stats)
      // const speedup = getGameSpeedupFactor([GAME_SPEED_EFFECT.EC12, GAME_SPEED_EFFECT.WORMHOLE]);
      // player.thisInfinityRealTime = Time.thisInfinity.totalSeconds / speedup;
      // player.thisEternityRealTime = Time.thisEternity.totalSeconds / speedup;
      // player.thisRealityRealTime = Time.thisReality.totalSeconds / speedup;
      // for (var i=0; i<10; i++) {
      //   player.lastTenRuns[i][2] = undefined;
      //   player.lastTenEternities[i][2] = undefined;
      //   player.lastTenRealities[i][3] = undefined;
      // }

      // For anyone who is looking at this part of the code for debugging purposes, note that GAME_SPEED_EFFECT.EC12
      // has been replaced by GAME_SPEED_EFFECT.FIXED_SPEED since EC12 is no longer the only fixed-speed effect
    },
    GameStorage.migrations.fixChallengeIds,
    GameStorage.migrations.adjustMultCosts,
    player => {
      const teresa = player.celestials.effarig;
      player.celestials.effarig = player.celestials.teresa;
      player.celestials.teresa = teresa;

      for (const i in player.reality.glyphs.active) {
        const g = player.reality.glyphs.active[i];
        if (g.type === "teresa") {
          g.type = "effarig";
        }
      }

      for (const i in player.reality.glyphs.inventory) {
        const g = player.reality.glyphs.inventory[i];
        if (g.type === "teresa") {
          g.type = "effarig";
        }
      }
    },
    player => {
      // The previous migration messed things up pretty badly. The swap was done
      // after deepmerge with defaultPlayer, which means that default values got added correctly,
      // and then swapped into the incorrect place. We can blow away glyph weights and auto sac
      // settings
      // eslint-disable-next-line max-params
      function movePropIfPossible(celestial1, celestial2, prop, defaultValue, merge = null) {
        if (player.celestials[celestial1][prop] !== undefined) {
          if (player.celestials[celestial2][prop] === undefined) {
            player.celestials[celestial2][prop] = player.celestials[celestial1][prop];
          } else if (merge) {
            player.celestials[celestial2][prop] = merge(player.celestials[celestial1][prop],
              player.celestials[celestial2][prop]);
          }
          delete player.celestials[celestial1][prop];
        } else if (player.celestials[celestial2][prop] === undefined) {
          // Both undefined shouldn't really happen, but might as well be thorough here
          player.celestials[celestial2][prop] = defaultValue;
        }
      }
      movePropIfPossible("teresa", "effarig", "glyphWeights", {
        ep: 25,
        repl: 25,
        dt: 25,
        eternities: 25
      });
      // There was a big glyph filter refactor done at some point, and it's infeasible to properly preserve old
      // filter settings through this old migration. Any imported saves from before the Teresa/Effarig name swap
      // which had glyph filtering unlocked are likely going to be invalid as a result.
      movePropIfPossible("teresa", "effarig", "autoGlyphSac", {
        mode: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
        types: GlyphTypes.list.mapToObject(t => t.id, t => ({
          rarityThreshold: 0,
          scoreThreshold: 0,
          effectScores: t.effects.mapToObject(e => e.id, () => 0),
        })),
      });
      movePropIfPossible("teresa", "effarig", "autoGlyphPick", {
        mode: AUTO_GLYPH_REJECT.SACRIFICE,
      });
      movePropIfPossible("teresa", "effarig", "relicShards", 0, Math.max);
      movePropIfPossible("effarig", "teresa", "quoteIdx", 0);
      movePropIfPossible("effarig", "teresa", "bestRunAM", 0, Decimal.max);
      movePropIfPossible("effarig", "teresa", "rmStore", 0, Math.max);
      movePropIfPossible("effarig", "teresa", "glyphLevelMult", 1, Math.max);
      movePropIfPossible("effarig", "teresa", "rmMult", 1, Math.max);
      movePropIfPossible("effarig", "teresa", "dtBulk", 1, Math.max);
      // These are unused now
      delete player.celestials.effarig.typePriorityOrder;
      delete player.celestials.teresa.typePriorityOrder;
    },
    player => {
      player.blackHole = player.wormhole;
      player.blackHolePause = player.wormholePause;
      delete player.wormhole;
      delete player.wormholePause;
    },
    player => {
      for (let i = 0; i < player.blackHole.length; i++) {
        player.blackHole[i].id = i;
        player.blackHole[i].intervalUpgrades = Math.round(
          Math.log(player.blackHole[i].speed / (3600 / (Math.pow(10, i)))) / Math.log(0.8)
        );
        player.blackHole[i].powerUpgrades = Math.round(
          Math.log(player.blackHole[i].power / (180 / Math.pow(2, i))) / Math.log(1.35)
        );
        player.blackHole[i].durationUpgrades = Math.round(
          Math.log(player.blackHole[i].duration / (10 - i * 3)) / Math.log(1.3)
        );
        delete player.blackHole[i].speed;
        delete player.blackHole[i].power;
        delete player.blackHole[i].duration;
      }
    },
    () => {
      // This migration was created by a mistake
    },
    GameStorage.migrations.convertAchivementsToNumbers,
    GameStorage.migrations.adjustGameCreatedTime,
    GameStorage.migrations.moveSavedStudyTrees,
    player => {
      // Leftover stuff from dev.updateTestSave
      if (player.celestials.teresa.rmStore > Teresa.rmStoreMax) {
        player.reality.realityMachines =
          player.reality.realityMachines.plus(player.celestials.teresa.rmStore - Teresa.rmStoreMax);
        player.celestials.teresa.rmStore = Teresa.rmStoreMax;
      }
      if (player.reality.upg) {
        player.reality.upgradeBits = arrayToBits(player.reality.upg);
        delete player.reality.upg;
      }
      // eslint-disable-next-line no-bitwise
      if ((player.reality.upgradeBits & (1 << 25)) === 0) {
        player.realityBuyer.isOn = false;
      }
      for (let i = 0; i < player.reality.glyphs.active.length; i++) {
        const glyph = player.reality.glyphs.active[i];
        if (glyph.type === "power" && glyph.effects.mult !== undefined) {
          glyph.effects.mult = new Decimal(glyph.effects.mult);
        }
      }

      for (let i = 0; i < player.reality.glyphs.inventory.length; i++) {
        const glyph = player.reality.glyphs.inventory[i];
        if (glyph.type === "power" && glyph.effects.mult !== undefined) {
          glyph.effects.mult = new Decimal(glyph.effects.mult);
        }
      }
    },
    GameStorage.migrations.convertEPMult,
    GameStorage.migrations.moveChallengeInfo,
    GameStorage.migrations.adjustWhy,
    GameStorage.migrations.adjustThemes,
    GameStorage.migrations.removeAchPow,
    GameStorage.migrations.adjustSacrificeConfirmation,
    GameStorage.migrations.migrateNotation,
    GameStorage.migrations.fixAutobuyers,
    GameStorage.migrations.removeAutoIPProperties,
    player => {
      // Swapping glyph level with reality real time
      player.lastTenRealities = player.lastTenRealities
        .map(a => [a[0], a[1], a[3], a[2]]);
    },
    player => {
      player.achievements.delete(157);
      player.achievements.delete(156);
      player.achievements.delete(155);
      player.achievements.delete(153);
      // Have to call this a second time, as player.why wasn't removed from the player.js the first time
      GameStorage.migrations.adjustWhy(player);
      GameStorage.migrations.adjustAchievementVars(player);
    },
    GameStorage.migrations.uniformDimensions,
    GameStorage.migrations.removeEternityChallGoal,
    player => {
      // There were 3 black holes in player object
      delete player.blackHole.pop();
    },
    player => {
      const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
      for (let i = 0; i < allGlyphs.length; i++) {
        allGlyphs[i].id = i;
      }
    },
    // eslint-disable-next-line no-unused-vars
    player => {
      // This used to clearNewsArray, which cleared all news entries completely. Unsure what exactly that accomplished,
      // but convertNews should accomplish the same migration purpose. However, this entry still needs to stay here as
      // a no-op because otherwise save conversion will have an off-by-one error and generally break entirely.
    },
    player => {
      GameStorage.migrations.removeTickspeed(player);
      GameStorage.migrations.removePostC3Reward(player);
    },
    player => {
      const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
      for (const glyph of allGlyphs) {
        let effectBitmask = 0;
        for (const effect of orderedEffectList) {
          const typeEffect = separateEffectKey(effect);
          if (glyph.type === typeEffect[0] && glyph.effects[typeEffect[1]] !== undefined) {
            // eslint-disable-next-line no-bitwise
            effectBitmask += 1 << GameDatabase.reality.glyphEffects[effect].bitmaskIndex;
          }
        }
        glyph.effects = effectBitmask;
      }
    },
    // Ra exp formula changed
    player => {
      const pets = player.celestials.ra.pets;
      for (const prop in pets) {
        if (!Object.prototype.hasOwnProperty.call(pets, prop)) continue;
        const pet = pets[prop];
        const oldExp = pet.exp + 10000 * (Math.pow(1.12, pet.level - 1) - 1) / (0.12);
        pet.level = 1;
        pet.exp = Math.clampMin(oldExp, 0);
      }
      player.celestials.ra.unlocks = [];
    },
    // Ra exp formula changed again
    player => {
      const pets = player.celestials.ra.pets;
      for (const prop in pets) {
        if (!Object.prototype.hasOwnProperty.call(pets, prop)) continue;
        const pet = pets[prop];
        let oldExp = pet.exp;
        for (let lv = 1; lv < pet.level; lv++) {
          const floor5 = Math.floor(lv / 5);
          const adjustedLevel = 2.5 * floor5 * (floor5 + 1) + (lv % 5) * (floor5 + 1);
          oldExp += Math.floor(10000 * Math.pow(1.12, adjustedLevel - 1));
        }
        pet.level = 1;
        pet.exp = Math.clampMin(oldExp, 0);
      }
      player.celestials.ra.unlocks = [];
    },
    GameStorage.migrations.renameMoney,
    player => {
      GameStorage.migrations.moveAutobuyers(player);
      const old = player.realityBuyer;
      const realityAutobuyer = player.auto.reality;
      realityAutobuyer.mode = ["rm", "glyph", "either", "both"].indexOf(player.autoRealityMode);
      realityAutobuyer.rm = old.rm;
      realityAutobuyer.glyph = old.glyph;
      realityAutobuyer.isActive = old.isOn;

      const eternityAutobuyer = player.auto.eternity;
      eternityAutobuyer.mode = ["amount", "time", "relative"].indexOf(player.autoEternityMode);
      const condition = new Decimal(old.limit);
      switch (player.autoEternityMode) {
        case "amount":
          eternityAutobuyer.amount = condition;
          break;
        case "time":
          eternityAutobuyer.time = condition.lt(Decimal.NUMBER_MAX_VALUE)
            ? condition.toNumber()
            : eternityAutobuyer.time;
          break;
        case "relative":
          eternityAutobuyer.xLast = condition;
          break;
      }

      delete player.realityBuyer;
      delete player.autoRealityMode;
      delete player.autoEternityMode;
    },
    GameStorage.migrations.convertNews,
    GameStorage.migrations.convertEternityCountToDecimal,
    GameStorage.migrations.renameDimboosts,
    player => {
      // Reset reality autobuyer mode, since AUTO_REALITY_MODE was incorrectly starting from 1 and not from 0.
      // Disable it also to not wreck people's long runs or smth
      player.auto.reality.mode = 0;
      player.auto.reality.isActive = false;
    },
    player => {
      // Perk shop refactor
      player.celestials.teresa.perkShop = [
        Math.floor(Math.log(player.celestials.teresa.glyphLevelMult) / Math.log(1.05)),
        Math.floor(Math.log(player.celestials.teresa.rmMult) / Math.log(2)),
        Math.floor(Math.log(player.celestials.teresa.dtBulk) / Math.log(2)),
        0];
      delete player.celestials.teresa.glyphLevelMult;
      delete player.celestials.teresa.rmMult;
      delete player.celestials.teresa.dtBulk;
    },
    GameStorage.migrations.migrateConfirmations,
    GameStorage.migrations.removeOtherTickspeedProps,
    player => {
      // These were accidentally added back in due to a bad merge conflict resolution
      delete player.resets;
      delete player.tickDecrease;
    },
    GameStorage.migrations.renameNewsOption,
    GameStorage.migrations.removeDimensionCosts,
    GameStorage.migrations.renameTickspeedPurchaseBumps,
    player => {
      player.celestials.teresa.unlockBits = arrayToBits(player.celestials.teresa.unlocks);
      delete player.celestials.teresa.unlocks;
      player.celestials.effarig.unlockBits = arrayToBits(player.celestials.effarig.unlocks);
      delete player.celestials.effarig.unlocks;
      player.celestials.v.unlockBits = arrayToBits(player.celestials.v.unlocks);
      delete player.celestials.v.unlocks;
      player.celestials.ra.unlockBits = arrayToBits(player.celestials.ra.unlocks);
      delete player.celestials.ra.unlocks;
      player.celestials.laitela.unlockBits = arrayToBits(player.celestials.laitela.unlocks);
      delete player.celestials.laitela.unlocks;
    },
    player => {
      player.reality.seed = Math.floor(Math.abs(player.reality.seed)) % 0xFFFFFFFF;
    },
    player => {
      player.auto.sacrifice.multiplier = new Decimal(player.auto.sacrifice.multiplier);
    },
    GameStorage.migrations.changeC8Handling,
    player => {
      while (player.celestials.teresa.perkShop.length < 5) player.celestials.teresa.perkShop.push(0);
    },
    player => {
      delete player.secretUnlocks.fixed;
    },
    player => {
      delete player.celestials.effarig.quoteIdx;
      delete player.celestials.enslaved.quoteIdx;
    },
    player => {
      const tempAuto = player.celestials.teresa.perkShop[4];
      const tempMusic = player.celestials.teresa.perkShop[3];
      player.celestials.teresa.perkShop[3] = tempAuto;
      player.celestials.teresa.perkShop[4] = tempMusic;
    },
    GameStorage.migrations.convertAchievementsToBits,
    player => {
      for (const dimension of player.dimensions.antimatter) {
        delete dimension.power;
      }
      for (const dimension of player.dimensions.infinity) {
        delete dimension.power;
      }
      for (const dimension of player.dimensions.time) {
        delete dimension.power;
      }
    },
    player => {
      const cursedMask = 15;
      const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
      for (const glyph of allGlyphs) {
        if (glyph.type === "cursed") glyph.effects = cursedMask;
      }
    },
    player => {
      player.options.showHintText.alchemy = player.options.showAlchemyResources;
      delete player.options.showAlchemyResources;
    },
    player => {
      // Adds in effect selection settings and removes non-generated types while preserving old glyph filter settings
      const oldSettings = player.celestials.effarig.autoGlyphSac.types;
      const newSettings = GlyphTypes.list
        .filter(type => generatedTypes.includes(type.id))
        .mapToObject(t => t.id, t => ({
          rarityThreshold: 0,
          scoreThreshold: 0,
          effectCount: 0,
          effectChoices: t.effects.mapToObject(e => e.id, () => false),
          effectScores: t.effects.mapToObject(e => e.id, () => 0),
        }));
      for (const type of generatedTypes) {
        newSettings[type].rarityThreshold = oldSettings[type].rarityThreshold;
        newSettings[type].scoreThreshold = oldSettings[type].scoreThreshold;
        for (const effect of Object.keys(newSettings[type].effectScores)) {
          newSettings[type].effectScores[effect] = oldSettings[type].effectScores[effect];
        }
      }
      player.celestials.effarig.autoGlyphSac.types = newSettings;
    },
    player => {
      player.reality.glyphs.inventorySize += 10;
    },
    player => {
      player.celestials.v.unlockBits = 0;
      // Adding this in case the player is loading a save (otherwise it
      // doesn't update immediately and the player still has nonzero ST
      // for the purpose of checking unlocks).
      V.updateTotalRunUnlocks();
      V.checkForUnlocks();
    },
    player => {
      // Reset the v-unlocks again
      player.celestials.v.unlockBits = 0;
      // See above migration for an explanation of the below line.
      V.updateTotalRunUnlocks();
      V.checkForUnlocks();
    },
    player => {
      player.reality.autoAchieve = !player.reality.disableAutoAchieve;
      delete player.reality.disableAutoAchieve;
      delete player.newEC10Test;
    },
    player => {
      // Some older saves have screwed up Ra unlocks for some reason, this should fix that
      player.celestials.ra.unlockBits = 0;
      Ra.checkForUnlocks();
    },
    player => {
      // Required for compatibility after V records refactor
      player.celestials.v.runRecords[0] = -10;
    },
    player => {
      delete player.celestials.v.cursedThisRun;
    },
    player => {
      // Reset Ra unlocks again, because apparently Ra-Teresa Lv1 upgrades were always active due to an oversight
      player.celestials.ra.unlockBits = 0;
      Ra.checkForUnlocks();
    },
    player => {
      // Glyph filter refactor (not worth the trouble of translating between the modes, but copy the configs)
      Object.assign(player.celestials.effarig.glyphScoreSettings, player.celestials.effarig.autoGlyphSac);
      player.celestials.effarig.glyphTrashMode = 0;
      delete player.celestials.effarig.autoGlyphSac;
      delete player.celestials.effarig.autoGlyphPick;
    },
    player => {
      delete player.reality.glyphs.inventorySize;
      for (const glyph of player.reality.glyphs.inventory) {
        if (glyph.idx >= 10) {
          glyph.idx += 10;
        }
      }
    },
    player => {
      // Typo fix, as long as we have to delete a player property let's also
      // correctly initialize the new one.
      player.onlyEighthDimensions = player.onlyEighthDimensons;
      delete player.onlyEighthDimensons;
    },
    player => {
      for (const pet of Ra.pets.all) {
        pet.level = Math.clampMax(pet.level, 25);
      }
      delete player.celestials.ra.compression;
      if (Ra.has(RA_UNLOCKS.ALWAYS_GAMESPEED)) {
        const allGlyphs = player.reality.glyphs.active
          .concat(player.reality.glyphs.inventory);
        for (const glyph of allGlyphs) {
          Glyphs.applyGamespeed(glyph);
        }
      }
    },
    player => {
      for (let i = 0; i < player.celestials.ra.alchemy.length; i++) {
        player.celestials.ra.alchemy[i].amount = Math.clampMax(
          player.celestials.ra.alchemy[i].amount, Ra.alchemyResourceCap);
      }
    },
    player => {
      delete player.celestials.laitela.maxAmGained;
      for (const dim of player.celestials.laitela.dimensions) {
        dim.powerDMUpgrades = dim.powerUpgrades;
        dim.powerDEUpgrades = 0;
        delete dim.chanceUpgrades;
        delete dim.powerUpgrades;
      }
      // Note that player.celestials.laitela.higgs is actually a string at this point
      // (since conversion to Decimal hasn't happened yet).
      player.celestials.laitela.darkMatterMult = Number(player.celestials.laitela.higgs) + 1;
      delete player.celestials.laitela.anomalies;
    },
    player => {
      delete player.achPow;
      delete player.interval;
      delete player.tickThreshold;
      delete player.celestials.enslaved.maxQuotes;
      delete player.celestials.v.quoteIdx;
      delete player.celestials.ra.quoteIdx;
    },
    player => {
      player.celestials.enslaved.totalDimCapIncrease = 0;
      player.celestials.enslaved.tesseracts = 0;
    },
    player => {
      delete player.auto.galaxy.buyMax;
    },
    player => {
      delete player.reality.glyphs.sac.cursed;
      Achievement(153).lock();
      Achievement(157).lock();
    },
    player => {
      // Return all PP spent on old V goal reduction
      if (player.celestials.v.ppSpent) {
        player.reality.pp += player.celestials.v.ppSpent;
        delete player.celestials.v.ppSpent;
      }
    },
    player => {
      player.thisEternityMaxAM = new Decimal(0);
    },
    player => {
      GameStorage.migrations.migrateLastTenRuns(player);
      //  Put in a default value of 1 for realities.
      player.lastTenRealities = player.lastTenRealities.map(x => [x[0], x[1], 1, Number(x[2]), x[3]]);
      GameStorage.migrations.migrateIPGen(player);
    },
    player => {
      player.noReplicantiGalaxies = player.reality.upgReqChecks[0];
      delete player.reality.upgReqChecks;
    },
    player => {
      player.bestGlyphStrength = player.reality.glyphs.active.concat(
        player.reality.glyphs.inventory).map(g => g.strength).max();
    },
    player => {
      player.options.showHintText.glyphEffectDots = player.options.showGlyphEffectDots;
      delete player.options.showGlyphEffectDots;
      GameStorage.migrations.renameCloudVariable(player);
    },
    player => {
      const newPerks = new Set([...player.reality.perks].filter(x => x < 20 || x > 25));
      const gainedPerkPoints = player.reality.perks.size - newPerks.size;
      player.reality.pp += gainedPerkPoints;
      player.reality.perks = newPerks;
      if (gainedPerkPoints > 0) {
        Modal.message.show(
          "Some of your perks (glyph perks) were removed. The perk points you spent on them have been refunded.");
      }
    },
    player => {
      delete player.reality.glyphs.last;
    },
    player => {
      if (player.reality.secondGaussian === null) {
        // Future-proof against potential changes to the default value
        // (as a special case of not using state accessors).
        player.reality.secondGaussian = 1e6;
      }
    },
    player => {
      delete player.celestials.laitela.reachedSingularityCapLimit;
      delete player.celestials.laitela.secondsSinceCappedTime;
      delete player.celestials.laitela.singularityAutoCapLimit;
      delete player.celestials.laitela.singularityTime;
      delete player.celestials.laitela.autoAnnihilationTimer;
      delete player.celestials.laitela.annihilated;
      delete player.celestials.laitela.secondsSinceReachedSingularity;
      player.celestials.laitela.darkMatterMult = Math.clampMin(player.celestials.laitela.darkMatterMult, 1);
      player.celestials.laitela.dimensions.forEach(d => d.ascensionCount = 0);
    },
    player => {
      const allRandomGlyphs = player.reality.glyphs.active
        .concat(player.reality.glyphs.inventory)
        .filter(i => i.type !== "companion");
      for (const glyph of allRandomGlyphs) {
        glyph.strength = Math.ceil(glyph.strength * 400) / 400;
      }
    },
    player => {
      for (let i = 0; i < player.dimensions.normal.length; i++) {
        const dimension = player.dimensions.normal[i];
        player.dimensions.antimatter[i].bought = dimension.bought;
        player.dimensions.antimatter[i].costBumps = dimension.costBumps;
        player.dimensions.antimatter[i].amount = new Decimal(dimension.amount);
      }
      delete player.dimensions.normal;
    },
    player => {
      player.options.news = {
        enabled: player.options.news,
        repeatBuffer: 40,
        AIChance: 0,
        speed: 1
      };
    },
    player => {
      delete player.options.confirmations.glyphTrash;
    },
    player => {
      GameStorage.migrations.standardizeUncompletedTimes(player);
      if (player.bestReality === 999999999999) player.bestReality = Number.MAX_VALUE;
      if (player.bestRealityRealTime === 999999999999) player.bestRealityRealTime = Number.MAX_VALUE;
      for (let i = 0; i < 10; i++) {
        if (player.lastTenRealities[i][0] === 2678400000) player.lastTenRealities[i][0] = Number.MAX_VALUE;
        if (player.lastTenRealities[i][3] === 26784000) player.lastTenRealities[i][3] = Number.MAX_VALUE;
      }
    },
    player => {
      for (const script of Object.values(player.reality.automator.scripts)) {
        script.content =
          script.content.replace(/^([ \t]*)(wait|if|while|until)([\t ]+)(completions)/igmu, "$1$2$3pending $4");
      }
    },
    player => {
      // eslint-disable-next-line no-bitwise
      player.celestials.ra.unlockBits &= ~(1 << 29);
    },
    player => {
      player.records.gameCreatedTime = player.gameCreatedTime;
      player.records.totalTimePlayed = player.totalTimePlayed;
      player.records.realTimePlayed = player.realTimePlayed;
      player.records.totalAntimatter = new Decimal(player.totalAntimatter);
      for (let i = 0; i < 10; i++) {
        player.records.lastTenInfinities[i][0] = player.lastTenRuns[i][0];
        player.records.lastTenEternities[i][0] = player.lastTenEternities[i][0];
        player.records.lastTenRealities[i][0] = player.lastTenRealities[i][0];
      }
      player.options.showLastTenInfinitiesGainPerTime = player.options.showLastTenRunsGainPerTime;
      delete player.options.showLastTenRunsGainPerTime;

      player.records.thisInfinity.time = player.thisInfinityTime;
      player.records.thisInfinity.realTime = player.thisInfinityRealTime;
      player.records.thisInfinity.lastBuyTime = player.thisInfinityLastBuyTime;
      player.records.thisInfinity.maxAM = new Decimal(player.thisInfinityMaxAM);
      player.records.thisInfinity.bestIPmin = new Decimal(player.bestIPminThisInfinity);

      player.records.bestInfinity.time = player.bestInfinityTime;
      player.records.bestInfinity.realTime = player.bestInfinityRealTime;
      player.records.bestInfinity.bestIPminEternity = new Decimal(player.bestIPminThisEternity);
      player.records.bestInfinity.bestIPminReality = new Decimal(player.bestEPThisReality);

      player.records.thisEternity.time = player.thisEternity;
      player.records.thisEternity.realTime = player.thisEternityRealTime;
      player.records.thisEternity.maxAM = new Decimal(player.thisEternityMaxAM);
      player.records.thisEternity.maxIP = new Decimal(player.thisEternityMaxIP);
      player.records.thisEternity.bestIPMsWithoutMaxAll = new Decimal(player.bestIpPerMsWithoutMaxAll);
      player.records.thisEternity.bestEPmin = new Decimal(player.bestEPminThisEternity);
      player.records.thisEternity.bestInfinitiesPerMs = new Decimal(player.bestInfinitiesPerMs);

      player.records.bestEternity.time = player.bestEternity;
      // I have no idea where real time best Eternity is, not sure if it exists?
      player.records.bestEternity.bestEPminReality = new Decimal(player.bestEPminThisReality);

      player.records.thisReality.time = player.thisReality;
      player.records.thisReality.realTime = player.thisRealityRealTime;
      player.records.thisReality.bestEternitiesPerMs = new Decimal(player.bestEternitiesPerMs);

      player.records.bestReality.RMmin = new Decimal(player.bestRMmin);
      player.records.bestReality.RMminSet = player.bestRMminSet;
      player.records.bestReality.glyphLevel = player.bestGlyphLevel;
      player.records.bestReality.glyphStrength = player.bestGlyphStrength;
      player.records.bestReality.glyphLevelSet = player.bestGlyphLevelSet;
      player.records.bestReality.bestEP = new Decimal(player.bestEP);
      player.records.bestReality.bestEPSet = player.bestEPSet;
      player.records.bestReality.time = player.bestReality;
      player.records.bestReality.realTime = player.bestRealityRealTime;
      player.records.bestReality.speedSet = player.bestSpeedSet;

      delete player.gameCreatedTime;
      delete player.totalTimePlayed;
      delete player.realTimePlayed;
      delete player.totalAntimatter;
      delete player.lastTenRuns;
      delete player.lastTenEternities;
      delete player.lastTenRealities;

      delete player.thisInfinityTime;
      delete player.thisInfinityRealTime;
      delete player.thisInfinityLastBuyTime;
      delete player.thisInfinityMaxAM;
      delete player.bestIPminThisInfinity;

      delete player.bestInfinityTime;
      delete player.bestInfinityRealTime;
      delete player.bestIPminThisEternity;

      delete player.thisEternity;
      delete player.thisEternityRealTime;
      delete player.thisEternityMaxAM;
      delete player.thisEternityMaxIP;
      delete player.bestIpPerMsWithoutMaxAll;
      delete player.bestEPminThisEternity;
      delete player.bestInfinitiesPerMs;
      delete player.bestIPminThisEternity;

      delete player.bestEternity;
      delete player.bestEPminThisReality;

      delete player.thisReality;
      delete player.thisRealityRealTime;
      delete player.bestEternitiesPerMs;
      delete player.bestEPThisReality;

      delete player.bestRMmin;
      delete player.bestRMminSet;
      delete player.bestGlyphLevel;
      delete player.bestGlyphStrength;
      delete player.bestGlyphLevelSet;
      delete player.bestEP;
      delete player.bestEPSet;
      delete player.bestReality;
      delete player.bestRealityRealTime;
      delete player.bestSpeedSet;
    },
    player => {
      player.replicanti.boughtGalaxyCap = player.replicanti.gal;
      player.reality.perkPoints = player.reality.pp;
      player.celestials.teresa.pouredAmount = player.celestials.teresa.rmStore;
      player.celestials.laitela.darkMatter = new Decimal(player.celestials.laitela.matter);
      player.celestials.laitela.maxDarkMatter = new Decimal(player.celestials.laitela.maxMatter);
      player.celestials.ra.pets.teresa.memories = player.celestials.ra.pets.teresa.exp;
      player.celestials.ra.pets.effarig.memories = player.celestials.ra.pets.effarig.exp;
      player.celestials.ra.pets.enslaved.memories = player.celestials.ra.pets.enslaved.exp;
      player.celestials.ra.pets.v.memories = player.celestials.ra.pets.v.exp;
      player.achievementChecks.noSacrifices = player.noSacrifices;
      player.achievementChecks.onlyEighthDimensions = player.onlyEighthDimensions;
      player.achievementChecks.onlyFirstDimensions = player.onlyFirstDimensions;
      player.achievementChecks.noEighthDimensions = player.noEighthDimensions;
      player.achievementChecks.noFirstDimensions = player.noFirstDimensions;
      player.achievementChecks.noAntimatterProduced = player.noAntimatterProduced;
      player.achievementChecks.noTriadStudies = player.noTriadStudies;
      player.achievementChecks.noTheoremPurchases = player.noTheoremPurchases;
      player.achievementChecks.noInfinitiesThisReality = player.noInfinitiesThisReality;
      player.achievementChecks.noEternitiesThisReality = player.noEternitiesThisReality;
      player.achievementChecks.noReplicantiGalaxies = player.noReplicantiGalaxies;
      player.dilation.baseTachyonGalaxies = player.dilation.baseFreeGalaxies;
      player.dilation.totalTachyonGalaxies = player.dilation.freeGalaxies;

      delete player.replicanti.gal;
      delete player.reality.pp;
      delete player.celestials.teresa.rmStore;
      delete player.celestials.laitela.matter;
      delete player.celestials.laitela.maxMatter;
      delete player.celestials.ra.pets.teresa.exp;
      delete player.celestials.ra.pets.effarig.exp;
      delete player.celestials.ra.pets.enslaved.exp;
      delete player.celestials.ra.pets.v.exp;
      delete player.noSacrifices;
      delete player.onlyEighthDimensions;
      delete player.onlyFirstDimensions;
      delete player.noEighthDimensions;
      delete player.noFirstDimensions;
      delete player.noAntimatterProduced;
      delete player.noTriadStudies;
      delete player.noTheoremPurchases;
      delete player.noInfinitiesThisReality;
      delete player.noEternitiesThisReality;
      delete player.noReplicantiGalaxies;
      delete player.dilation.baseFreeGalaxies;
      delete player.dilation.freeGalaxies;
    },
    player => {
      for (let i = 0; i < 8; i++) {
        player.auto.infinityDims[i].isActive = player.infDimBuyers[i];
      }
      for (let i = 0; i < 8; i++) {
        player.auto.timeDims[i].isActive = player.reality.tdbuyers[i];
      }
      for (let i = 0; i < 3; i++) {
        player.auto.replicantiUpgrades[i].isActive = player.replicanti.auto[i];
      }
      for (let i = 0; i < 3; i++) {
        player.auto.dilationUpgrades[i].isActive = player.dilation.auto[i];
      }
      for (let i = 0; i < 2; i++) {
        player.auto.blackHolePower[i].isActive = player.blackHole[i].autoPower;
      }
      for (let i = 0; i < 5; i++) {
        player.auto.realityUpgrades[i].isActive = player.reality.rebuyablesAuto[i];
      }
      player.auto.antimatterDims = player.auto.dimensions;
      player.auto.replicantiGalaxies.isActive = player.replicanti.galaxybuyer;
      player.auto.ipMultBuyer.isActive = player.infMultBuyer;
      player.auto.epMultBuyer.isActive = player.reality.epmultbuyer;
      player.auto.timeTheorems.isActive = player.ttbuyer;
      player.auto.bigCrunch.xCurrent = player.auto.bigCrunch.xLast;
      player.auto.eternity.xCurrent = player.auto.eternity.xLast;
      player.auto.bulkOn = player.options.bulkOn;
      player.auto.autobuyerOn = player.options.autobuyerOn;
      player.auto.disableContinuum = player.options.disableContinuum;

      delete player.auto.dimensions;
      delete player.infDimBuyers;
      delete player.auto.infDimTimer;
      delete player.reality.tdbuyers;
      delete player.auto.timeDimTimer;
      delete player.replicanti.galaxybuyer;
      delete player.replicanti.auto;
      delete player.auto.repUpgradeTimer;
      delete player.ttbuyer;
      delete player.auto.ttTimer;
      delete player.dilation.auto;
      delete player.auto.dilUpgradeTimer;
      delete player.blackHole[0].autoPower;
      delete player.blackHole[1].autoPower;
      delete player.reality.rebuyablesAuto;
      delete player.reality.epmultbuyer;
      delete player.infMultBuyer;
      delete player.auto.bigCrunch.xLast;
      delete player.auto.eternity.xLast;
      delete player.options.bulkOn;
      delete player.options.autobuyerOn;
      delete player.options.disableContinuum;
    },
    GameStorage.migrations.convertTimeTheoremPurchases,
    GameStorage.migrations.infinitiedConversion,
    player => {
      delete player.saveOverThresholdFlag;
      delete player.saveOverThresholdFlagModalDisplayed;
    },
    player => {
      if (!Autobuyer.reality.isUnlocked) player.auto.reality.isActive = false;
    },
    player => {
      // Delete PEC5 (id 64)
      if (player.reality.perks.has(64)) {
        player.reality.perks.delete(64);
        Currency.perkPoints.add(1);
      }

      let reqBitmask = 0;
      for (let i = 0; i <= player.reality.upgReqs.length; i++) {
        // eslint-disable-next-line no-bitwise
        if (player.reality.upgReqs[i]) reqBitmask |= (1 << i);
      }
      player.reality.upgReqs = reqBitmask;
    },
    player => {
      // Delete SAM2 (id 11)
      if (player.reality.perks.has(11)) {
        player.reality.perks.delete(11);
        Currency.perkPoints.add(1);
      }
      if (player.reality.perks.has(10)) Perk.startAM.onPurchased();
    },
    player => {
      player.achievementChecks.maxStudiesThisReality = player.timestudy.studies.length;
      player.celestials.teresa.lastRepeatedMachines = new Decimal(player.celestials.teresa.lastRepeatedRM);
      delete player.celestials.teresa.lastRepeatedRM;
    },
    player => {
      // Make sure scripts don't have any gaps in indices, and load up the correct script on migration
      let newID = 1;
      let selectedID = 1;
      const shiftedScripts = {};
      for (const id of Object.keys(player.reality.automator.scripts)) {
        shiftedScripts[newID] = player.reality.automator.scripts[id];
        shiftedScripts[newID].id = newID;
        if (id === player.reality.automator.state.editorScript) selectedID = newID;
        newID++;
      }
      player.reality.automator.scripts = shiftedScripts;
      player.reality.automator.state.editorScript = selectedID;

      delete player.reality.automator.lastID;
    },
    GameStorage.migrations.deleteDimboostBulk,
    GameStorage.migrations.removePriority,
    player => {
      player.reality.realityMachines = player.reality.realityMachines.floor();
    },
    GameStorage.migrations.deleteFloatingTextOption,
    player => {
      // Delete ACH5
      if (player.reality.perks.has(206)) {
        player.reality.perks.delete(206);
        Currency.perkPoints.add(1);
      }
    },
    player => {
      player.records.thisEternity.maxIP.copyFrom(player.infinityPoints);
      player.auto.bigCrunch.xHighest = player.auto.bigCrunch.xCurrent;
      player.auto.eternity.xHighest = player.auto.eternity.xCurrent;
      delete player.auto.bigCrunch.xCurrent;
      delete player.auto.eternity.xCurrent;
    },
    player => {
      // Fix an issue where a boolean property could become int and trigger number checking code.
      player.achievementChecks.continuumThisReality = Boolean(player.achievementChecks.continuumThisReality);
    },
    player => {
      player.secretUnlocks.spreadingCancer = player.spreadingCancer;
      delete player.spreadingCancer;
    },
    player => {
      delete player.celestials.enslaved.totalDimCapIncrease;
    },
    player => {
      for (const i of player.reality.glyphs.undo) {
        for (const j of ["thisInfinityTime", "thisInfinityRealTime", "thisEternityTime", "thisEternityRealTime"]) {
          if (!(j in i)) {
            // This is 1 second, seems like a solid default value for saves without the property.
            i[j] = 1000;
          }
        }
      }
    },
    player => {
      // Requirement migration/refactor
      player.requirementChecks = {
        infinity: {
          maxAll: player.usedMaxAll,
          noSacrifice: player.achievementChecks.noSacrifices,
          noAD8: player.achievementChecks.noEighthDimensions,
        },
        eternity: {
          onlyAD1: player.achievementChecks.onlyFirstDimensions,
          onlyAD8: player.achievementChecks.onlyEighthDimensions,
          noAD1: player.achievementChecks.noFirstDimensions,
          noRG: player.achievementChecks.noEighthDimensions,
        },
        reality: {
          noAM: player.achievementChecks.noAntimatterProduced,
          noTriads: player.achievementChecks.noTriadStudies,
          noPurchasedTT: player.achievementChecks.noTheoremPurchases,
          noInfinities: player.achievementChecks.noInfinitiesThisReality,
          noEternities: player.achievementChecks.noEternitiesThisReality,
          noContinuum: !player.achievementChecks.continuumThisReality,
          maxID1: new Decimal(player.achievementChecks.maxID1ThisReality),
          maxStudies: player.achievementChecks.maxStudiesThisReality,
          maxGlyphs: player.celestials.v.maxGlyphsThisRun,
          slowestBH: player.minNegativeBlackHoleThisReality,
        },
        permanent: {
          cancerGalaxies: player.secretUnlocks.spreadingCancer,
          singleTickspeed: player.secretUnlocks.why,
          perkTreeDragging: player.secretUnlocks.dragging,
        }
      };
      delete player.usedMaxAll;
      delete player.secretUnlocks.spreadingCancer;
      delete player.secretUnlocks.why;
      delete player.secretUnlocks.dragging;
      delete player.achievementChecks;
      delete player.minNegativeBlackHoleThisReality;
      delete player.celestials.v.maxGlyphsThisRun;

      // Refactor news storage format to bitmask array
      const oldNewsArray = player.news;
      delete player.news;
      player.news = {};
      player.news.seen = {};
      for (const id of oldNewsArray) NewsHandler.addSeenNews(id);
      player.news.totalSeen = NewsHandler.uniqueTickersSeen;

      // Separate news-specific data
      player.news.specialTickerData = {
        uselessNewsClicks: player.secretUnlocks.uselessNewsClicks,
        paperclips: player.secretUnlocks.paperclips,
        newsQueuePosition: player.secretUnlocks.newsQueuePosition,
        eiffelTowerChapter: player.secretUnlocks.eiffelTowerChapter,
      };
      delete player.secretUnlocks.uselessNewsClicks;
      delete player.secretUnlocks.paperclips;
      delete player.secretUnlocks.newsQueuePosition;
      delete player.secretUnlocks.eiffelTowerChapter;
    },
    GameStorage.migrations.refactorDoubleIPRebuyable
  ],

  patch(player) {
    if (!isDevEnvironment()) return;
    player.options.testVersion = player.options.testVersion || 0;
    for (let version = player.options.testVersion; version < this.patches.length; version++) {
      const patch = this.patches[version];
      patch(player);
    }
    this.setLatestTestVersion(player);
  },

  setLatestTestVersion(player) {
    player.options.testVersion = this.patches.length;
  }
};
