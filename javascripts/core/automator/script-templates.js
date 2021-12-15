export const ScriptTemplates = {
  /**
   * Outputs automator script code for purchasing a specified study tree. Relevant props of object passed in:
   * @param {string | object} params.tree.studies   A study import string or preset object to buy
   * @param {boolean} params.tree.nowait            Whether or not the automator should pause at this
   *  line and repeat until the whole tree is bought
   * @returns Object with two props - the output script and any possible feedback to present to the player
   */
  buyStudyTree(params) {
    const nowaitStr = params.tree.nowait ? " nowait" : "";
    const warnings = [];
    const treeObject = new TimeStudyTree(params.tree.studies);
    let scriptText;
    if (typeof params.tree.studies === "string") {
      scriptText = `studies${nowaitStr} ${params.tree.studies}`;
    } else {
      scriptText = `studies${nowaitStr} load preset ${params.tree.name}`;
    }
    if (treeObject.invalidStudies.length > 0) warnings.push("Tree contains invalid Study IDs");
    else if (treeObject.purchasedStudies.length < treeObject.selectedStudies.length) {
      warnings.push("Tree structure results in some unbought studies when imported with an empty tree");
    }

    return {
      script: scriptText,
      feedback: warnings,
    };
  },

  /**
   * Outputs automator script code for purchasing a specified study tree. Relevant props of object passed in:
   * @param {object} autoSettings   Mode is either "mult" or "time" and value is a Decimal; in time mode, this is
   *  assumed to be seconds
   * @returns String specifying parameters to feed into an automator script
   */
  parseAutobuyerProp(autoSettings) {
    switch (autoSettings.mode) {
      case "mult":
        return `${format(autoSettings.value, 2, 1)} x highest`;
      case "time":
        return `${format(autoSettings.value, 2, 1)} seconds`;
      default:
        throw new Error("Unrecognized autobuyer mode in automator script templates");
    }
  },

  /**
   * Outputs automator script code for eternity farming. Relevant props of object passed in:
   * @param {object} params.tree          Attributes of a study tree to repeatedly buy during grinding, which is passed
   *  along to buyStudyTree(). Must be specified for this method
   * @param {Decimal} params.finalEP      EP value at which to stop looping the script
   * @param {object} params.autoInfinity  Object containing props for the infinity autobuyer
   * @param {object} params.autoEternity  Object containing props for the eternity autobuyer
   * @returns Object with two props - the output script and any possible feedback to present to the player
   */
  climbEP(params) {
    const lines = [];
    const warnings = [];

    lines.push(`auto infinity ${this.parseAutobuyerProp(params.autoInfinity)}`);
    lines.push(`auto eternity ${this.parseAutobuyerProp(params.autoEternity)}`);
    lines.push(`while ep < ${format(params.finalEP, 2)} {`);
    // The automator will immediately get stuck here if we don't specifically set nowait
    params.tree.nowait = true;
    const studyImport = this.buyStudyTree(params);
    lines.push(studyImport.script);
    for (const message of studyImport.feedback) warnings.push(message);
    lines.push("studies respec");
    lines.push("wait eternity");
    lines.push("}");

    return {
      script: lines.join("/n"),
      feedback: warnings,
    };
  },

  /**
   * Outputs automator script code for infinity farming. Relevant props of object passed in:
   * @param {object} params.tree          Attributes of a study tree to buy before grinding, which is passed along
   *  to buyStudyTree(). May be undefined, in which case it's skipped entirely
   * @param {Decimal} params.infinities   Infinity count at which to stop grinding and move on
   * @returns A properly-formatted string which will work in the automator
   * @param {boolean} params.isBanked     If the script should check for banked infinities instead of normal
   *  infinities, calculating a modified threshold appropriately - we don't eternity repeatedly because this is
   *  slower due to some resources needing to be rebuilt every eternity
   * @returns Object with two props - the output script and any possible feedback to present to the player
   */
  grindInfinities(params) {
    const lines = [];
    const warnings = [];

    if (params.tree) {
      const studyImport = this.buyStudyTree(params);
      lines.push(studyImport.script);
      for (const message of studyImport.feedback) warnings.push(message);
    }
    lines.push("auto eternity off");
    lines.push(`auto infinity 5s`);
    if (params.isBanked) {
      // We assume that the player has the banking study for calculating the threshold
      const has191 = new TimeStudyTree(params.tree).purchasedStudies.includes(TimeStudy(191));
      if (!has191) warnings.push("Tree does not contain TS191; banking anything will require Achievement 131");
      const bankRate = has191 ? 0.1 : 0.05;
      lines.push(`wait infinities > ${format(params.infinities.dividedBy(bankRate), 2)}`);
      lines.push("eternity");
    } else {
      lines.push(`wait infinities > ${format(params.infinities, 2)}`);
    }

    return {
      script: lines.join("/n"),
      feedback: warnings,
    };
  },

  /**
   * Outputs automator script code for eternity farming. Relevant props of object passed in:
   * @param {object} params.tree                  Attributes of a study tree to buy before grinding, which is passed
   *  along to buyStudyTree(). May be undefined, in which case it's skipped entirely
   * @param {number} params.crunchesPerEternity   Number of crunches per eternity
   * @param {Decimal} params.eternities           Eternity count at which to stop grinding and move on
   * @returns {object} Object with two props - the output script and any possible feedback to present to the player
   */
  grindEternities(params) {
    const lines = [];
    const warnings = [];

    if (params.tree) {
      const studyImport = this.buyStudyTree(params);
      lines.push(studyImport.script);
      for (const message of studyImport.feedback) warnings.push(message);
    }
    lines.push("auto eternity 0 ep");
    // We give it a bit of an extra "safety factor" of 10x in order to make sure it doesn't end up repeatedly going
    // to something like 1.6e308 due to poor rounding. The startingValue may fluctuate based on achievements, but
    // this can be a significant time save that we want to actually give the player if they have the e130 perk
    const gapToEternity = Number.MAX_VALUE / Currency.infinityPoints.startingValue.toNumber() * 10;
    lines.push(`auto infinity ${format(Math.pow(gapToEternity, 1 / params.crunchesPerEternity), 2)} x highest`);
    lines.push(`wait eternities > ${format(params.eternities, 2)}`);

    return {
      script: lines.join("/n"),
      feedback: warnings,
    };
  }
};
