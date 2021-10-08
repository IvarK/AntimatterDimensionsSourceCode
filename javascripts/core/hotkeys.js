"use strict";

// Add your hotkeys and combinations here
// GameKeyboard.bind for single press combinations
// GameKeyboard.bindRepeatable for repeatable combinations
// Hotkeys obey player.options.hotkeys option
// GameKeyboard.bindHotkey for single press hotkeys
// GameKeyboard.bindRepeatableHotkey for repeatable hotkeys
// GameKeyboard class uses Mousetrap under the hood, so for more details visit
// https://craig.is/killing/mice

// Free keys:
// i, j, k, l, n, o, p, q, v, w, x, z


const shortcuts = [
  {
    name: "Toggle Autobuyers",
    keys: ["a"],
    type: "bindHotkey",
    function: () => keyboardToggleAutobuyers(),
    visible: () => true
  }, {
    name: "Buy one Tickspeed",
    keys: ["shift", "t"],
    type: "bindRepeatableHotkey",
    function: () => buyTickSpeed(),
    visible: () => true
  }, {
    name: "Buy max Tickspeed",
    keys: ["t"],
    type: "bindRepeatableHotkey",
    function: () => buyMaxTickSpeed(),
    visible: () => true
  }, {
    name: "Max all",
    keys: ["m"],
    type: "bindRepeatableHotkey",
    function: () => maxAll(),
    visible: () => true
  }, {
    name: "Dimensional Sacrifice",
    keys: ["s"],
    type: "bindRepeatableHotkey",
    function: () => sacrificeBtnClick(),
    visible: () => true
  }, {
    name: "Dimension Boost",
    keys: ["d"],
    type: "bindRepeatableHotkey",
    function: () => Reset.dimensionBoost.request({ gain: { bulk: true } }),
    visible: () => true
  }, {
    name: "Single Dimension Boost",
    keys: ["shift", "d"],
    type: "bindRepeatableHotkey",
    function: () => Reset.dimensionBoost.request({ gain: { bulk: false } }),
    visible: () => false
  }, {
    name: "Antimatter Galaxy",
    keys: ["g"],
    type: "bindRepeatableHotkey",
    function: () => requestGalaxyReset(true),
    visible: () => true
  }, {
    name: "Single Antimatter Galaxy",
    keys: ["shift", "g"],
    type: "bindRepeatableHotkey",
    function: () => requestGalaxyReset(false),
    visible: () => false
  }, {
    name: "Big Crunch",
    keys: ["c"],
    type: "bindRepeatableHotkey",
    function: () => Reset.bigCrunch.request(),
    visible: () => true
  }, {
    name: "Replicanti Galaxy",
    keys: ["r"],
    type: "bindRepeatableHotkey",
    function: () => replicantiGalaxy(),
    visible: () => Replicanti.areUnlocked || PlayerProgress.eternityUnlocked()
  }, {
    name: "Eternity",
    keys: ["e"],
    type: "bindRepeatableHotkey",
    function: () => eternityResetRequest(),
    visible: () => PlayerProgress.eternityUnlocked() || Player.canEternity
  }, {
    name: "Reality",
    keys: ["y"],
    type: "bindRepeatableHotkey",
    function: () => requestManualReality(),
    visible: () => PlayerProgress.realityUnlocked() || isRealityAvailable()
  }, {
    name: "Start/Pause Automator",
    keys: ["u"],
    type: "bindHotkey",
    function: () => keyboardAutomatorToggle(),
    visible: () => PlayerProgress.realityUnlocked()
  }, {
    name: "Restart Automator",
    keys: ["shift", "u"],
    type: "bindHotkey",
    function: () => keyboardAutomatorRestart(),
    visible: () => PlayerProgress.realityUnlocked()
  }, {
    name: "Toggle Black Hole",
    keys: ["b"],
    type: "bindHotkey",
    function: () => BlackHoles.togglePause(),
    visible: () => PlayerProgress.realityUnlocked()
  }, {
    name: "Toggle Continuum",
    keys: ["alt", "a"],
    type: "bindHotkey",
    function: () => keyboardToggleContinuum(),
    visible: () => Laitela.continuumUnlocked
  }, {
    name: "Save game",
    keys: ["ctrl", "s"],
    type: "bindHotkey",
    function: () => {
      GameStorage.save(false, true);
      return false;
    },
    visible: () => true
  }, {
    name: "Export game",
    keys: ["ctrl", "e"],
    type: "bindHotkey",
    function: () => {
      GameStorage.export();
      return false;
    },
    visible: () => true
  }, {
    name: "Open \"How to Play\" pop-up",
    keys: ["h"],
    type: "bindHotkey",
    function: () => keyboardH2PToggle(),
    visible: () => true
  }, {
    name: "Modify visible tabs",
    keys: ["tab"],
    type: "bindHotkey",
    function: () => {
      Modal.hiddenTabs.show();
      return false;
    },
    visible: () => true
  }, {
    name: "Close pop-up or open options",
    keys: ["esc"],
    type: "bindHotkey",
    function: () => keyboardPressEscape(),
    visible: () => true
  }, {
    name: "Paying respects",
    keys: ["f"],
    type: "bindRepeatable",
    function: () => {
      GameUI.notify.info("Paying respects");
      SecretAchievement(13).unlock();
    },
    visible: () => false
  }, {
    name: "Change Tab",
    keys: ["up"],
    type: "bindHotkey",
    function: () => keyboardTabChange("up"),
    visible: () => false
  }, {
    name: "Change Tab",
    keys: ["down"],
    type: "bindHotkey",
    function: () => keyboardTabChange("down"),
    visible: () => false
  }, {
    name: "Change Subtab",
    keys: ["left"],
    type: "bindHotkey",
    function: () => keyboardTabChange("left"),
    visible: () => false
  }, {
    name: "Change Subtab",
    keys: ["right"],
    type: "bindHotkey",
    function: () => keyboardTabChange("right"),
    visible: () => false
  }, {
    name: "Doesn't exist",
    keys: ["9"],
    type: "bind",
    function: () => SecretAchievement(41).unlock(),
    visible: () => false
  }
];

