import Vue from "vue";

import { DC } from "@/core/constants";

export class BreakdownEntryInfo {
  constructor(key) {
    this.key = key;
    const keyArgs = this.key.split("_");
    const dbEntry = GameDatabase.multiplierTabValues[keyArgs[0]][keyArgs[1]];
    const args = keyArgs.length >= 3
      ? keyArgs.slice(2).map(a => (a.match("^\\d+$") ? Number(a) : a))
      : [];
    this._name = createGetter(dbEntry.name, args);
    this._multValue = createGetter(dbEntry.multValue, args);
    this._powValue = createGetter(dbEntry.powValue, args);
    this._dilationEffect = createGetter(dbEntry.dilationEffect, args);
    this._isActive = createGetter(dbEntry.isActive, args);
    this._fakeValue = createGetter(dbEntry.fakeValue, args);
    this._icon = createGetter(dbEntry.icon, args);
    this._displayOverride = createGetter(dbEntry.displayOverride, args);
    this._isDilated = createGetter(dbEntry.isDilated, args);
    this._isBase = createGetter(dbEntry.isBase, args);
    this._ignoresNerfPowers = createGetter(dbEntry.ignoresNerfPowers, args);
    this.data = Vue.observable({
      mult: new Decimal(0),
      pow: 0,
      isVisible: false,
      lastVisibleAt: 0
    });
  }

  update() {
    const isVisible = this.isVisible;
    this.data.mult.fromDecimal(isVisible ? this.mult : DC.D1);
    this.data.pow = isVisible ? this.pow : 1;
    this.data.isVisible = isVisible;
    if (isVisible) {
      this.data.lastVisibleAt = Date.now();
    }
  }

  get name() {
    return this._name();
  }

  get mult() {
    return new Decimal(this._multValue() ?? 1);
  }

  get pow() {
    return this._powValue() ?? 1;
  }

  get dilationEffect() {
    return this._dilationEffect() ?? 1;
  }

  get isActive() {
    return this._isActive() ?? false;
  }

  get fakeValue() {
    return this._fakeValue();
  }

  get icon() {
    return this._icon();
  }

  get displayOverride() {
    return this._displayOverride();
  }

  get isDilated() {
    return this._isDilated();
  }

  get isBase() {
    return this._isBase();
  }

  get ignoresNerfPowers() {
    return this._ignoresNerfPowers() ?? false;
  }

  get isVisible() {
    return this.isActive && (this.pow !== 1 || this.mult.neq(1));
  }
}

function createGetter(property, args) {
  if (typeof property === "function") {
    return () => property(...args);
  }

  return () => property;
}

const cache = new Map();

export function createEntryInfo(key) {
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const entry = new BreakdownEntryInfo(key);
  cache.set(key, entry);
  return entry;
}
