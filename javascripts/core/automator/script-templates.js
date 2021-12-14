export const ScriptTemplates = {
  /**
   * Outputs automator script code for purchasing a specified study tree. Relevant props of object passed in:
   * @param {string | object} params.startingTree.studies   A study import string or preset object to buy
   * @param {boolean} params.startingTree.nowait            Whether or not the automator should pause at this
   *  line and repeat until the whole tree is bought
   * @returns A properly-formatted string which will work in the automator
   */
  buyStudyTree(params) {
    const lines = [];
    const nowaitStr = params.startingTree.nowait ? " nowait" : "";
    lines.push(typeof params.startingTree.studies === "string"
      ? `studies${nowaitStr} ${params.startingTree}`
      : `studies${nowaitStr} load preset ${params.startingTree.name}`);
  },

  /**
   * Outputs automator script code for infinity farming. Relevant props of object passed in:
   * @param {object} params.startingTree  Attributes of a study tree to buy before grinding, which is passed along
   *  to buyStudyTree(). May be undefined, in which case it's skipped entirely
   * @param {Decimal} params.infinities   Infinity count at which to stop grinding and move on
   * @returns A properly-formatted string which will work in the automator
   * @param {boolean} params.isBanked     If the script should check for banked infinities instead of normal
   *  infinities, calculating a modified threshold appropriately - we don't eternity repeatedly because this is
   *  slower due to some resources needing to be rebuilt every eternity
   * @returns A properly-formatted string which will work in the automator
   */
  grindInfinities(params) {
    const lines = [];
    if (params.startingTree) lines.push(this.buyStudyTree(params));
    lines.push("auto eternity off");
    lines.push(`auto infinity 5s`);
    if (params.isBanked) {
      // We assume that the player has the banking study for calculating the threshold
      const bankRate = new TimeStudyTree(params.startingTree).purchasedStudies.includes(TimeStudy(191)) ? 0.1 : 0.05;
      lines.push(`wait infinities > ${format(params.infinities.dividedBy(bankRate), 2)}`);
      lines.push("eternity");
    } else {
      lines.push(`wait infinities > ${format(params.infinities, 2)}`);
    }
    return lines.join("/n");
  },

  /**
   * Outputs automator script code for eternity farming. Relevant props of object passed in:
   * @param {object} params.startingTree          Attributes of a study tree to buy before grinding, which is passed
   *  along to buyStudyTree(). May be undefined, in which case it's skipped entirely
   * @param {number} params.crunchesPerEternity   Number of crunches per eternity
   * @param {number} params.eternities            Eternity count at which to stop grinding and move on
   * @returns A properly-formatted string which will work in the automator
   */
  grindEternities(params) {
    const lines = [];
    if (params.startingTree) lines.push(this.buyStudyTree(params));
    lines.push("auto eternity 0 ep");
    // We give it a bit of an extra "safety factor" of 10x in order to make sure it doesn't end up repeatedly going
    // to something like 1.6e308 due to poor rounding. The startingValue may fluctuate based on achievements, but
    // this can be a significant time save that we want to actually give the player if they have the e130 perk
    const gapToEternity = Number.MAX_VALUE / Currency.infinityPoints.startingValue.toNumber() * 10;
    lines.push(`auto infinity ${format(Math.pow(gapToEternity, 1 / params.crunchesPerEternity), 2)} x highest`);
    lines.push(`wait eternities > ${format(params.eternities, 2)}`);
    return lines.join("/n");
  }
};
