import { TimeStudyState } from "./time-studies.js";

export class TriadStudyState extends TimeStudyState {
  constructor(config) {
    super(config, TIME_STUDY_TYPE.TRIAD);
  }

  get canBeBought() {
    return this.config.requirement.every(s => player.timestudy.studies.includes(s)) &&
      V.availableST >= this.STCost &&
      !this.isBought && this.config.unlocked();
  }

  get isBought() {
    return player.celestials.v.triadStudies.includes(this.config.id);
  }

  get description() {
    return this.config.description;
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (!this.canBeBought) return;
    player.celestials.v.triadStudies.push(this.config.id);
    player.celestials.v.STSpent += this.STCost;
    player.requirementChecks.reality.noTriads = false;
  }

  purchaseUntil() {
    studiesUntil(214);
    for (const id of this.config.requirement) TimeStudy(id).purchase();
    this.purchase();
  }
}

TriadStudyState.studies = mapGameData(
  GameDatabase.eternity.timeStudies.triad,
  config => new TriadStudyState(config)
);

export function TriadStudy(id) {
  return TriadStudyState.studies[id];
}
