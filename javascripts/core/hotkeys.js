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


GameKeyboard.bindHotkey("a", () => {
  Autobuyers.toggle();
  GameUI.notify.info(`Autobuyers ${(player.auto.autobuyersOn) ? "enabled" : "disabled"}`);
});
GameKeyboard.bindHotkey("alt+a", () => {
  player.auto.disableContinuum = !player.auto.disableContinuum;
  GameUI.notify.info(`${(player.auto.disableContinuum) ? "Disabled" : "Enabled"} Continuum`);
});

GameKeyboard.bindHotkey("b", () => BlackHoles.togglePause());

GameKeyboard.bindHotkey("u", () => {
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
});
GameKeyboard.bindHotkey("shift+u", () => {
  if (Player.automatorUnlocked) {
    const action = AutomatorBackend.isOn ? "Restarting" : "Starting";
    GameUI.notify.info(`${action} script "${AutomatorBackend.scriptName}"`);

    AutomatorBackend.restart();
    AutomatorBackend.start();
  }
});

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

// TODO: Change this so that it works correctly, this is just a stopgap
GameKeyboard.bind("enter up up down down left right left right b a", () => {
  SecretAchievement(17).unlock();
  Currency.antimatter.bumpTo(30);
});

GameKeyboard.bindRepeatable("f", () => {
  GameUI.notify.info("Paying respects");
  SecretAchievement(13).unlock();
});
