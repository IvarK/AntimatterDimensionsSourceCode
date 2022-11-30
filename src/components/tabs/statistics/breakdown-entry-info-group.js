import { createEntryInfo } from "./breakdown-entry-info";

export class BreakdownEntryInfoGroup {
  constructor(keys) {
    this.entries = keys.map(key => createEntryInfo(key));
  }

  get hasVisibleEntries() {
    return this.entries.filter(e => e.isActive && (e.mult.neq(1) || e.pow !== 1)).length > 1;
  }
}

const cache = new Map();

/**
 * @returns {BreakdownEntryInfoGroup[]}
 */
export function getResourceEntryInfoGroups(key) {
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const treeGroups = GameDatabase.multiplierTabTree[key];
  const groups = treeGroups === undefined
    ? []
    : treeGroups.map(keys => new BreakdownEntryInfoGroup(keys));
  cache.set(key, groups);
  return groups;
}
