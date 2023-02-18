import { Effect } from "./effect";

/**
 * @abstract
 */
export class GameMechanicState extends Effect {
  constructor(config) {
    if (!config) {
      throw new Error("Must specify config for GameMechanicState");
    }
    super(config.effect, config.cap, config.effectCondition);
    this._config = config;
    if (config.effects !== undefined) {
      this.effects = {};
      for (const key in config.effects) {
        const nested = config.effects[key];
        let effect;
        if (typeof nested === "number" || typeof nested === "function" || nested instanceof Decimal) {
          effect = new Effect(nested);
        } else {
          effect = new Effect(nested.effect, nested.cap, nested.effectCondition);
        }
        Object.defineProperty(effect, "isEffectActive", {
          configurable: false,
          get: () => this.isEffectActive
        });
        this.effects[key] = effect;
      }
    }
  }

  get config() {
    return this._config;
  }

  get id() {
    return this.config.id;
  }

  registerEvents(events, callback) {
    if (events === undefined) return;
    for (const event of events instanceof Array ? events : [events]) {
      EventHub.logic.on(event, callback, this);
    }
  }

  static createAccessor(gameData) {
    const index = mapGameData(gameData, config => new this(config));
    const accessor = id => index[id];
    accessor.index = index;
    return accessor;
  }
}
