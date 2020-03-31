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
    player => {
      GameStorage.migrations.clearNewsArray(player);
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
        if (!pets.hasOwnProperty(prop)) continue;
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
        if (!pets.hasOwnProperty(prop)) continue;
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
    GameStorage.migrations.convertNewsToSet,
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
    GameStorage.migrations.removePower,
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
          player.celestials.ra.alchemy[i].amount, 25000);
      }
    }
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
