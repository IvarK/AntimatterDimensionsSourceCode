/**
 * Class which handles the creation of all automator script templates, with the final script and potential
 * warnings for inputs being the only parts which are meant to be externally exposed. All the messy parsing
 * and potential warning/error finding happens internally.
 *
 * @member {String[]} lines               Array of lines of code which can be used within the automator
 * @member {String[]} warnings            List of feedback statements to provide to the player based on possible
 *  undesired behavior which may result from their particular input parameters
 * @member {String} storedTreeStr         String for specifically importing a supplied study tree. All templates
 *  will contain at most one tree within; the expected usage is that if some task requires multiple trees, then
 *  the player will use multiple templates to do so
 * @member {TimeStudyTree} storedTreeObj  Study tree object for the specified study tree; storing it within the
 *  object instead of parsing it as-needed higher up in the call chain reduces boilerplate code
 */
export class ScriptTemplate {
  constructor(params, templateName) {
    this.lines = [];
    this.warnings = [];
    switch (templateName) {
      case "climb EP":
        this.templateClimbEP(params);
        break;
      case "grind eternities":
        this.templateGrindEternities(params);
        break;
      case "grind infinities":
        this.templateGrindInfinities(params);
        break;
      case "do EC":
        this.templateDoEC(params);
        break;
      case "unlock dilation":
        this.templateUnlockDilation(params);
        break;
      default:
        throw new Error("Unrecognized template name in ScriptTemplate");
    }
  }

  /**
   * Special formatting for numbers in templates; we can't use format() here because that will change based on the
   * player's cuttent notation. This is generally desirable in the rest of the game, but in most notations will
   * result in unparseable garbage here. Numbers are formatted assuming they're integers, and Decimals are formatted
   * with 2 decimal places (in scientific notation if above 1000)
   * @param {Number | Decimal} num  Number to format, disregarding current notation settings
   * @returns String representation of the properly-formatted number
   */
  format(num) {
    if (typeof num === "number") return Math.round(num);
    if (num.lte(1000)) return num.toNumber().toFixed(2);
    return `${num.mantissa.toFixed(2)}e${num.exponent}`;
  }

  /**
   * Parses tree data out of the parameter object and stores within the storedTree fields. Relevant props of object
   * passed in:
   * @param {boolean} params.tree.nowait            Whether or not the automator should pause at this line and repeat
   *  until the whole tree is bought
   * @param {string | object} params.tree.studies   A study import string or preset object to buy. Preset object has
   *  the same formatting as a study preset; "name" and "studies" props which contain preset name and an import string
   *  respectively
   */
  storeTreeData(params) {
    if (!params.tree) return;
    const nowaitStr = params.tree.nowait ? " nowait" : "";
    if (typeof params.tree.studies === "string") {
      this.storedTreeStr = `studies${nowaitStr} ${params.tree.studies}`;
    } else {
      this.storedTreeStr = `studies${nowaitStr} load preset ${params.tree.name}`;
    }

    this.storedTreeObj = new TimeStudyTree(params.tree.studies);
    if (this.storedTreeObj.invalidStudies.length > 0) this.warnings.push("Tree contains invalid Study IDs");
    if (this.storedTreeObj.purchasedStudies.length < this.storedTreeObj.selectedStudies.length) {
      this.warnings.push("Tree structure results in some unbought studies when imported with an empty tree");
      if (!params.tree.nowait) this.warnings.push("Automator may possibly get stuck without nowait parameter");
    }
  }

  /**
   * Parses automator data out of a two-prop object storing autobuyer settings, into a suffix of automator code which
   * sets the autobuyer to those settings. Relevant props of object passed in:
   * @param {String} autoSettings.mode    "mult" or "time" for times highest and time modes, respectively
   * @param {Decimal} autoSettings.value  Numerical value for autobuyer settings (assumed to be seconds in time)
   * @returns String suffix to feed into an automator script, should be prefixed by "auto [prestige] "
   */
  parseAutobuyerProp(autoSettings) {
    switch (autoSettings.mode) {
      case "mult":
        return `${this.format(autoSettings.value)} x highest`;
      case "time":
        return `${this.format(autoSettings.value)} seconds`;
      default:
        throw new Error("Unrecognized autobuyer mode in automator script templates");
    }
  }

  /**
   * Parses the parameter object into a script that sets the infinity and eternity autobuyers and then repeatedly loops
   * buying a tree and eternitying until a target EP is reached. Relevant props of object passed in:
   * @param {Object} params.tree          Attributes of a study tree to repeatedly buy during grinding. Must be
   *  specified for this method, and nowait must be true for proper behavior.
   * @param {Decimal} params.finalEP      EP value at which to stop looping the script and continue onward
   * @param {Object} params.autoInfinity  Object containing props for the infinity autobuyer
   * @param {Object} params.autoEternity  Object containing props for the eternity autobuyer
   */
  templateClimbEP(params) {
    this.storeTreeData(params);
    this.lines.push(`auto infinity ${this.parseAutobuyerProp(params.autoInfinity)}`);
    this.lines.push(`auto eternity ${this.parseAutobuyerProp(params.autoEternity)}`);
    this.lines.push(`while ep < ${this.format(params.finalEP)} {`);
    this.lines.push(` ${this.storedTreeStr}`);
    this.lines.push(" studies respec");
    this.lines.push(" wait eternity");
    this.lines.push("}");
  }

