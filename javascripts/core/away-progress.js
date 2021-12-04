import { GameDatabase } from "./secret-formula/game-database";

class AwayProgress {
  constructor(config) {
    this.name = config.name;
    this.isUnlocked = config.isUnlocked;
    this.awayOption = config.awayOption === undefined ? this.name : config.awayOption;
    this.showOption = config.showOption === undefined ? true : config.showOption;
    // This is an array of strings, each one the name of the next entry in the player object to navigate to
    // If there is no reference, it is accessed directly by the name through the player object.
    this.reference = config.reference === undefined ? [this.name] : config.reference;
    // Most of the entries in offline progress are props which can be directly read from the player object, but eg. for
    // achievements the raw data is an array of bitmasks. This structure allows generic support for indirect values.
    this.applyFn = config.applyFn === undefined ? x => x : config.applyFn;
    this.classObjectReference = config.classObjectReference === undefined ? this.name : config.classObjectReference;
    this.appearsInAwayModal = config.appearsInAwayModal === undefined ? true : config.appearsInAwayModal;
  }

  get option() {
    return player.options.awayProgress[this.awayOption];
  }

  set option(value) {
    player.options.awayProgress[this.awayOption] = value;
  }

  get classObject() {
    // Format the camelCase name to kebab-case
    return `c-modal-away-progress__${
      this.classObjectReference.replace(/[A-Z]/gu, match => `-${match.toLowerCase()}`)
    }`;
  }

  get formatName() {
    // Format the camelCase name to Title Case, with spaces added before the capital letters
    return this.name
      .replace(/[A-Z]/gu, match => ` ${match}`)
      .replace(/^\w/u, c => c.toUpperCase());
  }

  // Pass in player object. Navigate to there using each reference point. Return the place you arrived at.
  navigateTo(from) {
    let place = from;
    for (const goTo of this.reference) {
      place = place[goTo];
    }
    return this.applyFn(place);
  }
}

export const AwayProgressTypes = {
  all: {},
  index: [],
  showOption: [],
  appearsInAwayModal: [],
};

for (let index = 0; index < GameDatabase.awayProgressTypes.length; index++) {
  const entry = new AwayProgress(GameDatabase.awayProgressTypes[index]);
  const name = entry.name;
  AwayProgressTypes.all[name] = entry;
  AwayProgressTypes.index.push(name);
  if (entry.showOption) AwayProgressTypes.showOption.push(name);
  if (entry.appearsInAwayModal) AwayProgressTypes.appearsInAwayModal.push(name);
}
