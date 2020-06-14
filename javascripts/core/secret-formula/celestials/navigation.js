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
  });
  return {
    "teresa-base": {
      visible: () => true,
      complete: () => 1,
      node: {
        clickAction: () => Tab.celestials.teresa.show(),
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
        ? 1 : Decimal.pLog10(Teresa.rmStore) / Math.log10(TERESA_UNLOCKS.RUN.price)),
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
            const rm = Teresa.rmStore;
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
        clickAction: () => Tab.celestials.teresa.show(),
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
        ? 1 : Decimal.pLog10(Teresa.rmStore) / Math.log10(TERESA_UNLOCKS.SHOP.price)),
      node: {
        clickAction: () => Tab.celestials.teresa.show(),
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
            const rm = Teresa.rmStore;
            const cost = TERESA_UNLOCKS.SHOP.price;
            return [
              "Perk Point Shop",
              `Pour ${format(rm, 2)} / ${format(cost, 2)} RM`
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
        path: LinearPath.connectCircles(Positions.teresa, 78 - 1, Positions.teresaPerkPointShop, 16 - 1),
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "effarig-shop": {
      visible: () => true,
      complete: () => (Teresa.has(TERESA_UNLOCKS.EFFARIG)
        ? 1 : Decimal.pLog10(Teresa.rmStore) / Math.log10(TERESA_UNLOCKS.EFFARIG.price)),
      node: {
        clickAction: () => Tab.celestials.effarig.show(),
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: new Vector(300, 0),
        ring: {
          rMajor: 24,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Effarig's Shop";
            const rm = Teresa.rmStore;
            const cost = TERESA_UNLOCKS.EFFARIG.price;
            return [
              "Effarig",
              `Pour ${format(rm, 2)} / ${format(cost, 2)} RM`
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
        path: LinearPath.connectCircles(Positions.teresa, 78 - 1, new Vector(300, 0), 24 - 1),
        fill: "url(#gradTeresaEffarig)",
      }
    },
    "effarig-reality-unlock": {
      visible: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
      // If the upgrade to unlock the reality isn't yet bought, clamp the progress at 99.9%,
      // even if the player has enough relic shards to buy it.
      complete: () => (EffarigUnlock.run.isUnlocked
        ? 1 : Math.clampMax(0.999, Decimal.pLog10(player.celestials.effarig.relicShards) /
          Math.log10(EffarigUnlock.run.cost))),
      node: {
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: new Vector(400, 50),
        ring: {
          rMajor: 16,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Unlock Effarig's Reality";
            const rs = player.celestials.effarig.relicShards;
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
        path: LinearPath.connectCircles(new Vector(300, 0), 24 - 1, new Vector(400, 50), 16 - 1),
        fill: "#d13737",
      }
    },
    "effarig-infinity": {
      visible: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
      complete: () => {
        if (EffarigUnlock.infinity.isUnlocked) return 1;
        if (!Effarig.isRunning) return 0;

        return Currency.antimatter.value.pLog10() / Decimal.NUMBER_MAX_VALUE.log10();
      },
      node: {
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        position: new Vector(550, 25),
        ring: {
          rMajor: 60,
          rMinor: 52,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Effarig's Infinity";
            const am = Effarig.isRunning ? Currency.antimatter.value : 0;
            return [
              "Effarig's Infinity",
              `Reach ${format(am, 2)} / ${format(Number.MAX_VALUE, 2)} Antimatter inside Effarig's Reality.`
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
        path: LinearPath.connectCircles(new Vector(400, 50), 16 - 1, new Vector(550, 25), 60 - 1),
        fill: "#d13737",
      }
    },
    "effarig-eternity": {
      visible: () => EffarigUnlock.infinity.isUnlocked,
      complete: () => {
        if (EffarigUnlock.eternity.isUnlocked) return 1;
        if (!Effarig.isRunning) return 0;

        return player.infinityPoints.pLog10() / Decimal.NUMBER_MAX_VALUE.log10();
      },
      node: {
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#7131ec",
        position: new Vector(550, 25),
        ring: {
          rMajor: 40,
          rMinor: 30,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Effarig's Eternity";
            const ip = Effarig.isRunning ? player.infinityPoints : 0;
            return [
              "Effarig's Eternity",
              `Reach ${format(ip, 2)} / ${format(Number.MAX_VALUE, 2)} IP inside Effarig's Reality.`
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

        return player.eternityPoints.pLog10() / 4000;
      },
      node: {
        alwaysShowLegend: true,
        completeClass: "c-celestial-nav__effarig",
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#A101ec",
        position: new Vector(550, 25),
        ring: {
          rMajor: 20,
          rMinor: 0,
        },
        symbol: "Ϙ",
        legend: {
          text: complete => {
            if (complete >= 1) return "Effarig's Reality";
            const ep = Effarig.isRunning ? player.eternityPoints : 0;
            const goal = new Decimal("1e4000");
            return [
              "Effarig's Reality",
              `Reach ${format(ep, 2)} / ${format(goal, 2)} EP inside Effarig's Reality.`
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
      complete: () => 1,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffa337",
        position: new Vector(650, 250),
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
        path: LinearPath.connectCircles(new Vector(550, 25), 40 - 1, new Vector(650, 250), 80 - 1),
        fill: "url(#gradEffarigEnslaved)",
      }
    },
    "enslaved-unlock-glyph-level": {
      visible: () => EffarigUnlock.eternity.isUnlocked,
      complete: () => player.bestGlyphLevel / 5000,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffa337",
        position: new Vector(650 + 75 * Math.cos(Math.PI / 180 * -60), 250 + 75 * Math.sin(Math.PI / 180 * -60)),
        ring: {
          rMajor: 24,
          rMinor: 16,
          gapCenterDeg: 40,
          gapDeg: 60,
          gapAngleDeg: 0,
        },
        legend: {
          text() {
            const goal = 5000;
            return `Reach glyph level ${formatInt(Math.min(player.bestGlyphLevel, goal))}/${formatInt(goal)}`;
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
          new Vector(650 + 75 * Math.cos(Math.PI / 180 * -60), 250 + 75 * Math.sin(Math.PI / 180 * -60)))
          .trimEnd(23),
        fill: "#ffa337",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "enslaved-unlock-glyph-rarity": {
      visible: () => EffarigUnlock.eternity.isUnlocked,
      complete: () => {
        const bestRarity = strengthToRarity(player.bestGlyphStrength);
        return bestRarity / 100;
      },
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffa337",
        position: new Vector(650 + 75 * Math.cos(Math.PI / 180 * 120), 250 + 75 * Math.sin(Math.PI / 180 * 120)),
        ring: {
          rMajor: 24,
          rMinor: 16,
          gapCenterDeg: 220,
          gapDeg: 60,
          gapAngleDeg: 0,
        },
        legend: {
          text: complete => {
            const goal = 100;
            return [`Reach glyph rarity
            ${formatPercents(complete * goal / 100, 1)}/${formatPercents(goal / 100, 1)}`];
          },
          angle: 135,
          diagonal: 32,
          horizontal: 32,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(
          new Vector(650 + 75 * Math.cos(Math.PI / 180 * -60), 250 + 75 * Math.sin(Math.PI / 180 * -60)),
          new Vector(650 + 75 * Math.cos(Math.PI / 180 * 120), 250 + 75 * Math.sin(Math.PI / 180 * 120)))
          .trimStart(23).trimEnd(23),
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

        return player.eternityPoints.pLog10() / 4000;
      },
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        alwaysShowLegend: true,
        fill: "#ffa337",
        position: new Vector(650, 250),
        ring: {
          rMajor: 80,
          rMinor: 70,
          gapCenterDeg: 195,
          gapDeg: 200,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "The Enslaved Ones' Reality";
            const ep = Enslaved.isRunning ? player.eternityPoints : 0;
            const goal = new Decimal("1e4000");
            return [
              "The Enslaved Ones' Reality",
              `Reach ${format(ep, 2)} / ${format(goal, 2)} EP inside The Enslaved Ones' Reality.`
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
        path: new LinearPath(
          new Vector(650 + 75 * Math.cos(Math.PI / 180 * 120), 250 + 75 * Math.sin(Math.PI / 180 * 120)),
          new Vector(650 + 74 * Math.sqrt(0.75), 250 + 74 * 0.5))
          .trimStart(23),
        fill: "#ffa337",
      }
    },
    "v-unlock-achievement": {
      visible: () => EffarigUnlock.reality.isUnlocked,
      complete: () => {
        if (Achievement(151).isUnlocked) return 1;
        if (!player.noEighthDimensions) return 0;

        return player.galaxies / 800;
      },
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "⌬",
        symbolOffset: "0.25rem",
        fill: "#ffe066",
        position: new Vector(400, 350 + 50 * Math.sqrt(3)),
        ring: {
          rMajor: 20,
        },
        legend: {
          text: complete => {
            const goal = 800;
            if (complete >= 1) return "V's unlock achievement";
            const galaxies = player.noEighthDimensions ? player.galaxies : 0;
            return [
              "V's unlock achievement",
              `Reach ${formatInt(galaxies)} / ${formatInt(goal)} Antimatter Galaxies without buying`,
              "8th Antimatter Dimensions in your current Infinity"
            ];
          },
          angle: -135,
          diagonal: 25,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: LinearPath.connectCircles(new Vector(650, 250), 80 - 1, new Vector(400, 350 + 50 * Math.sqrt(3)), 16 - 1),
        fill: "url(#gradEnslavedV)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-1": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        return player.realities / GameDatabase.celestials.v.mainUnlock.realities;
      },
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(450, 350),
        ring: {
          rMajor: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Reality condition for V";
            const realities = player.realities;
            const goal = GameDatabase.celestials.v.mainUnlock.realities;
            return [
              "V",
              `Reach ${format(realities, 2)} / ${format(goal, 2)} Realities.`
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
        path: new LinearPath(
          new Vector(400, 350 + 50 * Math.sqrt(3)),
          new Vector(450, 350)),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-2": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        return emphasizeEnd(player.eternities.pLog10() / Math.log10(GameDatabase.celestials.v.mainUnlock.eternities));
      },
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(500, 350 + 50 * Math.sqrt(3)),
        ring: {
          rMajor: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Eternity condition for V";
            const eternities = player.eternities;
            const goal = GameDatabase.celestials.v.mainUnlock.eternities;
            return [
              "V",
              `Reach ${format(eternities, 2)} / ${format(goal, 2)} Eternities.`
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
        path: new LinearPath(
          new Vector(400, 350 + 50 * Math.sqrt(3)),
          new Vector(500, 350 + 50 * Math.sqrt(3))),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },

    "v-unlock-3": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        return emphasizeEnd(player.infinitied.pLog10() / Math.log10(GameDatabase.celestials.v.mainUnlock.infinities));
      },
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(450, 350 + 100 * Math.sqrt(3)),
        ring: {
          rMajor: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Infinity condition for V";
            const infinities = player.infinitied;
            const goal = GameDatabase.celestials.v.mainUnlock.infinities;
            return [
              "V",
              `Reach ${format(infinities, 2)} / ${format(goal, 2)} Infinities.`
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
        path: new LinearPath(
          new Vector(400, 350 + 50 * Math.sqrt(3)),
          new Vector(450, 350 + 100 * Math.sqrt(3))),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-4": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        return emphasizeEnd(player.dilation.dilatedTime.pLog10() /
          GameDatabase.celestials.v.mainUnlock.dilatedTime.log10());
      },
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(350, 350 + 100 * Math.sqrt(3)),
        ring: {
          rMajor: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "DT condition for V";
            const dilatedTime = player.dilation.dilatedTime;
            const goal = GameDatabase.celestials.v.mainUnlock.dilatedTime;
            return [
              "V",
              `Reach ${format(dilatedTime, 2)} / ${format(goal, 2)} Dilated Time.`
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
        path: new LinearPath(
          new Vector(400, 350 + 50 * Math.sqrt(3)),
          new Vector(350, 350 + 100 * Math.sqrt(3))),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-5": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        return (emphasizeEnd(player.replicanti.amount.pLog10() /
          GameDatabase.celestials.v.mainUnlock.replicanti.log10()));
      },
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(300, 350 + 50 * Math.sqrt(3)),
        ring: {
          rMajor: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "Replicanti condition for V";
            const replicanti = player.replicanti.amount;
            const goal = GameDatabase.celestials.v.mainUnlock.replicanti;
            return [
              "V",
              `Reach ${format(replicanti, 2)} / ${format(goal, 2)} Replicanti.`
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
        path: new LinearPath(
          new Vector(400, 350 + 50 * Math.sqrt(3)),
          new Vector(300, 350 + 50 * Math.sqrt(3))),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-unlock-6": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => {
        if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
        return emphasizeEnd(player.reality.realityMachines.pLog10() /
          Math.log10(GameDatabase.celestials.v.mainUnlock.rm));
      },
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(350, 350),
        ring: {
          rMajor: 0,
        },
        legend: {
          text: complete => {
            if (complete >= 1) return "RM condition for V";
            const rm = player.reality.realityMachines;
            const goal = GameDatabase.celestials.v.mainUnlock.rm;
            return [
              "V",
              `Reach ${format(rm, 2)} / ${format(goal, 2)} Reality Machines.`
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
        path: new LinearPath(
          new Vector(400, 350 + 50 * Math.sqrt(3)),
          new Vector(350, 350)),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },

    "v-achievement-1": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => player.celestials.v.runUnlocks[0] / 6,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(350, 350),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[0].config.name;
            if (complete >= 1) return `V-achievement "${name}"`;
            const completions = player.celestials.v.runUnlocks[0];
            return [
              "V-achievement",
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
        path: new LinearPath(
          new Vector(300, 350 + 50 * Math.sqrt(3)),
          new Vector(350, 350)),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-2": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => player.celestials.v.runUnlocks[1] / 6,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(450, 350),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[1].config.name;
            if (complete >= 1) return `V-achievement "${name}"`;
            const completions = player.celestials.v.runUnlocks[1];
            return [
              "V-achievement",
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
        path: new LinearPath(
          new Vector(350, 350),
          new Vector(450, 350)),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-3": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => player.celestials.v.runUnlocks[2] / 6,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(300, 350 + 50 * Math.sqrt(3)),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[2].config.name;
            if (complete >= 1) return `V-achievement "${name}"`;
            const completions = player.celestials.v.runUnlocks[2];
            return [
              "V-achievement",
              `Reach ${formatInt(completions)} / ${formatInt(6)} completions in ${name}.`
            ];
          },
          angle: 225,
          diagonal: 16,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0,
        pathEnd: 1,
        path: new LinearPath(
          new Vector(350, 350 + 100 * Math.sqrt(3)),
          new Vector(300, 350 + 50 * Math.sqrt(3))),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-4": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => player.celestials.v.runUnlocks[3] / 6,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(500, 350 + 50 * Math.sqrt(3)),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[3].config.name;
            if (complete >= 1) return `V-achievement "${name}"`;
            const completions = player.celestials.v.runUnlocks[3];
            return [
              "V-achievement",
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
        path: new LinearPath(
          new Vector(450, 350),
          new Vector(500, 350 + 50 * Math.sqrt(3))),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-5": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => player.celestials.v.runUnlocks[4] / 6,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(350, 350 + 100 * Math.sqrt(3)),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[4].config.name;
            if (complete >= 1) return `V-achievement "${name}"`;
            const completions = player.celestials.v.runUnlocks[4];
            return [
              "V-achievement",
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
        path: new LinearPath(
          new Vector(450, 350 + 100 * Math.sqrt(3)),
          new Vector(350, 350 + 100 * Math.sqrt(3))),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-achievement-6": {
      visible: () => Achievement(151).isUnlocked,
      complete: () => player.celestials.v.runUnlocks[5] / 6,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#ffe066",
        position: new Vector(450, 350 + 100 * Math.sqrt(3)),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const name = VRunUnlocks.all[5].config.name;
            if (complete >= 1) return `V-achievement "${name}"`;
            const completions = player.celestials.v.runUnlocks[5];
            return [
              "V-achievement",
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
        path: new LinearPath(
          new Vector(500, 350 + 50 * Math.sqrt(3)),
          new Vector(450, 350 + 100 * Math.sqrt(3))),
        fill: "#ffe066",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "ra": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => 1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "\uf185",
        symbolOffset: "0.25rem",
        fill: "#9063de",
        position: new Vector(400, 200),
        ring: {
          rMajor: 24,
        },
        legend: {
          text: "Ra, celestial of the Forgotten",
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      }
    },
    "teresa-pet": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => Ra.pets.teresa.level / 25,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "\uf185",
        fill: "#9063de",
        isStacked: true,
        position: new Vector(400, 200),
        ring: {
          rMajor: 24,
        },
        legend: {
          text: () => {
            const level = Ra.pets.teresa.level;
            return [
              `Ra's Teresa Memory level ${formatInt(level)} / ${formatInt(25)}`
            ];
          },
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 0.75,
        path: new LinearPath(new Vector(400, 200), Positions.teresa),
        fill: "url(#gradRaTeresa)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "effarig-pet": {
      visible: () => Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK),
      complete: () => Ra.pets.effarig.level / 25,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "\uf185",
        fill: "#9063de",
        isStacked: true,
        position: new Vector(400, 200),
        ring: {
          rMajor: 24,
        },
        legend: {
          text: () => {
            const level = Ra.pets.effarig.level;
            return [
              `Ra's Effarig Memory level ${formatInt(level)} / ${formatInt(25)}`
            ];
          },
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 0.75,
        path: new LinearPath(new Vector(400, 200), new Vector(550, 25)),
        fill: "url(#gradRaEffarig)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "enslaved-pet": {
      visible: () => Ra.has(RA_UNLOCKS.ENSLAVED_UNLOCK),
      complete: () => Ra.pets.enslaved.level / 25,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "\uf185",
        fill: "#9063de",
        isStacked: true,
        position: new Vector(400, 200),
        ring: {
          rMajor: 24,
        },
        legend: {
          text: () => {
            const level = Ra.pets.enslaved.level;
            return [
              `Ra's Enslaved Memory level ${formatInt(level)} / ${formatInt(25)}`
            ];
          },
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 0.7,
        path: new LinearPath(new Vector(400, 200), new Vector(650, 250)),
        fill: "url(#gradRaEnslaved)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "v-pet": {
      visible: () => Ra.has(RA_UNLOCKS.V_UNLOCK),
      complete: () => Ra.pets.v.level / 25,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "\uf185",
        fill: "#9063de",
        isStacked: true,
        position: new Vector(400, 200),
        ring: {
          rMajor: 24,
        },
        legend: {
          text: () => {
            const level = Ra.pets.v.level;
            return [
              `Ra's V Memory level ${formatInt(level)} / ${formatInt(25)}`
            ];
          },
          angle: 142,
          diagonal: 85,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 0.62,
        path: new LinearPath(new Vector(400, 200), new Vector(400, 350 + 50 * Math.sqrt(3))),
        fill: "url(#gradRaV)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "ra-ring-1": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => 1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: new Vector(400, 200),
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: 75,
          gapDeg: 272,
        },
      }
    },
    "ra-ring-2": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => 1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: new Vector(400, 200),
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: 160,
          gapDeg: 320,
        },
      }
    },
    "ra-ring-3": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => 1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: new Vector(400, 200),
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: 230,
          gapDeg: 300,
        },
      }
    },
    "ra-ring-4": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => 1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: new Vector(400, 200),
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: 292,
          gapDeg: 335,
        },
      }
    },
    "ra-ring-5": {
      visible: () => V.has(V_UNLOCKS.RA_UNLOCK),
      complete: () => 1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "#9063de",
        position: new Vector(400, 200),
        ring: {
          rMajor: 90,
          rMinor: 80,
          gapCenterDeg: -12,
          gapDeg: 320,
        },
      }
    },
    "laitela-unlock": {
      visible: () => Ra.has(RA_UNLOCKS.V_UNLOCK),
      complete: () => Ra.totalPetLevel / 100,
      drawOrder: -1,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        symbol: "ᛝ",
        symbolScale: 1.6,
        symbolOffset: "0.1rem",
        fill: "white",
        position: new Vector(150, 450),
        ring: {
          rMajor: 15,
        },
        legend: {
          text: () => {
            const level = Ra.totalPetLevel;
            return [
              "Lai'tela unlock",
              `Total Celestial Memory levels ${formatInt(level)} / ${formatInt(100)}.`
            ];
          },
          angle: 260,
          diagonal: 12,
          horizontal: 8,
        },
      },
      connector: {
        pathStart: 0.05,
        pathEnd: 1,
        path: new LinearPath(new Vector(400, 200), new Vector(150, 450)),
        fill: "url(#gradRaLaitela)",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-2nd-dim": {
      visible: () => Ra.has(RA_UNLOCKS.RA_LAITELA_UNLOCK),
      complete: () => Laitela.maxMatter.clampMin(1).log10() / Math.log10(MatterDimension(2).adjustedStartingCost),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: new Vector(100, 500),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const goal = MatterDimension(2).adjustedStartingCost;
            const places = complete >= 1 ? 0 : 2;
            return [
            "2nd Dark Matter Dimension",
            `Dark Matter ${format(Laitela.maxMatter.min(goal), places)} / ${format(goal)}`
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
        path: new LinearPath(new Vector(150, 450), new Vector(100, 500)),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-3rd-dim": {
      visible: () => Ra.has(RA_UNLOCKS.RA_LAITELA_UNLOCK),
      complete: () => Laitela.maxMatter.clampMin(1).div(MatterDimension(2).adjustedStartingCost).log10() /
        Math.log10(MatterDimension(3).adjustedStartingCost / MatterDimension(2).adjustedStartingCost),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: new Vector(200, 500),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const goal = MatterDimension(3).adjustedStartingCost;
            const places = complete >= 1 ? 0 : 2;
            return [
            "3rd Dark Matter Dimension",
            `Dark Matter ${format(Laitela.maxMatter.min(goal), places)} / ${format(goal)}`
            ];
          },
          angle: 45,
          diagonal: 65,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.17,
        pathEnd: 0.89,
        path: new LinearPath(new Vector(150, 450), new Vector(200, 500)),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-4th-dim-left": {
      visible: () => Laitela.maxMatter.gte(MatterDimension(3).adjustedStartingCost),
      complete: () => Laitela.maxMatter.clampMin(1).div(MatterDimension(3).adjustedStartingCost).log10() /
        Math.log10(MatterDimension(4).adjustedStartingCost / MatterDimension(3).adjustedStartingCost),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: new Vector(150, 550),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: complete => {
            const goal = MatterDimension(4).adjustedStartingCost;
            const places = complete >= 1 ? 0 : 2;
            return [
            "4th Dark Matter Dimension",
            `Dark Matter ${format(Laitela.maxMatter.min(goal), places)} / ${format(goal)}`
            ];
          },
          angle: 15,
          diagonal: 30,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.89,
        path: new LinearPath(new Vector(100, 500), new Vector(150, 550)),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-4th-dim-right": {
      visible: () => Laitela.maxMatter.gte(MatterDimension(3).adjustedStartingCost),
      complete: () => Laitela.maxMatter.clampMin(1).div(MatterDimension(3).adjustedStartingCost).log10() /
        Math.log10(MatterDimension(4).adjustedStartingCost / MatterDimension(3).adjustedStartingCost),
      node: {
        fill: "white",
        position: new Vector(150, 550),
        isStacked: true,
        ring: {
          rMajor: 0,
        }
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.89,
        path: new LinearPath(new Vector(200, 500), new Vector(150, 550)),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-annihilation": {
      visible: () => Laitela.maxMatter.gte(MatterDimension(4).adjustedStartingCost),
      complete: () => Number(Laitela.darkMatterMult > 1),
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: new Vector(100, 600),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: [
            "Annihilate your",
            "Dark Matter Dimensions"
          ],
          angle: 135,
          diagonal: 30,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.89,
        path: new LinearPath(new Vector(150, 550), new Vector(100, 600)),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      },
    },
    "laitela-singularity": {
      visible: () => Laitela.maxMatter.gte(MatterDimension(4).adjustedStartingCost),
      complete: () => player.celestials.laitela.singularities,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: new Vector(200, 600),
        ring: {
          rMajor: 8,
        },
        legend: {
          text: [
            "Condense your Dark Energy",
            "Into a Singularity"
          ],
          angle: 45,
          diagonal: 30,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.89,
        path: new LinearPath(new Vector(150, 550), new Vector(200, 600)),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      },
    },
    "laitela-destabilization-left": {
      visible: () => player.celestials.laitela.singularities > 0 && Laitela.darkMatterMult > 1,
      complete: () => -Laitela.maxAllowedDimension / 4 + 2,
      node: {
        incompleteClass: "c-celestial-nav__test-incomplete",
        fill: "white",
        position: new Vector(150, 650),
        ring: {
          rMajor: 15,
        },
        legend: {
          text: [
            "Destabalize Lai'tela's Reality",
            "To the point where you can",
            "Only use 4 Dimensions"
          ],
          angle: 135,
          diagonal: 25,
          horizontal: 16,
        },
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.83,
        path: new LinearPath(new Vector(100, 600), new Vector(150, 650)),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    },
    "laitela-destabilization-right": {
      visible: () => player.celestials.laitela.singularities > 0 && Laitela.darkMatterMult > 1,
      complete: () => -Laitela.maxAllowedDimension / 4 + 2,
      node: {
        fill: "white",
        position: new Vector(150, 6500),
        isStacked: true,
        ring: {
          rMajor: 0,
        }
      },
      connector: {
        pathStart: 0.11,
        pathEnd: 0.83,
        path: new LinearPath(new Vector(200, 600), new Vector(150, 650)),
        fill: "white",
        completeWidth: 6,
        incompleteWidth: 4,
      }
    }
  };
}());
