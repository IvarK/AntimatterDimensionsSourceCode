import { createEntryInfo } from "./breakdown-entry-info";

export class BreakdownEntryInfoGroup {
  constructor(keys) {
    this.entries = keys.map(key => createEntryInfo(key));
  }

  // We show children entries under two cases; the first is when there is more than one child entry and
  // therefore showing a list would be useful. The other is when the entry itself is a "general" entry, which
  // will always be titled something vague like "Achievements" or "Time Studies". In this case, we also still show
  // it when there is exactly one child, so that the player can see exactly which ach/TS/etc is giving the effect.
  get hasVisibleEntries() {
    const activeChildren = this.entries.filter(e => e.isActive && (e.mult.neq(1) || e.pow !== 1));
    return activeChildren.length > 1 ||
      (activeChildren.length === 1 && activeChildren[0].key.startsWith("general"));
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
