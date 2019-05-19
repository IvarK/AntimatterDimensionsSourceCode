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

(function() {
  function bindDimensionHotkeys(tier) {
    GameKeyboard.bindRepeatableHotkey(`${tier}`, () => buyManyDimension(tier));
    GameKeyboard.bindRepeatableHotkey(`shift+${tier}`, () => buyOneDimension(tier));
  }
  for (let i = 1; i < 9; i++) bindDimensionHotkeys(i);
}());

GameKeyboard.bindHotkey("a", () => toggleAutobuyers());
GameKeyboard.bindHotkey("b", () => BlackHoles.togglePause());
GameKeyboard.bindHotkey("u", () => automatorOnOff());

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
  if (player.money.lt(30)) {
    player.money = new Decimal(30);
  }
});

GameKeyboard.bindRepeatable("f", () => {
  GameUI.notify.info("Paying respects");
  SecretAchievement(13).unlock();
});
