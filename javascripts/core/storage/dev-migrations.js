"use strict";

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
      const newCommands = new Set();
      for (let commandId of player.reality.automatorCommands) {
        if (Math.floor(commandId / 10) === 2 || Math.floor(commandId / 10) === 3) commandId += 1;
        newCommands.add(commandId);
      }
      player.reality.automatorCommands = newCommands;
      if (!player.reality.automatorCommands.has(24)) player.reality.automatorCommands.add(24);
      if (!player.reality.automatorCommands.has(25)) player.reality.automatorCommands.add(25);
      if (!player.reality.automatorCommands.has(12)) player.reality.automatorCommands.add(12);
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
      if (!Object.values(AutoRealityMode).includes(player.autoRealityMode)) {
        player.autoRealityMode = AutoRealityMode.RM;
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
      // const speedup = getGameSpeedupFactor([GameSpeedEffect.EC12, GameSpeedEffect.WORMHOLE]);
      // player.thisInfinityRealTime = Time.thisInfinity.totalSeconds / speedup;
      // player.thisEternityRealTime = Time.thisEternity.totalSeconds / speedup;
      // player.thisRealityRealTime = Time.thisReality.totalSeconds / speedup;
      // for (var i=0; i<10; i++) {
      //   player.lastTenRuns[i][2] = undefined;
      //   player.lastTenEternities[i][2] = undefined;
      //   player.lastTenRealities[i][3] = undefined;
      // }
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
      movePropIfPossible("teresa", "effarig", "autoGlyphSac", {
        mode: AutoGlyphSacMode.NONE,
        types: GlyphTypes.list.mapToObject(t => t.id, t => ({
          rarityThreshold: 0,
          scoreThreshold: 0,
          effectScores: t.effects.mapToObject(e => e.id, () => 0),
        })),
      });
      movePropIfPossible("teresa", "effarig", "autoGlyphPick", {
        mode: AutoGlyphPickMode.RANDOM,
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
        for (const upg of player.reality.upg) {
          // eslint-disable-next-line no-bitwise
          player.reality.upgradeBits |= (1 << upg);
        }
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
