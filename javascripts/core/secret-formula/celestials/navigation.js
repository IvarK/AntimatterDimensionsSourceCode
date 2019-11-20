"use strict";

GameDatabase.celestials.navigation = {
  "teresa-base": {
    visible: () => true,
    complete: () => 1,
    node: {
      completeClass: "c-celestial-nav__test-complete",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(100, 100),
      rMajor: 78,
      rMinor: 64,
      alwaysShowLegend: true,
      legend: {
        text: "Teresa",
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
  },
  "teresa-reality-unlock": {
    visible: () => true,
    complete: () => (Teresa.has(TERESA_UNLOCKS.RUN)
      ? 1 : player.reality.realityMachines.e / Math.log10(TERESA_UNLOCKS.RUN.price)),
    node: {
      completeClass: "c-celestial-nav__test-complete",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(100, 100),
      rMajor: 32,
      rMinor: 22,
      legend: {
        text: "Reach 1e14 RM",
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: (function() {
      const pathStart = -Math.PI;
      const pathEnd = Math.PI;
      const path = LogarithmicSpiral.fromPolarEndpoints(new Vector(100, 100), -Math.PI, 69, Math.PI, 26);
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
      completeClass: "c-celestial-nav__test-complete",
      incompleteClass: "c-celestial-nav__test-incomplete",
      symbol: "Ϟ",
      position: new Vector(100, 100),
      rMajor: 16,
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
      ? 1 : Teresa.rmStore.e / Math.log10(TERESA_UNLOCKS.SHOP.price)),
    node: {
      completeClass: "c-celestial-nav__test-complete",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(225, 250),
      rMajor: 16,
      rMinor: 0,
      alwaysShowLegend: true,
      legend: {
        text: complete => {
          if (complete >= 1) return "Perk Point Shop";
          const rm = player.reality.realityMachines;
          const cost = TERESA_UNLOCKS.SHOP.price;
          return [
            "Perk Point Shop",
            `Pour ${shorten(rm, 1)} / ${shorten(cost, 0)} RM`
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
      path: LinearPath.connectCircles(new Vector(100, 100), 78 - 1, new Vector(225, 250), 16 - 1),
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "effarig-shop": {
    visible: () => true,
    complete: () => (Teresa.has(TERESA_UNLOCKS.EFFARIG)
      ? 1 : Teresa.rmStore.e / Math.log10(TERESA_UNLOCKS.EFFARIG.price)),
    node: {
      completeClass: "c-celestial-nav__effarig",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(300, 0),
      rMajor: 24,
      rMinor: 0,
      alwaysShowLegend: true,
      legend: {
        text: complete => {
          if (complete >= 1) return "Effarig's Shop";
          const rm = player.reality.realityMachines;
          const cost = TERESA_UNLOCKS.EFFARIG.price;
          return [
            "Effarig",
            `Pour ${shorten(rm, 1)} / ${shorten(cost, 0)} RM`
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
      path: LinearPath.connectCircles(new Vector(100, 100), 78 - 1, new Vector(300, 0), 24 - 1),
      fill: "url(#gradTeresaEffarig",
    }
  },
  "effarig-reality-unlock": {
    visible: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
    complete: () => 1,
    node: {
      completeClass: "c-celestial-nav__effarig",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(400, 50),
      rMajor: 16,
      rMinor: 0,
      legend: {
        text: "TBD",
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(300, 0), 24 - 1, new Vector(400, 50), 16 - 1),
      fill: "#5151ec",
    }
  },
  "effarig-infinity": {
    visible: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
    complete: () => (EffarigUnlock.infinity.isUnlocked ? 1 : 0),
    node: {
      completeClass: "c-celestial-nav__effarig",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(550, 25),
      rMajor: 60,
      rMinor: 52,
      legend: {
        text: "Effarig's Infinity",
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(400, 50), 16 - 1, new Vector(550, 25), 60 - 1),
      fill: "#5151ec",
    }
  },
  "effarig-eternity": {
    visible: () => EffarigUnlock.infinity.isUnlocked,
    complete: () => (EffarigUnlock.eternity.isUnlocked ? 1 : 0),
    drawOrder: -2,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#7131ec",
      position: new Vector(550, 25),
      rMajor: 40,
      rMinor: 30,
      legend: {
        text: "Effarig's Eternity",
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
  },
  "effarig-reality": {
    visible: () => EffarigUnlock.eternity.isUnlocked,
    complete: () => (EffarigUnlock.reality.isUnlocked ? 1 : 0),
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#A101ec",
      position: new Vector(550, 25),
      rMajor: 20,
      rMinor: 0,
      symbol: "Ϙ",
      legend: {
        text: "Effarig's Reality",
        angle: -120,
        diagonal: 52,
        horizontal: 16,
      },
    },
  },
  "enslaved": {
    visible: () => EffarigUnlock.reality.isUnlocked,
    complete: () => 1,
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#A101ec",
      position: new Vector(625, 175),
      rMajor: 24,
      rMinor: 0,
      alwaysShowLegend: true,
      legend: {
        text: "Enslaved",
        angle: -45,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(550, 25), 40 - 1, new Vector(625, 175), 24 - 1),
      fill: "#7131ec",
    }
  },
};