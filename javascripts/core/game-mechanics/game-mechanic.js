"use strict";

/**
 * @abstract
 */
class GameMechanicState extends Effect {
  constructor(config) {
    super();
    if (!config) throw new Error("Must specify config for GameMechanicState");
    this._config = config;
    if (config.effect !== undefined && !this.hasCustomEffectValue) {
      this.defineEffect(config.effect, config.cap, config.effectCondition);
    }
    if (config.effects !== undefined) {
      this.effects = {};
      for (const key in config.effects) {
        const effect = new Effect();
        const value = config.effects[key];
        if (typeof value === "number" || value instanceof Decimal) {
          effect.defineEffect(value);
        } else {
          effect.defineEffect(value.effect, value.cap, value.effectCondition);
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

  get hasCustomEffectValue() {
    return false;
  }

  static createAccessor(gameData) {
    const index = mapGameData(gameData, config => new this(config));
    const accessor = id => index[id];
    accessor.index = index;
    return accessor;
  }
}
