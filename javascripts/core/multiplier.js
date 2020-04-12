"use strict";

class Multiplier {
  constructor(name) {
    this.name = name;
    this.effects = {
      list: []
    };
    this.effects.find = value => this.effects.list.find(n => n.name === value);
    this.effects.add = value => this.effects.list.push(value);
  }

  /**
   * @param {String} name
   * @param {function} callback
   * @param {function} conditional
   * @param {String} type
   * @param {String} opperator
   * @return {Object}
   */

  // eslint-disable-next-line max-params
  breakdown(name, callback, conditional, type, opperator) {
    let display;
    if (type === "multiplier") display = () => formatX(callback(), 2, 2);
    if (type === "divisor") display = () => `/${format(callback(), 2, 2)}`;
    if (type === "power" || type === "exponent") display = () => formatPow(callback(), 2, 2);
    if (type === "percentage") {
      if (opperator === "add") display = () => `+${formatPercents(callback(), 2, 2)}`;
      else display = () => formatPercents(callback(), 2, 2);
    }
    if (type === "amount") {
      if (opperator === "add") display = () => `+${format(callback(), 2, 2)}`;
      else if (opperator === "subtract") display = () => `-${format(callback(), 2, 2)}`;
      else display = () => format(callback(), 2, 2);
    }

    return {
      name,
      value: callback,
      effect: display,
      show: conditional
    };
  }

  /**
   * @param {String} name
   * @return {Multiplier}
   */
  static find(name) {
    const multiplier = Multipliers.list.find(n => n.name === name);
    return multiplier;
  }
}