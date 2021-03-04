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

GameKeyboard.bindRepeatableHotkey("m", () => maxAll());
GameKeyboard.bindRepeatableHotkey("d", () => requestDimensionBoost(true));
GameKeyboard.bindRepeatableHotkey("shift+d", () => requestDimensionBoost(false));
GameKeyboard.bindRepeatableHotkey("g", () => requestGalaxyReset(true));
GameKeyboard.bindRepeatableHotkey("shift+g", () => requestGalaxyReset(false));
GameKeyboard.bindRepeatableHotkey("s", () => sacrificeBtnClick());
GameKeyboard.bindRepeatableHotkey("r", () => replicantiGalaxy());
GameKeyboard.bindRepeatableHotkey("t", () => buyMaxTickSpeed());
GameKeyboard.bindRepeatableHotkey("shift+t", () => buyTickSpeed());
GameKeyboard.bindRepeatableHotkey("c", () => bigCrunchResetRequest());
GameKeyboard.bindRepeatableHotkey("e", () => eternityResetRequest());
GameKeyboard.bindRepeatableHotkey("y", () => requestManualReality());

// We need to know whether the player is holding R or not for the
// replicanti galaxy
GameKeyboard.bind("r", () => setHoldingR(true), "keydown");
GameKeyboard.bind("r", () => setHoldingR(false), "keyup");


const AUTOBUYER_NAMES = {
  antimatterDimensions: ["1st Dimension", "2nd Dimension", "3rd Dimension", "4th Dimension",
               "5th Dimension", "6th Dimension", "7th Dimension", "8th Dimension"],
  single: ["Tickspeed", "Dimensional Sacrifice", "Dimension Boost", "Antimatter Galaxy", "Replicanti Galaxy"],
  prestige: ["Big Crunch", "Eternity", "Reality"]
};

// Toggle autobuyers
function toggleAutobuyer(type, id) {
  const buyer = Autobuyers[type].flat()[id];
  if (buyer.isUnlocked) {
    buyer.toggle();
    GameUI.notify.info(`${AUTOBUYER_NAMES[type][id]} Autobuyer toggled ${(buyer.isActive) ? "on" : "off"}`);
  }
  return false;
}

function toggleBuySingles(type, id) {
  const buyer = Autobuyers[type][id];
  if (buyer.isUnlocked && buyer.toggleMode !== null && !Laitela.continuumActive) {
    buyer.toggleMode();
    const name = AUTOBUYER_NAMES[type][id];
    const bulkName = (name === "Tickspeed" || buyer.hasUnlimitedBulk) ? "max" : "10";
    GameUI.notify.info(`${name} Autobuyer set to buy ${(buyer.mode === 1) ? "singles" : bulkName}`);
  }
  return false;
}

GameKeyboard.bindHotkey("alt+t", () => toggleAutobuyer("single", 0));
GameKeyboard.bindHotkey("shift+alt+t", () => toggleBuySingles("single", 0));
GameKeyboard.bindHotkey("alt+s", () => toggleAutobuyer("single", 1));
GameKeyboard.bindHotkey("alt+d", () => toggleAutobuyer("single", 2));
GameKeyboard.bindHotkey("alt+g", () => toggleAutobuyer("single", 3));
GameKeyboard.bindHotkey("alt+r", () => toggleAutobuyer("single", 4));

GameKeyboard.bindHotkey("alt+c", () => toggleAutobuyer("prestige", 0));
GameKeyboard.bindHotkey("alt+e", () => toggleAutobuyer("prestige", 1));
GameKeyboard.bindHotkey("alt+y", () => toggleAutobuyer("prestige", 2));

