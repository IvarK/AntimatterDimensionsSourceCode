import { GameDatabase } from "./game-database.js";

GameDatabase.reality.automator.templates = {
  /**
    * List of possible data types to dynamically generate in script templates
    * {
    *  @property {String} name              String to be used as a key for entries in this object
    *  @property {String[]} inputNames      For compound parameter types (ie. params which return an object),
    *   an array of Strings meant to indicate which input corresponds to which field in the UI
    *  @property {Type | Type[]} inputType  Type or array of Types indicating how the inputs should be
    *   formatted within the UI input fields
    *  @property {String[]} targets         For object parameters, specifies which fields of the object
    *   the inputs should be stored into
    *  @property {Function} map             A function to be used to map the inputs to their actual values
    *   which are stored in the param object. If undefined, assumed to be no mapping
    * }
    */
  paramTypes: [
    {
      name: "tree",
      inputNames: ["Keep going if some studies are missed?", "Exported Study Tree:"],
      inputType: [Boolean, String],
      targets: ["nowait", "studies"],
    },
    {
      name: "autobuyer",
      inputNames: ["Autobuyer Mode:", ""],
      inputType: [Boolean, String],
      targets: ["nowait", "studies"],
      map: x => {
        if (typeof x === "string") return x;
        return x ? "mult" : "time";
      }
    },
    {
      name: "boolean",
      inputType: Boolean,
    },
    {
      name: "string",
      inputType: String,
    },
    {
      name: "integer",
      inputType: String,
      map: x => Math.round(parseInt(x, 10)),
    },
    {
      name: "decimal",
      inputType: String,
      map: x => new Decimal(x),
    },
  ],
  /**
    * List automator script templates
    * {
    *  @property {String} name          Name of script template, also used as a key within the constructor for
    *   ScriptTemplate objects
    *  @property {String} description   Text description of what the template does when used in the automator
    *  @property {String[]} paramTypes  Array of inputs to be used for the template; elements must be keys from
    *   paramTypes GameDB entry above
    *  @property {String[]} paramNames  Array of strings to be displayed in the UI next to the input fields in
    *   order to explain to the player what they correspond to
    *  @property {String[]} targets     Fields of the param object which the inputs from paramTypes should be
    *   mapped to
    *  @property {Function} warnings    Function which checks the current game state and potentially provides
    *   warnings based on some possibly common cases which may lead to undesired behavior
    * }
    */
  scripts: [
    {
      name: "Climb EP",
      description: `This script performs repeated Eternities, attempting to re-purchase a Time Study Tree every
        Eternity. Autobuyer settings must be supplied for the Infinity and Eternity Autobuyers. The script will
        repeat until a final Eternity Point value is reached.`,
      paramTypes: ["tree", "decimal", "autobuyer", "autobuyer"],
      paramNames: ["Study Tree to buy", "Target EP", "Infinity Autobuyer", "Eternity Autobuyer"],
      targets: ["tree", "finalEP", "autoInfinity", "autoEternity"],
      warnings: () => {
        const list = [];
        if (!RealityUpgrade(10).isBought) {
          list.push(`This script will be unable to properly set Autobuyer modes without at least ${formatInt(100)}
            Eternities. Consider getting Reality Upgrade "${RealityUpgrade(10).name}" before using this at the start
            of a Reality.`);
        }
        if (!RealityUpgrade(13).isBought) {
          list.push(`This template may perform poorly without Reality Upgrade "${RealityUpgrade(13).name}"`);
        }
        if (!Perk.ttBuySingle.isBought) {
          list.push(`This template may perform poorly without Perk "${Perk.ttBuySingle.label}" unless you have a Glyph
            which generates Time Theorems`);
        }
        return list;
      },
    },
    {
      name: "Grind Eternities",
      description: `This script performs repeated fast Eternities after buying a specified Time Study Tree.
        Auto-Infinity will be set to "Times Highest" with a specified number of crunches and Auto-Eternity will
        trigger as soon as possible. The script will repeat until a final Eternity count is reached.`,
      paramTypes: ["tree", "integer", "decimal"],
      paramNames: ["Study Tree to buy", "Crunches per Eternity", "Target Eternity Count"],
      targets: ["tree", "crunchesPerEternity", "eternities"],
      warnings: () => {
        const list = [];
        if (RealityUpgrade(14).isBought) {
          list.push(`You probably do not need to use this due to Reality Upgrade "${RealityUpgrade(14).name}"`);
        }
        return list;
      },
    },
    {
      name: "Grind Infinities",
      description: `This script buys a specified Time Study Tree and then configures your Autobuyers for gaining
        Infinities. It will repeat until a final Infinity count is reached; the count can be for banked Infinities,
        in which case it will get all Infinities before performing a single Eternity.`,
      paramTypes: ["tree", "decimal", "boolean"],
      paramNames: ["Study Tree to buy", "Target Infinity Count", "Use Banked for Target?"],
      targets: ["tree", "infinities", "isBanked"],
      warnings: () => {
        const list = [];
        if (RealityUpgrade(11).isBought) {
          list.push(`You probably do not need to use this due to Reality Upgrade "${RealityUpgrade(11).name}"`);
        }
        return list;
      },
    },
    {
      name: "Complete Eternity Challenge",
      description: `This script buys a specified Time Study Tree and then unlocks a specified Eternity Challenge.
        Then it will set your Infinity Autobuyer to your specified settings and enter the Eternity Challenge.
        Finally, it will wait until at least the desired number of completions before triggering an Eternity to
        complete the challenge.`,
      paramTypes: ["tree", "integer", "integer", "autobuyer"],
      paramNames: ["Study Tree to buy", "Eternity Challenge ID", "Target Completion Count", "Infinity Autobuyer"],
      targets: ["tree", "ec", "completions", "autoInfinity"],
      warnings: () => {
        const list = [];
        if (!Perk.studyECRequirement.isBought) {
          list.push(`Eternity Challenges may not be reliably unlockable due to secondary resource requirements, consider
            unlocking Perk "${Perk.studyECRequirement.label}" before using this template`);
        }
        if (!Perk.studyECBulk.isBought) {
          list.push(`Using this template without bulk completions of Eternity Challenges may lead to long scripts which
            are slower and difficult to modify. If you use this template, consider returning to simplify your scripts
            after unlocking Perk "${Perk.studyECBulk.label}"`);
        }
        return list;
      },
    },
    {
      name: "Unlock Dilation",
      description: `This script performs repeated Eternities, attempting to re-purchase a Time Study Tree every
        Eternity. Autobuyer settings must be supplied for the Infinity and Eternity Autobuyers. The script acts
        similarly to the "Climb EP" script, except that it instead loops until you have the total Time Theorem
        requirement to unlock Dilation instead of until a target EP amount. After reaching the target, it will
        unlock Dilation.`,
      paramTypes: ["tree", "decimal", "autobuyer", "autobuyer"],
      paramNames: ["Study Tree to buy", "Target EP", "Infinity Autobuyer", "Eternity Autobuyer"],
      targets: ["tree", "finalEP", "autoInfinity", "autoEternity"],
    },
  ]
};