  /**
   * Parses the parameter object into a script that sets autobuyer settings and then repeatedly eternities until a
   * target total eternity count is reached. Relevant props of object passed in:
   * @param {Object} params.tree                  Attributes of a study tree to buy before grinding
   * @param {Number} params.crunchesPerEternity   Number of crunches per eternity
   * @param {Decimal} params.eternities           Eternity count at which to stop grinding and move on
   */
  templateGrindEternities(params) {
    this.storeTreeData(params);
    this.lines.push(this.storedTreeStr);
    this.lines.push("auto eternity 0 ep");
    // We give it a bit of an extra "safety factor" of 5x in order to make sure it doesn't end up repeatedly going
    // to something like 1.6e308 due to poor rounding. The startingValue may fluctuate based on achievements, but
    // this can be a significant time save that we want to actually give the player if they have the e130 perk
    const gapToEternity = Number.MAX_VALUE / Currency.infinityPoints.startingValue.toNumber() * 5;
    this.lines.push(`auto infinity ${this.format(
      Math.pow(gapToEternity, 1 / params.crunchesPerEternity), 2)} x highest`);
    this.lines.push(`wait eternities > ${this.format(params.eternities, 2)}`);
    this.lines.push("auto eternity off");
  }

  /**
   * Parses the parameter object into a script that sets autobuyer settings and then repeatedly infinities until a
   * target total infinity or banked infinity count is reached. If threshold is banked infinities, assumes that the
   * player also has the achievement that lets them bank. Relevant props of object passed in:
   * @param {Object} params.tree          Attributes of a study tree to buy before grinding
   * @param {Decimal} params.infinities   Infinity count at which to stop grinding and move on
   * @param {Boolean} params.isBanked     If the script should check for banked infinities instead of normal
   *  infinities, calculating a modified threshold appropriately - we don't eternity repeatedly because this is
   *  slower due to some resources needing to be rebuilt every eternity
   */
  templateGrindInfinities(params) {
    this.storeTreeData(params);
    this.lines.push(this.storedTreeStr);
    this.lines.push("auto eternity off");
    this.lines.push(`auto infinity 5s`);
    if (params.isBanked) {
      const has191 = new TimeStudyTree(params.tree).purchasedStudies.includes(TimeStudy(191));
      if (!has191) this.warnings.push("Tree does not contain TS191; banking anything will require Achievement 131");
      const bankRate = has191 ? 0.1 : 0.05;
      this.lines.push("// Note: This template attempts to get all the Banked Infinities within a single Eternity");
      this.lines.push(`wait infinities > ${this.format(params.infinities.dividedBy(bankRate), 2)}`);
      this.lines.push("eternity");
    } else {
      this.lines.push(`wait infinities > ${this.format(params.infinities, 2)}`);
    }
  }

  /**
   * Parses the parameter object into a script that ________________________________________. Relevant props
   * of object passed in:
   * @param {Object} params.tree          A study tree to buy repeatedly
   * @param {Number} params.ec            Numerical value denoting the EC to attempt
   * @param {Number} params.completions   Minimum number of completions to wait for before moving onward
   * @param {Object} params.autoInfinity  Autobuyer settings for within the EC
   */
  templateDoEC(params) {
    // Import the tree and the EC study, supplying errors as appropriate
    this.storeTreeData(params);
    this.lines.push(this.storedTreeStr);
    const tree = this.storedTreeObj;
    if (tree.ec === 0) {
      this.lines.push(`unlock ec ${params.ec}`);
      // Attempt to buy it, supplying an error if we can't actually reach it
      if (!tree.hasRequirements(TimeStudy.eternityChallenge(params.ec), false, true)) {
        this.warnings.push("Specified Study Tree cannot reach specified EC");
      }
    } else this.warnings.push("Specified Study Tree already has a different EC unlocked");

    // Apply autobuyer settings; we specifically want to turn auto-eternity off so that we can manually trigger the
    // prestige - otherwise, the autobuyer may end up preempting multiple completions
    this.lines.push(`auto infinity ${this.parseAutobuyerProp(params.autoInfinity)}`);
    this.lines.push(`auto eternity off`);
    this.lines.push(`start ec ${params.ec}`);

    this.lines.push(`wait pending completions >= ${params.completions}`);
    this.lines.push("eternity");
  }

  /**
   * Parses the parameter object into a script that sets autobuyer settings and then repeatedly infinities until a
   * target total infinity or banked infinity count is reached. Makes some assumptions on bank rate. Relevant props
   * of object passed in:
   * @param {Object} params.tree          A study tree to buy repeatedly, which is passed to buyStudyTree()
   * @param {Object} params.autoInfinity  Object containing props for the infinity autobuyer
   * @param {Object} params.autoEternity  Object containing props for the eternity autobuyer
   */
  templateUnlockDilation(params) {
    this.storeTreeData(params);
    if (![231, 232, 233, 234].some(s => this.storedTreeObj.purchasedStudies.includes(TimeStudy(s)))) {
      this.warnings.push("Specified Study Tree cannot reach dilation");
    }
    this.lines.push(`auto infinity ${this.parseAutobuyerProp(params.autoInfinity)}`);
    this.lines.push(`auto eternity ${this.parseAutobuyerProp(params.autoEternity)}`);
    this.lines.push(`while tt < ${this.format(13000)} {`);
    this.lines.push(` ${this.storedTreeStr}`);
    this.lines.push(" studies respec");
    this.lines.push(" wait eternity");
    this.lines.push("}");
    this.lines.push("unlock dilation");
  }

  get script() {
    return this.lines.join("\n");
  }
}
