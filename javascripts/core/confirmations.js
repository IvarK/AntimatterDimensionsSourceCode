import { GameDatabase } from "./secret-formula/game-database";

class ConfirmationState {
  constructor(config) {
    this.name = config.name;
    this.confirmationSetting = config.option;
    this.isUnlocked = config.isUnlocked;
  }

  get option() {
    return player.options.confirmations[this.confirmationSetting];
  }

  set option(value) {
    player.options.confirmations[this.confirmationSetting] = value;
  }
}

export const ConfirmationTypes = [];

for (const entry of GameDatabase.confirmationTypes) {
  ConfirmationTypes.push(new ConfirmationState(entry));
}
