"use strict";

// Add your hotkeys and combinations here
// GameKeyboard.bind for single press combinations
// GameKeyboard.bindRepeatable for repeatable combinations
// Hotkeys obey player.options.hotkeys option
// GameKeyboard.bindHotkey for single press hotkeys
// GameKeyboard.bindRepeatableHotkey for repeatable hotkeys
// GameKeyboard class uses Mousetrap under the hood, so for more details visit
// https://craig.is/killing/mice

GameKeyboard.bindRepeatableHotkey("m", () => maxAll());
GameKeyboard.bindRepeatableHotkey("d", () => softResetBtnClick());
GameKeyboard.bindRepeatableHotkey("g", () => galaxyResetBtnClick());
GameKeyboard.bindRepeatableHotkey("s", () => sacrificeBtnClick());
GameKeyboard.bindRepeatableHotkey("r", () => replicantiGalaxy());
GameKeyboard.bindRepeatableHotkey("t", () => buyMaxTickSpeed());
GameKeyboard.bindRepeatableHotkey("shift+t", () => buyTickSpeed());
GameKeyboard.bindRepeatableHotkey("c", () => bigCrunchResetRequest());
GameKeyboard.bindRepeatableHotkey("e", () => eternity());

// Toggle autobuyers
function toggleAutobuyer(id) {
  if (!player.options.autobuyersOn) {
    return;
  }
  
  const buyer = Autobuyers.all[id];
  if (buyer.isUnlocked) {
    buyer.toggle();
  }
}

function toggleBuySingles(id) {
  if (!player.options.autobuyersOn) {
    return;
  }
  
  const buyer = Autobuyers.all[id];
  if (buyer.isUnlocked && buyer.toggleMode !== null) {
    buyer.toggleMode();
  }
}

GameKeyboard.bindHotkey("z+t", () => toggleAutobuyer(8));
GameKeyboard.bindHotkey("shift+z+t", () => toggleBuySingles(8));
GameKeyboard.bindHotkey("z+d", () => toggleAutobuyer(9));
GameKeyboard.bindHotkey("z+g", () => toggleAutobuyer(10));
GameKeyboard.bindHotkey("z+c", () => toggleAutobuyer(11));
GameKeyboard.bindHotkey("z+s", () => toggleAutobuyer(12));
GameKeyboard.bindHotkey("z+e", () => toggleAutobuyer(13));
GameKeyboard.bindHotkey("z+r", () => Replicanti.galaxies.autobuyer.toggle());

(function() {
  function bindDimensionHotkeys(tier) {
    GameKeyboard.bindRepeatableHotkey(`${tier}`, () => buyManyDimension(tier));
    GameKeyboard.bindRepeatableHotkey(`shift+${tier}`, () => buyOneDimension(tier));
    GameKeyboard.bindHotkey(`z+${tier}`, () => toggleAutobuyer(tier - 1));
    GameKeyboard.bindHotkey(`shift+z+${tier}`, () => toggleBuySingles(tier - 1));

  }
  for (let i = 1; i < 9; i++) bindDimensionHotkeys(i);
}());

GameKeyboard.bindHotkey("a", () => Autobuyers.toggle());
GameKeyboard.bindHotkey("b", () => BlackHoles.togglePause());
GameKeyboard.bindHotkey("u", () => {
  if (AutomatorBackend.isRunning) {
    AutomatorBackend.pause();
  }
  else if (AutomatorBackend.isOn) {
    AutomatorBackend.mode = AutomatorMode.RUN;
  }
});

GameKeyboard.bindHotkey("esc", () => {
  if (Modal.isOpen) {
    Modal.hide();
  } else {
    Tab.options.show();
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

GameKeyboard.bindHotkey(["ctrl+s", "meta+s"], () => {
  GameStorage.save();
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

GameKeyboard.bind("up up down down left right left right b a", () => {
  SecretAchievement(17).unlock();
  if (player.antimatter.lt(30)) {
    player.antimatter = new Decimal(30);
  }
});

GameKeyboard.bindRepeatable("f", () => {
  GameUI.notify.info("Paying respects");
  SecretAchievement(13).unlock();
});
