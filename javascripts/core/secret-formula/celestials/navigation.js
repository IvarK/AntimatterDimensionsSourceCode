"use strict";

function emphasizeEnd(fraction) {
  return Math.pow(fraction, 10);
}

const CELESTIAL_NAV_DRAW_ORDER = {
  // Node background is a black fuzzy circle drawn behind nodes. It can help show their
  // outline in some cases, and can be used in cases where a connector passes under a node
  NODE_BG: 0,
  CONNECTORS: 1000,
  NODES: 2000,
  NODE_OVERLAYS: 3000,
};

GameDatabase.celestials.navigation = (function() {
  const Positions = Object.freeze({
    teresa: new Vector(100, 100),
    teresaPerkPointShop: new Vector(0, -50),

    effarigShop: new Vector(300, 0),
    effarigRealityUnlock: new Vector(400, 50),
    effarigNode: new Vector(550, 25),

    enslavedReality: new Vector(650, 250),
    enslavedGlyphLevel: new Vector(650 + 75 * Math.cos(Math.PI / 180 * -60), 250 + 75 * Math.sin(Math.PI / 180 * -60)),
    enslavedGlyphRarity: new Vector(650 + 75 * Math.cos(Math.PI / 180 * 120), 250 + 75 * Math.sin(Math.PI / 180 * 120)),

    vUnlockAchievement: new Vector(400, 350 + 50 * Math.sqrt(3)),
    vAchievement0: new Vector(350, 350),
    vAchievement1: new Vector(450, 350),
    vAchievement2: new Vector(500, 350 + 50 * Math.sqrt(3)),
    vAchievement3: new Vector(450, 350 + 100 * Math.sqrt(3)),
    vAchievement4: new Vector(350, 350 + 100 * Math.sqrt(3)),
    vAchievement5: new Vector(300, 350 + 50 * Math.sqrt(3)),

    raReality: new Vector(400, 200),
    raPetTeresa: new Vector(400 + 85 * Math.sin(Math.PI / 180 * 252), 200 + 85 * Math.cos(Math.PI / 180 * 252)),
    raPetEffarig: new Vector(400 + 85 * Math.sin(Math.PI / 180 * 140), 200 + 85 * Math.cos(Math.PI / 180 * 140)),
    raPetEnslaved: new Vector(400 + 85 * Math.sin(Math.PI / 180 * 78), 200 + 85 * Math.cos(Math.PI / 180 * 78)),
    raPetV: new Vector(400 + 85 * Math.sin(Math.PI / 180 * 0), 200 + 85 * Math.cos(Math.PI / 180 * 0)),

    laitelaFirstCenter: new Vector(150, 450),
    laitelaFirstLeft: new Vector(100, 500),
    laitelaFirstRight: new Vector(200, 500),
    laitelaSecondCenter: new Vector(150, 550),
    laitelaSecondLeft: new Vector(100, 600),
    laitelaSecondRight: new Vector(200, 600),
    laitelaThirdCenter: new Vector(150, 650),
  });
  return {
    "teresa-base": {
      visible: () => true,
      complete: () => 1,
      node: {
        clickAction: () => Tab.celestials.teresa.show(true),
        completeClass: "c-celestial-nav__test-complete",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: Positions.teresa,
        ring: {
          rMajor: 78,
          rMinor: 64,
        },
        legend: {
          text: "Teresa",
          angle: 135,
          diagonal: 32,
          horizontal: 16,
        },
      },
    },
    "teresa-reality-unlock": {
      visible: () => true,
      complete: () => (Teresa.has(TERESA_UNLOCKS.RUN)
        ? 1 : Decimal.pLog10(Teresa.pouredAmount) / Math.log10(TERESA_UNLOCKS.RUN.price)),
      node: {
        completeClass: "c-celestial-nav__test-complete",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: Positions.teresa,
        ring: {
          rMajor: 32,
          rMinor: 22,
        },
        legend: {
          hideWhenCompleted: true,
          text: () => {
            const rm = Teresa.pouredAmount;
            const cost = TERESA_UNLOCKS.RUN.price;
            return `Pour ${format(rm, 2)} / ${format(cost, 2)} RM`;
          },
          angle: 135,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: (function() {
        const pathStart = -Math.PI;
        const pathEnd = Math.PI;
        const path = LogarithmicSpiral.fromPolarEndpoints(Positions.teresa, -Math.PI, 69, Math.PI, 26);
        const pathPadStart = path.angleFromRadius(64 - 3) - pathStart;
        const pathPadEnd = pathEnd - path.angleFromRadius(34);
        return {
          pathStart,
          pathEnd,
          path,
          pathPadStart,
          pathPadEnd,
        };
      }()),
    },
    "teresa-reality": {
      visible: () => true,
      complete: () => (Teresa.runCompleted ? 1 : 0),
      node: {
        clickAction: () => Tab.celestials.teresa.show(true),
        completeClass: "c-celestial-nav__test-complete",
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "Ϟ",
        position: Positions.teresa,
        ring: {
          rMajor: 16,
        },
        alwaysShowLegend: true,
        legend: {
          text: "Teresa's Reality",
          angle: -135,
          diagonal: 96,
          horizontal: 16,
        },
      }
    },
    "teresa-pp-shop": {
      visible: () => true,
      complete: () => (Teresa.has(TERESA_UNLOCKS.SHOP)
        ? 1 : Decimal.pLog10(Teresa.pouredAmount) / Math.log10(TERESA_UNLOCKS.SHOP.price)),
      node: {
        clickAction: () => Tab.celestials.teresa.show(true),
        completeClass: "c-celestial-nav__test-complete",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: Positions.teresaPerkPointShop,
        ring: {
          rMajor: 16,
          rMinor: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Perk Point Shop";
            const rm = Teresa.pouredAmount;
            const cost = TERESA_UNLOCKS.SHOP.price;
            return [
              "Perk Point Shop",
              `Pour ${format(rm, 2)} / ${format(cost, 2)} Reality Machines`
            ];
          },
          angle: -35,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: LinearPath.connectCircles(Positions.teresa, 78 - 1, Positions.teresaPerkPointShop, 16 - 1),
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "effarig-shop": {
      visible: () => true,
      complete: () => (Teresa.has(TERESA_UNLOCKS.EFFARIG)
        ? 1 : Decimal.pLog10(Teresa.pouredAmount) / Math.log10(TERESA_UNLOCKS.EFFARIG.price)),
      node: {
        clickAction: () => Tab.celestials.effarig.show(true),
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: Positions.effarigShop,
        ring: {
          rMajor: 24,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Effarig's Shop";
            const rm = Teresa.pouredAmount;
            const cost = TERESA_UNLOCKS.EFFARIG.price;
            return [
              "Effarig",
              `Pour ${format(rm, 2)} / ${format(cost, 2)} Reality Machines`
            ];
          },
          angle: -135,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: LinearPath.connectCircles(Positions.teresa, 78 - 1, Positions.effarigShop, 24 - 1),
        fill: "url(#gradTeresaEffarig)",
      }
    },
    "effarig-reality-unlock": {
      visible: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
      // If the upgrade to unlock the reality isn't yet bought, clamp the progress at 99.9%,
      // even if the player has enough relic shards to buy it.
      complete: () => (EffarigUnlock.run.isUnlocked
        ? 1 : Math.clampMax(0.999, Decimal.pLog10(Currency.relicShards.value) /
          Math.log10(EffarigUnlock.run.cost))),
      node: {
        clickAction: () => Tab.celestials.effarig.show(true),
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: Positions.effarigRealityUnlock,
        ring: {
          rMajor: 16,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Unlock Effarig's Reality";
            const rs = Currency.relicShards.value;
            const cost = EffarigUnlock.run.cost;
            return [
              "Unlock Effarig's Reality",
              `Reach ${format(rs, 2)} / ${format(cost, 2)} Relic Shards`
            ];
          },
          angle: 75,
          diagonal: 40,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: LinearPath.connectCircles(Positions.effarigShop, 24 - 1, Positions.effarigRealityUnlock, 16 - 1),
        fill: "#d13737",
      }
    },
    "effarig-infinity": {
      visible: () => EffarigUnlock.run.isUnlocked,
      complete: () => {
        if (EffarigUnlock.infinity.isUnlocked) return 1;
        if (!Effarig.isRunning) return 0;

        return Currency.antimatter.value.pLog10() / Decimal.NUMBER_MAX_VALUE.log10();
      },
      node: {
        clickAction: () => Tab.celestials.effarig.show(true),
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: Positions.effarigNode,
        ring: {
          rMajor: 60,
          rMinor: 52,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Effarig's Infinity";
            if (complete === 0) return "Unlock Effarig's Reality";
            const am = Effarig.isRunning ? Currency.antimatter.value : 0;
            return [
              "Effarig's Infinity",
              `Reach ${format(am, 2)} / ${format(Number.MAX_VALUE, 2)}`,
              "Antimatter inside Effarig's Reality."
            ];
          },
          angle: 0,
          diagonal: 100,
          horizontal: 16,
        },
        bgDrawOrder: CELESTIAL_NAV_DRAW_ORDER.NODE_BG + 750,
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: LinearPath.connectCircles(Positions.effarigRealityUnlock, 16 - 1, Positions.effarigNode, 60 - 1),
        fill: "#d13737",
      }
    },
    "effarig-eternity": {
      visible: () => EffarigUnlock.infinity.isUnlocked,
      complete: () => {
        if (EffarigUnlock.eternity.isUnlocked) return 1;
        if (!Effarig.isRunning) return 0;

        return Currency.infinityPoints.value.pLog10() / Decimal.NUMBER_MAX_VALUE.log10();
      },
      node: {
        clickAction: () => Tab.celestials.effarig.show(true),
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#7131ec",
        position: Positions.effarigNode,
        ring: {
          rMajor: 40,
          rMinor: 30,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Effarig's Eternity";
            const ip = Effarig.isRunning ? Currency.infinityPoints.value : 0;
            return [
              "Effarig's Eternity",
              `Reach ${format(ip, 2)} / ${format(Number.MAX_VALUE, 2)}`,
              "Infinity Points inside Effarig's Reality."
            ];
          },
          angle: -45,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: (function() {
        const pathStart = -Math.PI;
        const pathEnd = 0;
        const path = LogarithmicSpiral.fromPolarEndpoints(new Vector(560, 25), pathStart, 66, pathEnd, 26);
        const pathPadStart = 0;
        const pathPadEnd = pathEnd - path.angleFromRadius(30);
        return {
          pathStart,
          pathEnd,
          path,
          pathPadStart,
          pathPadEnd,
          fill: "#d13737"
        };
      }())
    },
    "effarig-reality": {
      visible: () => EffarigUnlock.eternity.isUnlocked,
      complete: () => {
        if (EffarigUnlock.reality.isUnlocked) return 1;
        if (!Effarig.isRunning) return 0;

        return Currency.eternityPoints.value.pLog10() / 4000;
      },
      node: {
        clickAction: () => Tab.celestials.effarig.show(true),
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#A101ec",
        position: new Vector(550, 25),
        ring: {
          rMajor: 20,
          rMinor: 0,
        },
        symbol: "Ϙ",
        alwaysShowLegend: true,
        legend: {
          text: complete => {
            if (complete >= 1) return "Effarig's Reality";
            const ep = Effarig.isRunning ? Currency.eternityPoints.value : 0;
            const goal = new Decimal("1e4000");
            return [
              "Effarig's Reality",
              `Reach ${format(ep, 2)} / ${format(goal, 2)}`,
              "Eternity Points inside Effarig's Reality."
            ];
          },
          angle: -120,
          diagonal: 82,
          horizontal: 16,
        },
      },
      connector: (function() {
        const pathStart = 0;
        const pathEnd = Math.PI;
        const path = LogarithmicSpiral.fromPolarEndpoints(new Vector(558, 25), pathStart, 26, pathEnd, 24);
        const pathPadStart = 0;
        const pathPadEnd = 0;
        return {
          pathStart,
          pathEnd,
          path,
          pathPadStart,
          pathPadEnd,
          fill: "#d13737"
        };
      }())
    },
    "enslaved": {
      visible: () => EffarigUnlock.eternity.isUnlocked,
      complete: () => (EffarigUnlock.eternity.isUnlocked ? 1 : 0),
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.enslaved.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffa337",
        position: Positions.enslavedReality,
        ring: {
          rMajor: 80,
          rMinor: 70,
          gapCenterDeg: 15,
          gapDeg: 200,
        },
        alwaysShowLegend: false,
        legend: {
          text: "Enslaved",
          angle: -90,
          diagonal: 20,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        drawOrder: CELESTIAL_NAV_DRAW_ORDER.NODE_BG + 500,
        path: LinearPath.connectCircles(Positions.effarigNode, 40 - 1, Positions.enslavedReality, 80 - 1),
        fill: "url(#gradEffarigEnslaved)",
      }
    },
    "enslaved-unlock-glyph-level": {
      visible: () => EffarigUnlock.eternity.isUnlocked,
      complete: () => player.records.bestReality.glyphLevel / 5000,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.enslaved.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffa337",
        position: Positions.enslavedGlyphLevel,
        ring: {
          rMajor: 24,
          rMinor: 16,
          gapCenterDeg: 40,
          gapDeg: 60,
          gapAngleDeg: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Broken the chain with glyph level";
            const goal = 5000;
            return [
              "Break a chain",
              `Reach glyph level ${formatInt(Math.min(player.records.bestReality.glyphLevel, goal))}/${formatInt(goal)}`
            ];
          },
          angle: -45,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(
          new Vector(650 - 74 * Math.sqrt(0.75), 250 - 74 * 0.5),
          Positions.enslavedGlyphLevel)
          .trimEnd(23),
        fill: "#ffa337",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "enslaved-unlock-glyph-rarity": {
      visible: () => EffarigUnlock.eternity.isUnlocked,
      complete: () => {
        const bestRarity = strengthToRarity(player.records.bestReality.glyphStrength);
        return bestRarity / 100;
      },
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.enslaved.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffa337",
        position: Positions.enslavedGlyphRarity,
        ring: {
          rMajor: 24,
          rMinor: 16,
          gapCenterDeg: 220,
          gapDeg: 60,
          gapAngleDeg: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Broken the chain with glyph rarity";
            const goal = 100;
            return [
              "Break a chain",
              `Reach glyph rarity ${formatPercents(complete * goal / 100, 1)}/${formatPercents(goal / 100, 1)}`
            ];
          },
          angle: 135,
          diagonal: 32,
          horizontal: 32,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.enslavedGlyphRarity, Positions.enslavedGlyphLevel).trimStart(23).trimEnd(23),
        fill: "#ffa337",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "enslaved-reality": {
      visible: () => EffarigUnlock.eternity.isUnlocked,
      complete: () => {
        if (Enslaved.isCompleted) return 1;
        if (!Enslaved.isRunning) return 0;

        return Currency.eternityPoints.value.pLog10() / 4000;
      },
      node: {
        clickAction: () => Tab.celestials.enslaved.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffa337",
        position: Positions.enslavedReality,
        ring: {
          rMajor: 80,
          rMinor: 70,
          gapCenterDeg: 195,
          gapDeg: 200,
        },
        alwaysShowLegend: true,
        legend: {
          text: complete => {
            if (complete >= 1) return "The Enslaved Ones' Reality";
            const ep = Enslaved.isRunning ? Currency.eternityPoints.value : 0;
            const goal = new Decimal("1e4000");
            return [
              "The Enslaved Ones' Reality",
              `Reach ${format(ep, 2)} / ${format(goal, 2)}`,
              "Eternity Points inside The Enslaved Ones' Reality."
            ];
          },
          angle: 45,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.enslavedGlyphRarity, new Vector(650 + 74 * Math.sqrt(0.75), 250 + 74 * 0.5))
          .trimStart(23),
        fill: "#ffa337",
      }
    },
    "v-unlock-achievement": {
      visible: () => EffarigUnlock.reality.isUnlocked,
      complete: () => {
        if (Achievement(151).isUnlocked) return 1;
        if (!player.achievementChecks.noEighthDimensions) return 0;

        return player.galaxies / 800;
      },
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "⌬",
        symbolOffset: "0.25",
        fill: "#ffe066",
        position: Positions.vUnlockAchievement,
        ring: {
          rMajor: 20,
        },
        alwaysShowLegend: true,
        legend: {
          text: complete => {
            const goal = 800;
            if (complete >= 1) return "V's Reality";
            const galaxies = player.achievementChecks.noEighthDimensions ? player.galaxies : 0;
            return [
              "V's unlock Achievement",
              `Reach ${formatInt(galaxies)} / ${formatInt(goal)} Antimatter Galaxies without buying`,
              "8th Antimatter Dimensions in your current Infinity"
            ];
          },
          angle: 35,
          diagonal: 60,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: LinearPath.connectCircles(Positions.enslavedReality, 80 - 1, Positions.vUnlockAchievement, 16 - 1),
        fill: "url(#gradEnslavedV)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-1": {
      visible: () => Achievement(151).isUnlocked || V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 1);
        return db.progress();
      },
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement1,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 1);
            if (complete >= 1) return `${db.name} condition for V`;
            return [
              "V",
              `Reach ${db.format(db.resource())} / ${db.format(db.requirement)} ${db.name}.`
            ];
          },
          angle: -135,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vUnlockAchievement, Positions.vAchievement1),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-2": {
      visible: () => Achievement(151).isUnlocked || V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 2);
        return db.progress();
      },
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement2,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 2);
            if (complete >= 1) return `${db.name} condition for V`;
            return [
              "V",
              `Reach ${db.format(db.resource())} / ${db.format(db.requirement)} ${db.name}.`
            ];
          },
          angle: -135,
          diagonal: 30,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vUnlockAchievement, Positions.vAchievement2),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },

    "v-unlock-3": {
      visible: () => Achievement(151).isUnlocked || V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 3);
        return db.progress();
      },
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement3,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 3);
            if (complete >= 1) return `${db.name} condition for V`;
            return [
              "V",
              `Reach ${db.format(db.resource())} / ${db.format(db.requirement)} ${db.name}.`
            ];
          },
          angle: -135,
          diagonal: 45,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vUnlockAchievement, Positions.vAchievement3),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-4": {
      visible: () => Achievement(151).isUnlocked || V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 4);
        return db.progress();
      },
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement4,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 4);
            if (complete >= 1) return `${db.name} condition for V`;
            return [
              "V",
              `Reach ${db.format(db.resource())} / ${db.format(db.requirement)} ${db.name}.`
            ];
          },
          angle: -135,
          diagonal: 60,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vUnlockAchievement, Positions.vAchievement4),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-5": {
      visible: () => Achievement(151).isUnlocked || V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 5);
        return db.progress();
      },
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement5,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 5);
            if (complete >= 1) return `${db.name} condition for V`;
            return [
              "V",
              `Reach ${db.format(db.resource())} / ${db.format(db.requirement)} ${db.name}.`
            ];
          },
          angle: -135,
          diagonal: 75,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vUnlockAchievement, Positions.vAchievement5),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-6": {
      visible: () => Achievement(151).isUnlocked || V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 6);
        return db.progress();
      },
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement0,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const db = Object.values(GameDatabase.celestials.v.mainUnlock).find(e => e.id === 6);
            if (complete >= 1) return `${db.name} condition for V`;
            return [
              "V",
              `Reach ${db.format(db.resource())} / ${db.format(db.requirement)} ${db.name}.`
            ];
          },
          angle: -135,
          diagonal: 90,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vUnlockAchievement, Positions.vAchievement0),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },

    "v-achievement-0": {
      visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => VRunUnlocks.all[0].completions / 6,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement0,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[0].config.name;
            if (complete >= 1) return `V-Achievement "${name}"`;
            const completions = VRunUnlocks.all[0].completions;
            return [
              "V-Achievement",
              `Reach ${formatInt(completions)} / ${formatInt(6)} completions in ${name}.`
            ];
          },
          angle: -135,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vAchievement5, Positions.vAchievement0),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-1": {
      visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => VRunUnlocks.all[1].completions / 6,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement1,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[1].config.name;
            if (complete >= 1) return `V-Achievement "${name}"`;
            const completions = VRunUnlocks.all[1].completions;
            return [
              "V-Achievement",
              `Reach ${formatInt(completions)} / ${formatInt(6)} completions in ${name}.`
            ];
          },
          angle: 20,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vAchievement0, Positions.vAchievement1),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-2": {
      visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => VRunUnlocks.all[2].completions / 6,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement2,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[2].config.name;
            if (complete >= 1) return `V-Achievement "${name}"`;
            const completions = VRunUnlocks.all[2].completions;
            return [
              "V-Achievement",
              `Reach ${formatInt(completions)} / ${formatInt(6)} completions in ${name}.`
            ];
          },
          angle: 45,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vAchievement1, Positions.vAchievement2),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-3": {
      visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => VRunUnlocks.all[3].completions / 6,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement3,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[3].config.name;
            if (complete >= 1) return `V-Achievement "${name}"`;
            const completions = VRunUnlocks.all[3].completions;
            return [
              "V-Achievement",
              `Reach ${formatInt(completions)} / ${formatInt(6)} completions in ${name}.`
            ];
          },
          angle: 45,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vAchievement2, Positions.vAchievement3),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-4": {
      visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => VRunUnlocks.all[4].completions / 6,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement4,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[4].config.name;
            if (complete >= 1) return `V-Achievement "${name}"`;
            const completions = VRunUnlocks.all[4].completions;
            return [
              "V-Achievement",
              `Reach ${formatInt(completions)} / ${formatInt(6)} completions in ${name}.`
            ];
          },
          angle: 45,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vAchievement3, Positions.vAchievement4),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-5": {
      visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK),
      complete: () => VRunUnlocks.all[5].completions / 6,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.v.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: Positions.vAchievement5,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[5].config.name;
            if (complete >= 1) return `V-Achievement "${name}"`;
            const completions = VRunUnlocks.all[5].completions;
            return [
              "V-Achievement",
              `Reach ${formatInt(completions)} / ${formatInt(6)} completions in ${name}.`
            ];
          },
          angle: 135,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(Positions.vAchievement4, Positions.vAchievement5),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },

    "ra": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => (V.has(V_UNLOCKS.RA_UNLOCK) ? 1 : 0),
      node: {
        clickAction: () => Tab.celestials.ra.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "\uf185",
        symbolOffset: "0.25",
        fill: "#9063de",
        position: Positions.raReality,
        ring: {
          rMajor: 24,
        },
        alwaysShowLegend: true,
        legend: {
          text: "Ra's Reality",
          angle: 230,
          diagonal: 85,
          horizontal: 16,
        },
      }
    },
    "teresa-pet": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => (V.has(V_UNLOCKS.RA_UNLOCK) ? 1 : 0),
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.ra.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        isStacked: true,
        position: Positions.raPetTeresa,
        ring: {
          rMajor: 12,
        },
        legend: {
          text: () => {
            const level = Ra.pets.teresa.level;
            if (level === 25) return `Ra's Teresa Memories have all been returned`;
            return [
              "Ra's Teresa Memory level",
              `${formatInt(level)} / ${formatInt(25)}`
            ];
          },
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 0.95,
        path: new LinearPath(Positions.raReality, Positions.raPetTeresa),
        fill: "#9063de",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "teresa-pet-to-teresa": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => Ra.pets.teresa.level / 25,
      drawOrder: -1,
      connector: {
        pathStart: 0.05,
        pathEnd: 0.70,
        path: new LinearPath(Positions.raPetTeresa, Positions.teresa),
        fill: "url(#gradRaTeresa)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "effarig-pet": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => Ra.pets.teresa.level / 8,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.ra.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        isStacked: true,
        position: Positions.raPetEffarig,
        ring: {
          rMajor: 12,
        },
        legend: {
          text: complete => {
            const unlocked = Ra.pets.teresa.level;
            const level = Ra.pets.effarig.level;
            if (complete !== 1 && level === 1) return `Ra's Teresa Memory level ${unlocked} / ${formatInt(8)}`;
            if (level === 25) return `Ra's Effarig Memories have all been returned`;
            return [
              "Ra's Effarig Memory level",
              `${formatInt(level)} / ${formatInt(25)}`
            ];
          },
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 0.95,
        path: new LinearPath(Positions.raReality, Positions.raPetEffarig),
        fill: "#9063de",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "effarig-pet-to-effarig": {
      visible: () => Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK),
      complete: () => Ra.pets.effarig.level / 25,
      drawOrder: -1,
      connector: {
        pathStart: 0.05,
        pathEnd: 0.60,
        path: new LinearPath(Positions.raPetEffarig, Positions.effarigNode),
        fill: "url(#gradRaEffarig)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "enslaved-pet": {
      visible: () => Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK),
      complete: () => Ra.pets.effarig.level / 8,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.ra.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        isStacked: true,
        position: Positions.raPetEnslaved,
        ring: {
          rMajor: 12,
        },
        legend: {
          text: complete => {
            const unlocked = Ra.pets.effarig.level;
            const level = Ra.pets.enslaved.level;
            if (complete !== 1 && level === 1) return `Ra's Effarig Memory level ${unlocked} / ${formatInt(8)}`;
            if (level === 25) return `Ra's Enslaved Memories have all been returned`;
            return [
              "Ra's Enslaved Memory level",
              `${formatInt(level)} / ${formatInt(25)}`
            ];
          },
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 0.95,
        path: new LinearPath(Positions.raReality, Positions.raPetEnslaved),
        fill: "#9063de",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "enslaved-pet-to-enslaved": {
      visible: () => Ra.has(RA_UNLOCKS.ENSLAVED_UNLOCK),
      complete: () => Ra.pets.enslaved.level / 25,
      drawOrder: -1,
      connector: {
        pathStart: 0.05,
        pathEnd: 0.55,
        path: new LinearPath(Positions.raPetEnslaved, Positions.enslavedReality),
        fill: "url(#gradRaEnslaved)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-pet": {
      visible: () => Ra.has(RA_UNLOCKS.ENSLAVED_UNLOCK),
      complete: () => Ra.pets.enslaved.level / 8,
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.ra.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        isStacked: true,
        position: Positions.raPetV,
        ring: {
          rMajor: 12,
        },
        legend: {
          text: complete => {
            const unlocked = Ra.pets.enslaved.level;
            const level = Ra.pets.v.level;
            if (complete !== 1 && level === 1) return `Ra's Enslaved Memory level ${unlocked} / ${formatInt(8)}`;
            if (level === 25) return `Ra's V Memories have all been returned`;
            return [
              "Ra's V Memory level",
              `${formatInt(level)} / ${formatInt(25)}`
            ];
          },
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 0.95,
        path: new LinearPath(Positions.raReality, Positions.raPetV),
        fill: "#9063de",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-pet-to-v": {
      visible: () => Ra.has(RA_UNLOCKS.V_UNLOCK),
      complete: () => Ra.pets.v.level / 25,
      drawOrder: -1,
      connector: {
        pathStart: 0.05,
        pathEnd: 0.42,
        path: new LinearPath(Positions.raPetV, Positions.vUnlockAchievement),
        fill: "url(#gradRaV)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "ra-ring-1": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => (V.has(V_UNLOCKS.RA_UNLOCK) ? 1 : 0),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: Positions.raReality,
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: 74,
          gapDeg: 268,
        },
      }
    },
    "ra-ring-2": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => (V.has(V_UNLOCKS.RA_UNLOCK) ? 1 : 0),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: Positions.raReality,
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: 161,
          gapDeg: 318,
        },
      }
    },
    "ra-ring-3": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => (V.has(V_UNLOCKS.RA_UNLOCK) ? 1 : 0),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: Positions.raReality,
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: 231,
          gapDeg: 301,
        },
      }
    },
    "ra-ring-4": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => (V.has(V_UNLOCKS.RA_UNLOCK) ? 1 : 0),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: Positions.raReality,
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: 293,
          gapDeg: 334,
        },
      }
    },
    "ra-ring-5": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => (V.has(V_UNLOCKS.RA_UNLOCK) ? 1 : 0),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: Positions.raReality,
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: -14,
          gapDeg: 316,
        },
      }
    },
    "laitela-unlock": {
      visible: () => Ra.has(RA_UNLOCKS.V_UNLOCK),
      complete: () => (MatterDimension(1).unlockUpgrade.canBeBought || Laitela.isUnlocked
        ? 1
        : Math.clampMax(0.999, player.antimatter.exponent / 1.5e12)),
      drawOrder: -1,
      node: {
        clickAction: () => Tab.celestials.laitela.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "ᛝ",
        symbolScale: 1.6,
        symbolOffset: "0.1",
        fill: "white",
        position: Positions.laitelaFirstCenter,
        ring: {
          rMajor: 15,
        },
        alwaysShowLegend: true,
        legend: {
          text: () => {
            if (Laitela.isUnlocked) return ["Lai'tela's Reality"];

            const hasIDs = player.achievementChecks.maxID1ThisReality.neq(0);
            if (hasIDs) return [
              "Lai'tela's Reality",
              "The Power of Infinity Dimensions",
              "blocks your path."
            ];

            const antimatter = Currency.antimatter.value;
            const amGoal = Decimal.pow10(1.5e12);
            return [
              "Lai'tela's Reality",
              `${format(antimatter)} / ${format(amGoal)}`
            ];
          },
          angle: 260,
          diagonal: 15,
          horizontal: 8,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 1,
        path: new LinearPath(Positions.raReality, Positions.laitelaFirstCenter),
        fill: "url(#gradRaLaitela)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-2nd-dim": {
      visible: () => Laitela.isUnlocked,
      complete: () => {
        const upgrade = MatterDimension(2).unlockUpgrade;
        if (upgrade.canBeBought || upgrade.isBought) return 1;
        if (upgrade.isAvailableForPurchase) return upgrade.currency.value / upgrade.cost;
        return Laitela.difficultyTier < 1
          ? 0
          : 30 / player.celestials.laitela.fastestCompletion;
      },
      node: {
        clickAction: () => Tab.celestials.laitela.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: Positions.laitelaFirstLeft,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const dmdText = "2nd Dark Matter Dimension";
            const dim = MatterDimension(2);
            if (dim.amount.gte(1)) return [dmdText];

            const goal = dim.adjustedStartingCost;
            if (complete >= 1) return [
              dmdText,
              `Dark Matter ${format(Currency.darkMatter.max.min(goal), dim.amount.gte(1) ? 0 : 2)} / ${format(goal)}`
            ];

            const upgrade = MatterDimension(2).unlockUpgrade;
            if (upgrade.isAvailableForPurchase) return [
              dmdText,
              `Imaginary Machines
              ${format(upgrade.curreny.value.min(upgrade.cost), upgrade.canBeBought ? 0 : 2)} / ${format(upgrade.cost)}`
            ];

            if (player.celestials.laitela.fastestCompletion > 30 && Laitela.difficultyTier < 0) return [
              dmdText,
              `Beat Laitela's Reality in less that ${format(30)} seconds`
            ];
            return [
              dmdText,
              `Beat Laitela's Reality`
            ];
          },
          angle: 135,
          diagonal: 30,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.17,
        pathEnd: 0.89,
        path: new LinearPath(Positions.laitelaFirstCenter, Positions.laitelaFirstLeft),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-singularity": {
      visible: () => Laitela.isUnlocked,
      complete: () => (Currency.singularities.gte(1)
        ? 1
        : Math.clampMax(0.999, Currency.darkEnergy.value / Singularity.cap)),
      node: {
        clickAction: () => Tab.celestials.laitela.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: Positions.laitelaFirstRight,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: [
            "Condense your Dark Energy",
            "Into a Singularity"
          ],
          angle: 45,
          diagonal: 65,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.17,
        pathEnd: 0.89,
        path: new LinearPath(Positions.laitelaFirstCenter, Positions.laitelaFirstRight),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-3rd-dim-left": {
      visible: () => MatterDimension(2).isUnlocked && Currency.singularities.gte(1),
      complete: () => {
        const upgrade = MatterDimension(3).unlockUpgrade;
        if (upgrade.canBeBought || upgrade.isBought) return 1;
        if (upgrade.isAvailableForPurchase) return upgrade.currency.value / upgrade.cost;
        return Math.clampMax(0.999, Singularity.singularitiesGained / 20);
      },
      node: {
        clickAction: () => Tab.celestials.laitela.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: Positions.laitelaSecondCenter,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const dmdText = "3rd Dark Matter Dimension";
            const dim = MatterDimension(3);
            if (dim.amount.gte(1)) return [dmdText];

            const goal = dim.adjustedStartingCost;
            if (complete >= 1) return [
              dmdText,
              `Dark Matter ${format(Currency.darkMatter.max.min(goal), dim.amount.gte(1) ? 0 : 2)} / ${format(goal)}`
            ];

            const upgrade = MatterDimension(3).unlockUpgrade;
            if (upgrade.isAvailableForPurchase) return [
              dmdText,
              `Imaginary Machines
              ${format(upgrade.curreny.value.min(upgrade.cost), upgrade.canBeBought ? 0 : 2)} / ${format(upgrade.cost)}`
            ];

            return [
              dmdText,
              `Automatically Condense ${format(20)} Singularities at once`,
              `${format(Math.clampMax(Singularity.singularitiesGained, 20))} / ${format(20)}`
            ];
          },
          angle: 15,
          diagonal: 30,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.10,
        pathEnd: 0.89,
        path: new LinearPath(Positions.laitelaFirstLeft, Positions.laitelaSecondCenter),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-3rd-dim-right": {
      visible: () => MatterDimension(2).isUnlocked && Currency.singularities.gte(1),
      complete: () => {
        const upgrade = MatterDimension(3).unlockUpgrade;
        if (upgrade.canBeBought || upgrade.isBought) return 1;
        if (upgrade.isAvailableForPurchase) return upgrade.currency.value / upgrade.cost;
        return Math.clampMax(0.999, Singularity.singularitiesGained / 20);
      },
      node: {
        clickAction: () => Tab.celestials.laitela.show(true),
        fill: "white",
        position: Positions.laitelaSecondCenter,
        isStacked: true,
        ring: {
          rMajor: 0,
        }
      },
      connector: {
        pathStart: 0.10,
        pathEnd: 0.89,
        path: new LinearPath(Positions.laitelaFirstRight, Positions.laitelaSecondCenter),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-4th-dim": {
      visible: () => MatterDimension(3).isUnlocked,
      complete: () => {
        const upgrade = MatterDimension(4).unlockUpgrade;
        if (upgrade.canBeBought || upgrade.isBought) return 1;
        if (upgrade.isAvailableForPurchase) return upgrade.currency.value / upgrade.cost;
        return (Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies) / 80000;
      },
      node: {
        clickAction: () => Tab.celestials.laitela.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: Positions.laitelaSecondLeft,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const dmdText = "4th Dark Matter Dimension";
            const dim = MatterDimension(4);
            if (dim.amount.gte(1)) return [dmdText];

            const goal = dim.adjustedStartingCost;
            if (complete >= 1) return [
              dmdText,
              `Dark Matter ${format(Currency.darkMatter.max.min(goal), dim.amount.gte(1) ? 0 : 2)} / ${format(goal)}`
            ];

            const upgrade = MatterDimension(4).unlockUpgrade;
            if (upgrade.isAvailableForPurchase) return [
              dmdText,
              `Imaginary Machines
              ${format(upgrade.curreny.value.min(upgrade.cost), upgrade.canBeBought ? 0 : 2)} / ${format(upgrade.cost)}`
            ];

            const allGalaxies = Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies;
            return [
              dmdText,
              `Have ${format(80000)} total Galaxies`,
              `${format(Math.clampMax(allGalaxies, 80000))} / ${format(80000)}`
            ];
          },
          angle: 135,
          diagonal: 30,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.89,
        path: new LinearPath(Positions.laitelaSecondCenter, Positions.laitelaSecondLeft),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      },
    },
    "laitela-annihilation": {
      visible: () => MatterDimension(4).isUnlocked,
      complete: () => {
        const upgrade = ImaginaryUpgrade(19);
        if (upgrade.canBeBought || upgrade.isBought) return 1;
        if (upgrade.isAvailableForPurchase) return Currency.imaginaryMachines.value / upgrade.cost;
        return upgrade.isPossible
          ? Tickspeed.continuumValue / 3850000
          : 0;
      },
      node: {
        clickAction: () => Tab.celestials.laitela.show(true),
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: Positions.laitelaSecondRight,
        ring: {
          rMajor: 8,
        },
        legend: {
          text: [
            "Annihilate your",
            "Dark Matter Dimensions"
          ],
          angle: 45,
          diagonal: 30,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.89,
        path: new LinearPath(Positions.laitelaSecondCenter, Positions.laitelaSecondRight),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      },
    },
    "laitela-destabilization-left": {
      visible: () => MatterDimension(4).isUnlocked && ImaginaryUpgrade(19).isBought,
      complete: () => Laitela.difficultyTier / 8,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "ᛝ",
        symbolScale: 1.6,
        symbolOffset: "0.1",
        fill: "white",
        position: Positions.laitelaThirdCenter,
        ring: {
          rMajor: 15,
        },
        alwaysShowLegend: true,
        legend: {
          text: complete => {
            if (complete < 1) return [
              "Destabalize Lai'tela's Reality",
              "To the point where you cannot",
              "use any Dimensions",
              `${format(Laitela.difficultyTier)} / ${format(8)}`
            ];
            return [
              "Completely destabilized",
              "Lai'tela's Reality",
            ];
          },
          angle: 0,
          diagonal: 15,
          horizontal: 8,
        },
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.83,
        path: new LinearPath(Positions.laitelaSecondLeft, Positions.laitelaThirdCenter),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-destabilization-right": {
      visible: () => MatterDimension(4).isUnlocked && ImaginaryUpgrade(19).isBought,
      complete: () => Laitela.difficultyTier / 8,
      node: {
        fill: "white",
        position: Positions.laitelaThirdCenter,
        isStacked: true,
        ring: {
          rMajor: 0,
        }
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.83,
        path: new LinearPath(Positions.laitelaSecondRight, Positions.laitelaThirdCenter),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    }
  };
}());
