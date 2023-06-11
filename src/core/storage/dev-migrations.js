import { migrations } from "./migrations";

function arrayToBits(array) {
  let bits = 0;
  for (const id of array) bits |= (1 << id);
  return bits;
}

// WARNING: Don't use state accessors and functions from global scope here, that's not safe in long-term
export const devMigrations = {
  patches: [
    player => {
      migrations.normalizeTimespans(player);
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
    migrations.convertAutobuyerMode,
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
    migrations.fixChallengeIds,
    migrations.adjustMultCosts,
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
      // This property didn't even exist at the time of this change
      movePropIfPossible("teresa", "effarig", "glyphScoreSettings", {
        mode: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
        simpleEffectCount: 0,
        types: GlyphTypes.list.mapToObject(t => t.id, t => ({
          rarityThreshold: 0,
          scoreThreshold: 0,
          effectCount: 0,
          effectChoices: t.effects.mapToObject(e => e.id, () => false),
          effectScores: t.effects.mapToObject(e => e.id, () => 0),
        })),
      });
      movePropIfPossible("effarig", "teresa", "bestAMSet", []);
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
    migrations.convertAchivementsToNumbers,
    migrations.adjustGameCreatedTime,
    migrations.moveSavedStudyTrees,
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
    migrations.convertEPMult,
    migrations.moveChallengeInfo,
    migrations.adjustWhy,
    migrations.adjustThemes,
    migrations.removeAchPow,
    migrations.adjustSacrificeConfirmation,
    migrations.migrateNotation,
    migrations.fixAutobuyers,
    migrations.removeAutoIPProperties,
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
      migrations.adjustWhy(player);
      migrations.adjustAchievementVars(player);
    },
    migrations.uniformDimensions,
    migrations.removeEternityChallGoal,
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
      migrations.removeTickspeed(player);
      migrations.removePostC3Reward(player);
    },
    player => {
      const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
      for (const glyph of allGlyphs) {
        let effectBitmask = 0;
        for (const effect of orderedEffectList) {
          const typeEffect = separateEffectKey(effect);
          if (glyph.type === typeEffect[0] && glyph.effects[typeEffect[1]] !== undefined) {
            effectBitmask += 1 << GlyphEffects[effect].bitmaskIndex;
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
    migrations.renameMoney,
    player => {
      migrations.moveAutobuyers(player);
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
    migrations.convertNews,
    migrations.convertEternityCountToDecimal,
    migrations.renameDimboosts,
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
    migrations.migrateConfirmations,
    migrations.removeOtherTickspeedProps,
    player => {
      // These were accidentally added back in due to a bad merge conflict resolution
      delete player.resets;
      delete player.tickDecrease;
    },
    migrations.renameNewsOption,
    migrations.removeDimensionCosts,
    migrations.renameTickspeedPurchaseBumps,
    player => {
      const safeArrayToBits = x => ((x === undefined) ? 0 : arrayToBits(x));
      player.celestials.teresa.unlockBits = safeArrayToBits(player.celestials.teresa.unlocks);
      delete player.celestials.teresa.unlocks;
      player.celestials.effarig.unlockBits = safeArrayToBits(player.celestials.effarig.unlocks);
      delete player.celestials.effarig.unlocks;
      player.celestials.v.unlockBits = safeArrayToBits(player.celestials.v.unlocks);
      delete player.celestials.v.unlocks;
      player.celestials.ra.unlockBits = safeArrayToBits(player.celestials.ra.unlocks);
      delete player.celestials.ra.unlocks;
      player.celestials.laitela.unlockBits = safeArrayToBits(player.celestials.laitela.unlocks);
      delete player.celestials.laitela.unlocks;
    },
    player => {
      player.reality.seed = Math.floor(Math.abs(player.reality.seed)) % 0xFFFFFFFF;
    },
    player => {
      player.auto.sacrifice.multiplier = new Decimal(player.auto.sacrifice.multiplier);
    },
    migrations.changeC8Handling,
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
    migrations.convertAchievementsToBits,
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
      if (Ra.unlocks.allGamespeedGlyphs.canBeApplied) {
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
      migrations.migrateLastTenRuns(player);
      //  Put in a default value of 1 for realities.
      player.lastTenRealities = player.lastTenRealities.map(x => [x[0], x[1], 1, Number(x[2]), x[3]]);
      migrations.migrateIPGen(player);
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
      migrations.renameCloudVariable(player);
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
      if (player.dimensions.normal !== undefined) {
        for (let i = 0; i < player.dimensions.normal.length; i++) {
          const dimension = player.dimensions.normal[i];
          player.dimensions.antimatter[i].bought = dimension.bought;
          player.dimensions.antimatter[i].costBumps = dimension.costBumps;
          player.dimensions.antimatter[i].amount = new Decimal(dimension.amount);
        }
        delete player.dimensions.normal;
      }
    },
    player => {
      if (player.options.news.enabled === undefined) {
        player.options.news = {
          enabled: player.options.news,
          repeatBuffer: 40,
          AIChance: 0,
          speed: 1
        };
      }
    },
    player => {
      delete player.options.confirmations.glyphTrash;
    },
    player => {
      migrations.standardizeUncompletedTimes(player);
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
      player.achievementChecks = {
        noSacrifices: player.noSacrifices,
        onlyEighthDimensions: player.onlyEighthDimensions,
        onlyFirstDimensions: player.onlyFirstDimensions,
        noEighthDimensions: player.noEighthDimensions,
        noFirstDimensions: player.noFirstDimensions,
        noAntimatterProduced: player.noAntimatterProduced,
        noTriadStudies: player.noTriadStudies,
        noTheoremPurchases: player.noTheoremPurchases,
        noInfinitiesThisReality: player.noInfinitiesThisReality,
        noEternitiesThisReality: player.noEternitiesThisReality,
        noReplicantiGalaxies: player.noReplicantiGalaxies,
        // Not necessarily accurate, but these defaults prevent some people from effortlessly completing some
        // otherwise very difficult unlocks immediately upon migration
        maxID1ThisReality: new Decimal(1),
        continuumThisReality: true,
      };
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
      player.auto.infinityDims = Array.range(0, 8).map(() => ({ lastTick: 0 }));
      for (let i = 0; i < 8; i++) {
        player.auto.infinityDims[i].isActive = player.infDimBuyers[i];
      }
      player.auto.timeDims = Array.range(0, 8).map(() => ({ lastTick: 0 }));
      for (let i = 0; i < 8; i++) {
        player.auto.timeDims[i].isActive = player.reality.tdbuyers[i];
      }
      player.auto.replicantiUpgrades = Array.range(0, 3).map(() => ({ lastTick: 0 }));
      for (let i = 0; i < 3; i++) {
        player.auto.replicantiUpgrades[i].isActive = player.replicanti.auto[i];
      }
      if (player.dilation.auto === undefined) {
        // Not defined on old saves, we define it only to delete it later in this migration
        player.dilation.auto = [true, true, true];
      }
      player.auto.dilationUpgrades = Array.range(0, 3).map(() => ({ lastTick: 0 }));
      for (let i = 0; i < 3; i++) {
        player.auto.dilationUpgrades[i].isActive = player.dilation.auto[i];
      }
      player.auto.blackHolePower = Array.range(0, 2).map(() => ({ lastTick: 0 }));
      for (let i = 0; i < 2; i++) {
        player.auto.blackHolePower[i].isActive = player.blackHole[i].autoPower;
      }
      if (player.reality.rebuyablesAuto === undefined) {
        // Not defined on old saves, we define it only to delete it later in this migration
        player.reality.rebuyablesAuto = [true, true, true, true, true];
      }
      player.auto.realityUpgrades = Array.range(0, 5).map(() => ({ lastTick: 0 }));
      for (let i = 0; i < 5; i++) {
        player.auto.realityUpgrades[i].isActive = player.reality.rebuyablesAuto[i];
      }
      // Note: player.autobuyers, the old way of storing autobuyers, seems to have gotten lost in dev migrations
      if (player.auto.antimatterDims === undefined) {
        player.auto.antimatterDims = player.auto.dimensions;
      }
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
    migrations.convertTimeTheoremPurchases,
    migrations.infinitiedConversion,
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
        player.reality.perkPoints++;
      }

      let reqBitmask = 0;
      for (let i = 0; i <= player.reality.upgReqs.length; i++) {
        if (player.reality.upgReqs[i]) reqBitmask |= (1 << i);
      }
      player.reality.upgReqs = reqBitmask;
    },
    player => {
      // Delete SAM2 (id 11)
      if (player.reality.perks.has(11)) {
        player.reality.perks.delete(11);
        player.reality.perkPoints++;
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
    migrations.deleteDimboostBulk,
    migrations.removePriority,
    player => {
      player.reality.realityMachines = player.reality.realityMachines.floor();
    },
    migrations.deleteFloatingTextOption,
    player => {
      // Delete ACH5
      if (player.reality.perks.has(206)) {
        player.reality.perks.delete(206);
        player.reality.perkPoints++;
      }
    },
    player => {
      player.records.thisEternity.maxIP = new Decimal(player.infinityPoints);
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
      const oldChecks = player.achievementChecks;
      player.requirementChecks = {
        infinity: {
          maxAll: player.usedMaxAll,
          noSacrifice: oldChecks.noSacrifices,
          noAD8: oldChecks.noEighthDimensions,
        },
        eternity: {
          onlyAD1: oldChecks.onlyFirstDimensions,
          onlyAD8: oldChecks.onlyEighthDimensions,
          noAD1: oldChecks.noFirstDimensions,
          noRG: oldChecks.noEighthDimensions,
        },
        reality: {
          noAM: oldChecks.noAntimatterProduced,
          noTriads: oldChecks.noTriadStudies,
          noPurchasedTT: oldChecks.noTheoremPurchases,
          noInfinities: oldChecks.noInfinitiesThisReality,
          noEternities: oldChecks.noEternitiesThisReality,
          noContinuum: !oldChecks.continuumThisReality,
          maxID1: new Decimal(oldChecks.maxID1ThisReality),
          maxStudies: oldChecks.maxStudiesThisReality,
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
      if (Array.isArray(player.news)) {
        const oldNewsArray = player.news;
        delete player.news;
        player.news = {};
        player.news.seen = {};
        for (const id of oldNewsArray) NewsHandler.addSeenNews(id);
        player.news.totalSeen = NewsHandler.uniqueTickersSeen;
      }

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
    migrations.refactorDoubleIPRebuyable,
    player => {
      if (player.requirementChecks.reality.slowestBH === 0) player.requirementChecks.reality.slowestBH = 1;
    },
    player => {
      // #1764 fix - EM200 bug from eternity autobuyer appearing to be zero but not actually being zero
      if (player.auto.eternity.amount.lt(0.01)) player.auto.eternity.amount = new Decimal(0);
    },
    player => {
      player.options.hiddenSubtabBits = Array.repeat(0, 11);
      player.options.lastOpenSubtab = Array.repeat(0, 11);
    },
    player => {
      const highestRefinementData = [
        { name: "power", id: ALCHEMY_RESOURCE.POWER },
        { name: "infinity", id: ALCHEMY_RESOURCE.INFINITY },
        { name: "time", id: ALCHEMY_RESOURCE.TIME },
        { name: "replication", id: ALCHEMY_RESOURCE.REPLICATION },
        { name: "dilation", id: ALCHEMY_RESOURCE.DILATION },
        { name: "effarig", id: ALCHEMY_RESOURCE.EFFARIG }
      ];
      for (const resource of highestRefinementData) {
        player.celestials.ra.highestRefinementValue[resource.name] = player.celestials.ra.alchemy[resource.id].amount;
      }
    },
    migrations.deletePostChallUnlocked,
    player => {
      // Delete PEC4 (id 63)
      if (player.reality.perks.has(63)) {
        player.reality.perks.delete(63);
        player.reality.perkPoints++;
      }
      // Delete TTMA4 (id 107)
      if (player.reality.perks.has(107)) {
        player.reality.perks.delete(107);
        player.reality.perkPoints++;
      }
      delete player.auto.timeTheorems.lastTick;
    },
    player => {
      // We can't reliably check if the player has or hasn't unlocked the automator via automator points without
      // essentially copy-pasting all the automator point code here (in the interest of avoiding use of globals).
      // So, in the range of progress where it's unclear, we stop it entirely in case it hasn't actually unlocked yet.
      if (player.realities > 5 && player.realities < 50) {
        player.reality.automator.state.mode = 1;
        player.reality.automator.state.stack = [];
        player.reality.automator.state.repeat = false;
        player.reality.automator.state.forceRestart = false;
      }
    },
    player => {
      for (const resource of player.celestials.ra.alchemy) {
        // We shouldn't access global variables in migrations so instead of Ra.alchemyResourceCap we use 25000.
        resource.amount = Math.clampMax(resource.amount, 25000);
      }
    },
    player => {
      const triadRegex = new RegExp(`T(\\d)`, "gu");
      player.timestudy.presets.forEach(p => p.studies = p.studies.replaceAll(triadRegex, "30$1"));
      // This may also potentially change variable or preset names in scripts, breaking them, but the likelihood of
      // this being a widespread issue is low enough that this is probably a better option than a really obtuse regex
      for (const script of Object.values(player.reality.automator.scripts)) {
        script.content = script.content.replaceAll(triadRegex, "30$1");
      }

      if (player.celestials.v.triadStudies !== undefined) {
        player.timestudy.studies = player.timestudy.studies.concat(
          player.celestials.v.triadStudies.map(id => id + 300));
        delete player.celestials.v.triadStudies;
      }
    },
    player => {
      delete player.options.confirmations.harshAutoClean;
    },
    player => {
      player.celestials.laitela.singularitySorting = {
        // Added more support in singularity milestone list, uses enum SINGULARITY_MILESTONE_RESOURCE in constants.js
        displayResource: player.options.showCondenseToMilestone ? 1 : 0,
        sortResource: 0,
        showCompleted: 0,
        sortOrder: 0,
      };
      delete player.options.showCondenseToMilestone;
    },
    () => {
      // This is just an empty patch because some orders got really messed up. Sorry -Scar
    },
    player => {
      player.reality.glyphs.sets = player.reality.glyphs.sets.map(glyphs => ({ glyphs, name: "" }));
    },
    player => {
      // Remove any accidental recursion that may have been introduced by the above patch
      while (!Array.isArray(player.reality.glyphs.sets[0].glyphs)) {
        player.reality.glyphs.sets = player.reality.glyphs.sets.map(glyphs => (glyphs.glyphs));
      }
    },
    player => {
      // For saves before cel7 existed, it will first add this prop (as a number) and then run this migration code. For
      // saves which are already in cel7, this prop will already exist as a Decimal. This workaround handles both cases
      player.celestials.pelle.rifts.chaos.fill = new Decimal(player.celestials.pelle.rifts.chaos.fill).toNumber();

      delete player.celestials.pelle.compact;
      player.celestials.pelle.collapsed = {
        upgrades: false,
        rifts: false,
        galaxies: false
      };
      player.celestials.pelle.galaxyGenerator.unlocked = player.celestials.pelle.galaxyGenerator.generatedGalaxies > 0;
    },
    player => {
      if (player.celestials.pelle.doomed) player.achievementBits[17] |= 1;
      if (player.celestials.pelle.upgrades.has(4)) player.achievementBits[17] |= 2;
      if (player.celestials.pelle.doomed && player.challenge.infinity.completedBits === 510) {
        player.achievementBits[17] |= (1 << 2);
      }
      if (player.timestudy.studies.compact().includes(181)) player.achievementBits[17] |= (1 << 5);
    },
    player => {
      player.achievementBits[16] |= (player.achievementBits[16] & (1 << 4)) << 3;
      player.achievementBits[16] &= ~(1 << 4);
      player.achievementBits[16] |= (player.achievementBits[16] & (1 << 2)) << 2;
      player.achievementBits[16] &= ~(1 << 2);
    },
    player => {
      player.achievementBits[17] &= ~(1 << 5);
      if (player.timestudy.studies.compact().includes(181) && player.celestials.pelle.doomed) {
        player.achievementBits[17] |= (1 << 5);
      }
    },
    player => {
      if (player.celestials.pelle.doomed && (player.challenge.infinity.completedBits & (1 << 5)) !== 0) {
        player.achievementBits[17] |= (1 << 2);
      } else {
        player.achievementBits[17] &= ~(1 << 2);
      }
    },
    player => {
      player.celestials.pelle.collapsed = player.celestials.collapsed;
      player.celestials.pelle.showBought = player.celestials.showBought;
      delete player.celestials.collapsed;
      delete player.celestials.showBought;
    },
    migrations.infMultNameConversion,
    player => {
      if (player.celestials.pelle.collapsed === undefined) {
        player.celestials.pelle.collapsed = {
          upgrades: false,
          rifts: false,
          galaxies: false
        };
      }
    },
    player => {
      const from = player.celestials.laitela;
      if (from.automation) {
        player.auto.darkMatterDims.isActive = from.automation.dimensions;
        player.auto.ascension.isActive = from.automation.ascension;
        player.auto.annihilation.isActive = from.automation.singularity;
        player.auto.singularity.isActive = from.automation.annihilation;

        delete player.celestials.laitela.automation.dimensions;
        delete player.celestials.laitela.automation.ascension;
        delete player.celestials.laitela.automation.singularity;
        delete player.celestials.laitela.automation.annihilation;
      }

      player.auto.darkMatterDims.lastTick = from.darkAutobuyerTimer;
      player.auto.ascension.lastTick = from.darkAutobuyerTimer;
      player.auto.annihilation.multiplier = from.autoAnnihilationSetting;

      delete player.celestials.laitela.darkAutobuyerTimer;
      delete player.celestials.laitela.darkAutobuyerTimer;
      delete player.celestials.laitela.autoAnnihilationSetting;
    },
    migrations.etercreqConversion,
    player => {
      delete player.options.confirmations.reality;
    },
    player => {
      const hasDimboost = player.celestials.pelle.upgrades.has(19);
      const hasDilUpg = player.celestials.pelle.upgrades.has(18);
      player.celestials.pelle.upgrades.delete(18);
      player.celestials.pelle.upgrades.delete(19);
      if (hasDimboost) player.celestials.pelle.upgrades.add(18);
      if (hasDilUpg) player.celestials.pelle.upgrades.add(19);
    },
    player => {
      delete player.auto.bulkOn;
    },
    player => {
      player.requirementChecks.permanent.emojiGalaxies = player.requirementChecks.permanent.cancerGalaxies;
      delete player.requirementChecks.permanent.cancerGalaxies;
    },
    player => {
      delete player.celestials.effarig.unlocksBits;
      delete player.celestials.ra.unlocksBits;
    },
    player => {
      for (const script of Object.values(player.reality.automator.scripts)) {
        script.id = parseInt(script.id, 10);
      }
    },
    player => {
      player.secretUnlocks.themes.delete("S4Cancer");
      player.secretUnlocks.themes.add("S4Design");
    },
    player => {
      player.reality.automator.state.editorScript = Number(player.reality.automator.state.editorScript);
      // I'm not sure if there's any error with the type of topLevelScript, but better safe than sorry
      player.reality.automator.state.topLevelScript = Number(player.reality.automator.state.topLevelScript);
    },
    player => {
      // Move dil upg no reset and tachyon particles no reset
      if (player.celestials.pelle.upgrades.delete(20)) player.celestials.pelle.upgrades.add(21);
      if (player.celestials.pelle.upgrades.delete(19)) player.celestials.pelle.upgrades.add(20);

      // Dimboost upgrade id was moved from 18 to 7 -- Make the corresponding change
      // Galaxy upgrade was inserted at 11. 7-10 should only be moved forward 1 place
      // and 10-17 2 places forward.
      const hasDimboostsResetNothing = player.celestials.pelle.upgrades.delete(18);
      for (let i = 17; i >= 10; i--) {
        if (player.celestials.pelle.upgrades.delete(i)) player.celestials.pelle.upgrades.add(i + 2);
      }
      for (let i = 9; i >= 7; i--) {
        if (player.celestials.pelle.upgrades.delete(i)) player.celestials.pelle.upgrades.add(i + 1);
      }
      if (hasDimboostsResetNothing) player.celestials.pelle.upgrades.add(7);
    },
    player => {
      const cel = player.celestials;
      const convToBit = x => x.toBitmask() >> 1;
      if (cel.teresa.quotes) player.celestials.teresa.quoteBits = convToBit(cel.teresa.quotes);
      if (cel.effarig.quotes) player.celestials.effarig.quoteBits = convToBit(cel.effarig.quotes);
      if (cel.enslaved.quotes) player.celestials.enslaved.quoteBits = convToBit(cel.enslaved.quotes);
      if (cel.v.quotes) player.celestials.v.quoteBits = convToBit(cel.v.quotes);
      if (cel.ra.quotes) player.celestials.ra.quoteBits = convToBit(cel.ra.quotes);
      if (cel.laitela.quotes) player.celestials.laitela.quoteBits = convToBit(cel.laitela.quotes);
      if (cel.pelle.quotes) player.celestials.pelle.quoteBits = convToBit(cel.pelle.quotes);

      delete player.celestials.teresa.quotes;
      delete player.celestials.effarig.quotes;
      delete player.celestials.enslaved.quotes;
      delete player.celestials.v.quotes;
      delete player.celestials.ra.quotes;
      delete player.celestials.laitela.quotes;
      delete player.celestials.pelle.quotes;
    },
    player => {
      if (player.celestials.pelle.rifts.famine) {
        player.celestials.pelle.rifts.vacuum = {
          ...player.celestials.pelle.rifts.famine,
          fill: new Decimal(player.celestials.pelle.rifts.famine.fill)
        };
        delete player.celestials.pelle.rifts.famine;
      }

      if (player.celestials.pelle.rifts.pestilence) {
        player.celestials.pelle.rifts.decay = {
          ...player.celestials.pelle.rifts.pestilence,
          fill: new Decimal(player.celestials.pelle.rifts.pestilence.fill)
        };
        delete player.celestials.pelle.rifts.pestilence;
      }

      if (player.celestials.pelle.rifts.war) {
        player.celestials.pelle.rifts.recursion = {
          ...player.celestials.pelle.rifts.war,
          fill: new Decimal(player.celestials.pelle.rifts.war.fill)
        };
        delete player.celestials.pelle.rifts.war;
      }

      if (player.celestials.pelle.rifts.death) {
        player.celestials.pelle.rifts.paradox = {
          ...player.celestials.pelle.rifts.death,
          fill: new Decimal(player.celestials.pelle.rifts.death.fill)
        };
        delete player.celestials.pelle.rifts.death;
      }
    },
    player => {
      delete player.newGame;
    },
    migrations.moveTS33,
    player => {
      const toMove = ["antimatterDims", "infinityDims", "timeDims", "replicantiUpgrades", "dilationUpgrades",
        "blackHolePower", "realityUpgrades", "imaginaryUpgrades"];
      for (const x of toMove) {
        if (player.auto[x].all !== undefined) {
          // Already up to date
          continue;
        }
        const all = player.auto[x];
        delete player.auto[x];
        player.auto[x] = { all, isActive: true };
      }
    },
    player => {
      player.celestials.ra.petWithRemembrance = player.celestials.ra.petWithRecollection;
      delete player.celestials.ra.petWithRecollection;
    },
    player => {
      for (const key of Object.keys(player.reality.automator.scripts)) {
        const lines = player.reality.automator.scripts[key].content.split("\n");
        for (let num = 0; num < lines.length; num++) {
          let rawLine = lines[num];
          // TT command removed
          rawLine = rawLine.replace(/^\s*tt.*$/ui, "");
          // Changes to "studies" commands
          // For some reason `studies nowait load` would get caught by the following system without explicitly defining
          // that "nowait load" should not be captured. Probably because it treats nowait as nonexisting and then sees
          // that nowait is neither respec nor load. I tried consuming the nowait if it existed but that messed up the
          // replace function so this is the best I've got for now
          rawLine = rawLine.replace(/studies( nowait)? (?!respec|load|nowait respec|nowait load)(\S.+)$/ui,
            "studies$1 purchase $2");
          rawLine = rawLine.replace(/studies( nowait)? load preset ([1-6])/ui, "studies$1 load id $2");
          rawLine = rawLine.replace(/studies( nowait)? load preset (\S+)/ui, "studies$1 load name $2");
          // Autobuyer mode change (this is a much older change which wasn't migrated at the time)
          rawLine = rawLine.replace(/x current/ui, "x highest");
          // Variable definitions
          const defineMatch = rawLine.match(/define (\S*)\s*=\s*(\S.*)$/ui);
          if (defineMatch) {
            player.reality.automator.constants[defineMatch[1]] = defineMatch[2];
            rawLine = "";
          }
          lines[num] = rawLine;
        }
        player.reality.automator.scripts[key].content = lines.join("\n");
      }

      // Migrate IDs for all saves made during wave 3 testing, to prevent odd overwriting behavior on importing
      const newScripts = {};
      const oldScriptKeys = Object.keys(player.reality.automator.scripts);
      for (let newID = 1; newID <= oldScriptKeys.length; newID++) {
        newScripts[newID] = player.reality.automator.scripts[oldScriptKeys[newID - 1]];
        newScripts[newID].id = newID;
      }
      player.reality.automator.scripts = newScripts;
    },
    player => {
      delete player.celestials.pelle.armageddonDuration;
      delete player.celestials.pelle.maxAMThisArmageddon;
      delete player.options.sidebarMinimized;
      delete player.options.chart;
      delete player.devMode;
    },
    player => {
      const swap1 = player.achievementBits[10] & 4;
      const swap2 = player.achievementBits[11] & 8;
      if (swap1) {
        player.achievementBits[11] |= 8;
      } else {
        player.achievementBits[11] &= ~8;
      }
      if (swap2) {
        player.achievementBits[10] |= 4;
      } else {
        player.achievementBits[10] &= ~4;
      }
    },
    player => {
      if (player.options.newUI) {
        player.options.themeModern = player.options.theme ?? player.options.themeModern;
      } else {
        player.options.themeClassic = player.options.theme ?? player.options.themeClassic;
      }
      delete player.options.theme;

      if (BlackHole(1).isUnlocked) player.records.timePlayedAtBHUnlock = player.records.totalTimePlayed;
    },
    player => {
      player.IAP.enabled = !player.IAP.disabled;
      const toDelete = ["totalSTD", "spentSTD", "exportSTD", "IPPurchases", "EPPurchases", "RMPurchases",
        "dimPurchases", "allDimPurchases", "replicantiPurchases", "dilatedTimePurchases", "disabled"];
      for (const key of toDelete) delete player.IAP[key];
    },
    player => {
      const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
      for (const glyph of allGlyphs) {
        if (glyph.symbol === "key266b") {
          glyph.symbol = undefined;
          glyph.color = undefined;
          glyph.cosmetic = "music";
        }
        if (glyph.type === "companion") glyph.color = undefined;
      }
    },
    player => {
      player.options.lightGlyphs = !player.options.forceDarkGlyphs;
      delete player.options.forceDarkGlyphs;
    }
  ],

  patch(player) {
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