for (const hotkey of shortcuts) {
  let keys = "";
  for (const key of hotkey.keys) {
    // There may be multiple keys required, and the syntax is key1+key2+key3
    if (keys === "") keys += key;
    else keys += `+${key}`;
  }
  // If the keybind starts with ctrl, also add an alternative that uses meta
  if (keys.startsWith("ctrl")) keys = [keys, `meta${keys.substring(4)}`];
  GameKeyboard[hotkey.type](keys, hotkey.function);
}

// We need to know whether the player is holding R or not for the
// replicanti galaxy
GameKeyboard.bind("r", () => setHoldingR(true), "keydown");
GameKeyboard.bind("r", () => setHoldingR(false), "keyup");

// Same thing with Shift
GameKeyboard.bind("shift", () => setShiftKey(true), "keydown");
GameKeyboard.bind("shift", () => setShiftKey(false), "keyup");


GameKeyboard.bindHotkey("alt+t", () => toggleAutobuyer(Autobuyer.tickspeed));
GameKeyboard.bindHotkey("shift+alt+t", () => toggleBuySingles(Autobuyer.tickspeed));
GameKeyboard.bindHotkey("alt+s", () => toggleAutobuyer(Autobuyer.sacrifice));
GameKeyboard.bindHotkey("alt+d", () => toggleAutobuyer(Autobuyer.dimboost));
GameKeyboard.bindHotkey("alt+g", () => toggleAutobuyer(Autobuyer.galaxy));
GameKeyboard.bindHotkey("alt+r", () => toggleAutobuyer(Autobuyer.replicantiGalaxy));

GameKeyboard.bindHotkey("alt+c", () => toggleAutobuyer(Autobuyer.bigCrunch));
GameKeyboard.bindHotkey("alt+e", () => toggleAutobuyer(Autobuyer.eternity));
GameKeyboard.bindHotkey("alt+y", () => toggleAutobuyer(Autobuyer.reality));

(function() {
  function bindDimensionHotkeys(tier) {
    GameKeyboard.bindRepeatableHotkey(`${tier}`, () => buyManyDimension(tier));
    GameKeyboard.bindRepeatableHotkey(`shift+${tier}`, () => buyOneDimension(tier));
    GameKeyboard.bindHotkey(`alt+${tier}`, () => toggleAutobuyer(Autobuyer.antimatterDimension(tier)));
    GameKeyboard.bindHotkey(`shift+alt+${tier}`, () => toggleBuySingles(Autobuyer.antimatterDimension(tier)));
  }
  for (let i = 1; i < 9; i++) bindDimensionHotkeys(i);
}());

// A few special GameKeyboards
GameKeyboard.bind(
  ["ctrl+shift+c", "ctrl+shift+i", "ctrl+shift+j", "f12"],
  () => SecretAchievement(23).unlock()
);

// TODO: Change this so that it works correctly, this is just a stopgap
GameKeyboard.bind("enter up up down down left right left right b a", () => {
  SecretAchievement(17).unlock();
  Currency.antimatter.bumpTo(30);
});


// Toggle autobuyers
function toggleAutobuyer(buyer) {
  if (Laitela.continuumActive && (buyer.name === "Tickspeed" || buyer.hasUnlimitedBulk)) {
    GameUI.notify.info("Continuum is enabled, you cannot alter this autobuyer");
  } else if (buyer.isUnlocked) {
    buyer.toggle();
    GameUI.notify.info(`${buyer.name} Autobuyer toggled ${(buyer.isActive) ? "on" : "off"}`);
  }
  return false;
}

