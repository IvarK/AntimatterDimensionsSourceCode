import { GameDatabase } from "./secret-formula/game-database";

class ConfirmationState {
  constructor(config) {
    this.name = config.name;
    this._confirmationSetting = config.option;
    this.isUnlocked = () => config.isUnlocked() || player.records.fullGameCompletions > 0;
  }

  get option() {
    return player.options.confirmations[this._confirmationSetting];
  }

  set option(value) {
    player.options.confirmations[this._confirmationSetting] = value;
  }
}

export const ConfirmationTypes = GameDatabase.confirmationTypes.mapToObject(
  config => config.option,
  config => new ConfirmationState(config)
);

ConfirmationTypes.index = Object.values(ConfirmationTypes);
