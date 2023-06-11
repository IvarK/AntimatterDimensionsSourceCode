import { AutobuyerInputFunctions } from "@/components/tabs/autobuyers/AutobuyerInput";

export const automatorTemplates = {
  /**
    * List of possible data types to dynamically generate in script templates, assumed to be only string or boolean
    * {
    *  @property {String} name              String to be used as a key for entries in this object
    *  @property {String[]} boolDisplay     Strings to be displayed for true/false states for boolean inputs. If
    *   undefined, assumed to be a non-boolean input
    *  @property {Function} isValidString   A function used to test if an input string is formatted properly or not
    *  @property {Function} map             A function to be used to map the inputs to their actual values
    *   which are stored in the param object. If undefined, assumed to be no mapping
    * }
    */
  paramTypes: [
    {
      name: "tree",
      isValidString: str => {
        const validImport = TimeStudyTree.isValidImportString(str);
        const preset = str.match(/^(NAME (.{1,4})|ID (\d))$/u);
        const validPreset = preset ? (
          player.timestudy.presets.some(p => p.name === preset[2]) ||
          (Number(preset[3]) > 0 && Number(preset[3]) < 7)
        ) : false;
        return validImport || validPreset;
      },
    },
    {
      name: "integer",
      isValidString: str => AutobuyerInputFunctions.int.tryParse(str),
      map: x => Math.round(parseInt(x, 10)),
    },
    {
      name: "decimal",
      isValidString: str => AutobuyerInputFunctions.decimal.tryParse(str),
      map: x => AutobuyerInputFunctions.decimal.tryParse(x),
    },
    {
      name: "boolean",
      boolDisplay: [true, false],
    },
    {
      name: "nowait",
      boolDisplay: ["Continue onward", "Keep buying Studies"],
    },
    {
      name: "mode",
      boolDisplay: ["X times highest", "Seconds since last"],
      map: x => (x ? "mult" : "time"),
    },
  ],
  /**
    * List automator script templates, primarily used here for formatting the player UI prompts appropriately
    * so that all of the required fields show up in the proper input formats. Actual script formatting requires
    * additionally writing a method to be called in the constructor of the ScriptTemplate class
    * {
    *  @property {String} name          Name of script template, also used as a key within the constructor for
    *   ScriptTemplate objects
    *  @property {String} description   Text description of what the template does when used in the automator
    *  @property {Object[]} inputs      Fields of the param object which need to be filled for the template to
    *   have all the information it needs. Contains the name of the field, the type (drawn from paramTypes above),
    *   and a prompt to be shown in the UI end
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
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Or directly enter your time studies" },
        { name: "treeNowait", type: "nowait", prompt: "Missing Study behavior" },
        { name: "finalEP", type: "decimal", prompt: "Target EP" },
        { name: "autoInfMode", type: "mode", prompt: "Infinity Autobuyer Mode" },
        { name: "autoInfValue", type: "decimal", prompt: "Infinity Autobuyer Threshold" },
        { name: "autoEterMode", type: "mode", prompt: "Eternity Autobuyer Mode" },
        { name: "autoEterValue", type: "decimal", prompt: "Eternity Autobuyer Threshold" },
      ],
      warnings: () => {
        const list = [];
        if (!RealityUpgrade(10).isBought) {
          list.push(`This script will be unable to properly set Autobuyer modes without at least ${formatInt(100)}
            Eternities. Consider getting Reality Upgrade "${RealityUpgrade(10).name}" before using this at the start
            of a Reality.`);
        }
        // Telemechanical Process (TD/5xEP autobuyers)
        if (!RealityUpgrade(13).isBought) {
          list.push(`This template may perform poorly without Reality Upgrade "${RealityUpgrade(13).name}"`);
        }
        if (!Perk.ttBuySingle.isBought) {
          list.push(`This template may perform poorly without Perk "${Perk.ttBuySingle.label}" unless you can generate
            Time Theorems without purchsing them`);
        }
        return list;
      },
    },
    {
      name: "Grind Eternities",
      description: `This script performs repeated fast Eternities after buying a specified Time Study Tree.
        Auto-Infinity will be set to "Times Highest" with a specified number of crunches and Auto-Eternity will
        trigger as soon as possible. The script will repeat until a final Eternity count is reached.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Or directly enter your time studies" },
        { name: "treeNowait", type: "nowait", prompt: "Missing Study behavior" },
        { name: "crunchesPerEternity", type: "integer", prompt: "Crunches per Eternity" },
        { name: "eternities", type: "decimal", prompt: "Target Eternity Count" },
      ],
      warnings: () => {
        const list = [];
        // Eternal flow (eternity generation)
        if (RealityUpgrade(14).isBought) {
          list.push(`You probably do not need to use this due to Reality Upgrade "${RealityUpgrade(14).name}"`);
        }
        return list;
      },
    },
    {
      name: "Grind Infinities",
      description: `This script buys a specified Time Study Tree and then configures your Autobuyers for gaining
        Infinities. It will repeat until a final Infinity count is reached; the count can be for Banked Infinities,
        in which case it will get all Infinities before performing a single Eternity.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Or directly enter your time studies" },
        { name: "treeNowait", type: "nowait", prompt: "Missing Study behavior" },
        { name: "infinities", type: "decimal", prompt: "Target Infinity Count" },
        { name: "isBanked", type: "boolean", prompt: "Use Banked for Target?" },
      ],
      warnings: () => {
        const list = [];
        if (!Perk.achievementGroup5.isBought) {
          list.push(`You will not start this Reality with Achievement "${Achievement(131).name}" - grinding
            Infinities may be less useful than expected since they cannot be Banked until later`);
        }
        // Boundless flow (infinity generation)
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
        complete the Challenge.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Or directly enter your time studies" },
        { name: "treeNowait", type: "nowait", prompt: "Missing Study behavior" },
        { name: "ec", type: "integer", prompt: "Eternity Challenge ID" },
        { name: "completions", type: "integer", prompt: "Target Completion Count" },
        { name: "autoInfMode", type: "mode", prompt: "Infinity Autobuyer Mode" },
        { name: "autoInfValue", type: "decimal", prompt: "Infinity Autobuyer Threshold" },
      ],
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
        Eternity. Settings must be supplied for the Eternity Autobuyer; your Infinity Autobuyer will be
        turned off. The script loops until you have the total Time Theorem requirement to unlock Dilation, and then
        it will unlock Dilation once it does.`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "Or directly enter your time studies" },
        { name: "treeNowait", type: "nowait", prompt: "Missing Study behavior" },
        { name: "finalEP", type: "decimal", prompt: "Target EP" },
        { name: "autoEterMode", type: "mode", prompt: "Eternity Autobuyer Mode" },
        { name: "autoEterValue", type: "decimal", prompt: "Eternity Autobuyer Threshold" },
      ],
      warnings: () => {
        const list = [];
        // Telemechanical Process (TD/5xEP autobuyers)
        if (!RealityUpgrade(13).isBought) {
          list.push(`This template may perform poorly without Reality Upgrade "${RealityUpgrade(13).name}"`);
        }
        if (!Perk.ttBuySingle.isBought) {
          list.push(`This template may perform poorly without Perk "${Perk.ttBuySingle.label}" unless you can generate
            Time Theorems without purchsing them`);
        }
        return list;
      },
    },
  ]
};