function toggleBuySingles(buyer) {
  if (Laitela.continuumActive && (buyer.name === "Tickspeed" || buyer.hasUnlimitedBulk)) {
    GameUI.notify.info("Continuum is enabled, you cannot alter this autobuyer");
  } else if (buyer.isUnlocked && buyer.toggleMode !== null) {
    buyer.toggleMode();
    const bulkName = (buyer.name === "Tickspeed" || buyer.hasUnlimitedBulk) ? "max" : "10";
    GameUI.notify.info(`${buyer.name} Autobuyer set to buy ${(buyer.mode === 1) ? "singles" : bulkName}`);
  }
  return false;
}

function keyboardToggleAutobuyers() {
  Autobuyers.toggle();
  GameUI.notify.info(`Autobuyers ${(player.auto.autobuyersOn) ? "enabled" : "disabled"}`);
}

function keyboardToggleContinuum() {
  if (!Laitela.continuumUnlocked) return;
  player.auto.disableContinuum = !player.auto.disableContinuum;
  GameUI.notify.info(`${(player.auto.disableContinuum) ? "Disabled" : "Enabled"} Continuum`);
}

function keyboardAutomatorToggle() {
  // Automator must be unlocked
  if (Player.automatorUnlocked) {
    if (AutomatorBackend.isRunning) {
      AutomatorBackend.pause();
    } else if (AutomatorBackend.isOn) {
      AutomatorBackend.mode = AUTOMATOR_MODE.RUN;
    } else {
      GameUI.notify.info(`Starting script "${AutomatorBackend.scriptName}"`);
      AutomatorBackend.restart();
      AutomatorBackend.start();
      return;
    }
    const action = AutomatorBackend.isRunning ? "Resuming" : "Pausing";
    const linenum = AutomatorBackend.currentLineNumber;
    GameUI.notify.info(`${action} script "${AutomatorBackend.scriptName}" at line ${linenum}`);

  }
}

function keyboardAutomatorRestart() {
  if (Player.automatorUnlocked) {
    const action = AutomatorBackend.isOn ? "Restarting" : "Starting";
    GameUI.notify.info(`${action} script "${AutomatorBackend.scriptName}"`);

    AutomatorBackend.restart();
    AutomatorBackend.start();
  }
}

function keyboardPressEscape() {
  if (ui.view.modal.queue.length === 0) {
    Tab.options.show(true);
  } else {
    Modal.hide();
  }
}

function keyboardPressQuentionMark() {
  if (Modal.shortcuts.isOpen) {
    Modal.hide();
    return;
  }
  if (Modal.isOpen) return;
  Modal.shortcuts.show();
}

function keyboardH2PToggle() {
  if (Modal.h2p.isOpen) {
    Modal.hide();
    return;
  }
  if (Modal.isOpen) return;
  Modal.h2p.show();
  ui.view.h2pActive = true;
}

function keyboardTabChange(direction) {
  // Current tabs
  const currentTab = Tabs.current.config.key;
  const currentSubtab = Tabs.current._currentSubtab.key;
  // Make an array of all the unlocked tabs
  let tabs = Tabs.all.filter(i => i.config.key === currentTab || i.isAvailable && i.config.key !== "shop")
    .map(i => i.config.key);
  const subtabs = Tabs.current.subtabs.filter(i => i.key === currentSubtab || i.isAvailable).map(i => i.key);
  // Reconfigure the tab order if its New UI
  if (ui.view.newUI) {
    const newUITabChange = ["achievements", "statistics", "options"].filter(i => Tab[i].isAvailable);
    tabs = tabs.filter(tab => !newUITabChange.includes(tab));
    tabs.push(...newUITabChange);
  }
  if (Tab.shop.isAvailable) tabs.push("shop");

  // Find the index of the tab and subtab we are on
  let top = tabs.indexOf(currentTab);
  let sub = subtabs.indexOf(currentSubtab);

  // Move in that direction
  switch (direction) {
    case "up":
      top--;
      break;
    case "down":
      top++;
      break;
    case "left":
      sub--;
      break;
    case "right":
      sub++;
      break;
    default:
      throw new Error("Invalid keyboard movement direction");
  }
  // Loop around if needed
  top = (top + tabs.length) % tabs.length;
  sub = (sub + subtabs.length) % subtabs.length;

  // And now we go there. Return false so the arrow keys don't do anything else
  if (direction === "up" || direction === "down") {
    Tab[tabs[top]].show(true);
  } else {
    Tab[tabs[top]][subtabs[sub]].show(true);
  }
  return false;
}
