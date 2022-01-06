import { GameDatabase } from "./secret-formula/game-database";
import { GameMechanicState } from "./game-mechanics/index.js";

export const Speedrun = {
  // Speedruns are initially paused until startRun is called, which happens as soon as the player purchases a AD or
  // uses the Konami code. Until then, they're free to do whatever they want with the UI
  startRun() {
    if (player.speedrun.hasStarted) return;
    player.speedrun.hasStarted = true;
    player.speedrun.startDate = Date.now();
    player.lastUpdate = Date.now();
  },
  isPausedAtStart() {
    return player.speedrun.isActive && !player.speedrun.hasStarted;
  },
};

class SpeedrunMilestone extends GameMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryComplete(args));
  }

  get name() {
    return this.config.name;
  }

  get isReached() {
    return player.speedrun.records[this.config.key] !== 0;
  }

  tryComplete(args) {
    if (!this.config.checkRequirement(args)) return;
    this.complete();
  }

  complete() {
    if (this.isReached) return;
    player.speedrun.records[this.config.key] = player.records.realTimePlayed;
    player.speedrun.mostRecentMilestoneID = this.config.id;
    GameUI.notify.success(`Speedrun Milestone Reached: ${this.name}`);
  }
}

export const SpeedrunMilestones = SpeedrunMilestone.createAccessor(GameDatabase.speedrunMilestones);
