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
GameKeyboard.bindRepeatableHotkey("c", () => bigCrunchReset());
GameKeyboard.bindRepeatableHotkey("e", () => eternity());

for (let i = 1; i < 9; i++) {
  GameKeyboard.bindRepeatableHotkey(`${i}`, () => buyManyDimension(i));
  GameKeyboard.bindRepeatableHotkey(`shift+${i}`, () => buyOneDimension(i));
}

GameKeyboard.bindHotkey("a", () => toggleAutobuyers());
GameKeyboard.bindHotkey("esc", () => {
  if (Modal.isOpen()) {
    Modal.hide();
  }
  else {
    Tab.options.show();
  }
});
GameKeyboard.bindHotkey("b", () => pauseBlackHole());

GameKeyboard.bind("shift", () => setShiftKey(true), "keydown");
GameKeyboard.bind("shift", () => setShiftKey(false), "keyup");

GameKeyboard.bind(["ctrl", "command"], () => setControlKey(true), "keydown");
GameKeyboard.bind(["ctrl", "command"], () => setControlKey(false), "keyup");

GameKeyboard.bind(["ctrl+shift", "command+shift"], () => setControlShiftKey(true), "keydown");

GameKeyboard.bind("9", () => giveAchievement("That dimension doesn’t exist"));

GameKeyboard.bind(["ctrl+shift+c", "ctrl+shift+i", "ctrl+shift+j", "f12"], () => {
  giveAchievement("Stop right there criminal scum!")
});

GameKeyboard.bind("up up down down left right left right b a", () => {
  giveAchievement("30 Lives");
  if (player.money.lt(30)) {
    player.money = new Decimal(30);
  }
});

GameKeyboard.bindRepeatable("f", () => {
  GameUI.notify.info("Paying respects");
  giveAchievement("It pays to have respect");
});