(function() {
  function bindDimensionHotkeys(tier) {
    GameKeyboard.bindRepeatableHotkey(`${tier}`, () => buyManyDimension(tier));
    GameKeyboard.bindRepeatableHotkey(`shift+${tier}`, () => buyOneDimension(tier));
    GameKeyboard.bindHotkey(`alt+${tier}`, () => toggleAutobuyer("antimatterDimensions", tier - 1));
    GameKeyboard.bindHotkey(`shift+alt+${tier}`, () => toggleBuySingles("antimatterDimensions", tier - 1));
  }
  for (let i = 1; i < 9; i++) bindDimensionHotkeys(i);
}());

GameKeyboard.bindHotkey("up", () => keyboardTabChange("up"));
GameKeyboard.bindHotkey("down", () => keyboardTabChange("down"));
GameKeyboard.bindHotkey("left", () => keyboardTabChange("left"));
GameKeyboard.bindHotkey("right", () => keyboardTabChange("right"));

function keyboardTabChange(direction) {
  // Make an array of all the unlocked tabs
  const tabs = Tabs.all.filter(i => i.isAvailable && i.config.key !== "shop").map(i => i.config.key);
  const subtabs = Tabs.current.subtabs.filter(i => i.isAvailable).map(i => i.key);
  // Reconfigure the tab order if its New UI
  if (ui.view.newUI) {
    tabs.splice(1, 3);
    tabs.push("achievements", "statistics", "options");
  }
  if (Tab.shop.isAvailable) tabs.push("shop");

  // Find the index of the tab and subtab we are on
  let top = tabs.indexOf(Tabs.current.config.key);
  let sub = subtabs.indexOf(Tabs.current._currentSubtab.key);

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

GameKeyboard.bindHotkey("a", () => {
  Autobuyers.toggle();
  GameUI.notify.info(`Autobuyers ${(player.auto.autobuyersOn) ? "enabled" : "disabled"}`);
});
GameKeyboard.bindHotkey("b", () => BlackHoles.togglePause());
GameKeyboard.bindHotkey("u", () => {
  // Automator must be unlocked
  if (player.realities >= 5) {
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
});
GameKeyboard.bindHotkey("shift+u", () => {
  if (player.realities >= 5) {
    const action = AutomatorBackend.isOn ? "Restarting" : "Starting";
    GameUI.notify.info(`${action} script "${AutomatorBackend.scriptName}"`);

    AutomatorBackend.restart();
    AutomatorBackend.start();
  }
});

GameKeyboard.bindHotkey("esc", () => {
  if (ui.view.modal.queue.length === 0) {
    Tab.options.show(true);
  } else {
    Modal.hide();
  }
});

GameKeyboard.bindHotkey("?", () => {
  if (Modal.shortcuts.isOpen) {
    Modal.hide();
    return;
  }
  if (Modal.isOpen) return;
  Modal.shortcuts.show();
});

GameKeyboard.bindHotkey("h", () => {
  if (Modal.h2p.isOpen) {
    Modal.hide();
    return;
  }
  if (Modal.isOpen) return;
  Modal.h2p.show();
  ui.view.h2pActive = true;
});

GameKeyboard.bindHotkey(["ctrl+s", "meta+s"], () => {
  GameStorage.save(false, true);
  return false;
});
GameKeyboard.bindHotkey(["ctrl+e", "meta+e"], () => {
  GameStorage.export();
  return false;
});

GameKeyboard.bind("shift", () => setShiftKey(true), "keydown");
GameKeyboard.bind("shift", () => setShiftKey(false), "keyup");

GameKeyboard.bind("9", () => SecretAchievement(41).unlock());

GameKeyboard.bind(
  ["ctrl+shift+c", "ctrl+shift+i", "ctrl+shift+j", "f12"],
  () => SecretAchievement(23).unlock()
);

GameKeyboard.bind("enter up up down down left right left right b a", () => {
  SecretAchievement(17).unlock();
  Currency.antimatter.bumpTo(30);
});

GameKeyboard.bindRepeatable("f", () => {
  GameUI.notify.info("Paying respects");
  SecretAchievement(13).unlock();
});
