import { GameDatabase } from "./game-database";

// We define these in the local scope to override the player's notation setting; this is something we'll probably
// expand upon later once we look more closely at support for extended Unicode in DRP
function format(number, places, placesUnder1000) {
  return Notation.scientific.format(number, places, placesUnder1000);
}

function formatInt(number, places) {
  return Notation.scientific.formatInt(number, places);
}

function formatMachines(realPart, imagPart) {
  return Notation.scientific.formatMachines(realPart, imagPart);
}

// This is used for Discord Rich Presence, the information which shows up on a person's profile badge in Discord if
// they are playing a game on Steam which has integration that pushes the info to Discord
GameDatabase.discordRichPresence = {
  /**
   * List of all challenges to display within DRP, checked from the first entry and iterating forward. It will only
   * show the first one it finds for space reasons, but this also has the desirable effect of hiding key challenges
   * the player may enter within cel3.
   *
   * This is arguably the most "useful" behavior as well due to the fact that often the highest level of challenge is
   * the long-term goal for why the player entered the challenge in the first place.
   * @template
   * {
   *  @property {function: @return String} name                     Name of the challenge (may contain name spoilers)
   *  @property {function: @return Boolean | Number} activityToken  Whether or not this challenge is active; is a
   *    boolean for dilation and realities, or a number for pre-dilation challenges
   *  @property {Array: function: @return String} resource          Function returning the relevant resource for this
   *    particular challenge
   * }
   */
  challenges: [
    {
      name: () => `${Teresa.possessiveName} Reality`,
      activityToken: () => Teresa.isRunning,
      // Reward is based on antimatter, but EP is more meaningful pre-completion
      resource: () => (Teresa.runCompleted
        ? `${format(player.antimatter, 2, 2)} AM`
        : `${format(player.eternityPoints, 2, 2)} EP`),
    },
    {
      name: () => `${Effarig.possessiveName} Reality - ${Effarig.currentStageName} Layer`,
      activityToken: () => Effarig.isRunning,
      resource: () => {
        switch (Effarig.currentStage) {
          case EFFARIG_STAGES.INFINITY:
            return `${format(player.antimatter, 2, 2)} AM`;
          case EFFARIG_STAGES.ETERNITY:
            return `${format(player.infinityPoints, 2, 2)} IP`;
          case EFFARIG_STAGES.REALITY:
          default:
            return `${format(player.eternityPoints, 2, 2)} EP`;
        }
      },
    },
    {
      name: () => `${Enslaved.possessiveName} Reality`,
      activityToken: () => Enslaved.isRunning,
      resource: () => `${format(player.eternityPoints, 2, 2)} EP`,
    },
    {
      name: () => `${V.possessiveName} Reality`,
      activityToken: () => V.isRunning,
      resource: () => null,
      // V displays achievements normally and its value is standardized outside of its era
    },
    {
      name: () => `${Ra.possessiveName} Reality`,
      activityToken: () => Ra.isRunning,
      resource: () => null,
      // Ra doesn't have a meaningful in-reality resource to display
    },
    {
      name: () => `${Laitela.possessiveName} Reality`,
      activityToken: () => Laitela.isRunning,
      resource: () => `${formatPercents(player.celestials.laitela.entropy, 2, 2)} Entropy`,
    },
    {
      name: () => "Dilated Eternity",
      activityToken: () => player.dilation.active,
      resource: () => `${format(player.antimatter, 2, 2)} AM`,
    },
    {
      name: token => `Eternity Challenge ${token}`,
      activityToken: () => player.challenge.eternity.current,
      resource: () => `${format(player.infinityPoints, 2, 2)} IP`,
    },
    {
      name: token => `Infinity Challenge ${token}`,
      activityToken: () => player.challenge.infinity.current,
      resource: () => `${format(player.antimatter, 2, 2)} AM`,
    },
    {
      name: token => `Normal Challenge ${token}`,
      activityToken: () => player.challenge.normal.current,
      resource: () => `${format(player.antimatter, 2, 2)} AM`,
    },
  ],

  /**
   * List of all the different progress stages which will have distinct behavior in DRP
   * @template
   * {
   *  @property {Number} stateName                                Name of this stage of the game to display. This will
   *    be used for the first line of text in DRP. This isn't necessarily unique, as the tracked resources may change
   *    without the stage changing
   *  @property {function: @return Boolean} hasReached            Function to check if this stage of the game has been
   *    reached. These checks are done starting at the end of the array and going backwards.
   *  @property {function: @return String} mainResource           Function returning the string describing the main
   *    resource for a stage of the game
   *  @property {Array: function: @return String} resourceList    Array of strings containing relevant resources for
   *    each particular part of the game. Largely just a list of key resources that are relevant at each section. May
   *    be undefined.
   * }
   */
  stages: [
    {
      name: "Pre-Infinity",
      hasReached: () => true,
      mainResource: () => `${format(player.antimatter, 2, 2)} AM`,
    },
    {
      name: "Infinity",
      hasReached: () => PlayerProgress.infinityUnlocked(),
      mainResource: () => `${format(player.infinityPoints, 2, 2)} IP`,
      resourceList: [() => quantify("Infinity", player.infinities)],
    },
    {
      name: "Eternity",
      hasReached: () => PlayerProgress.eternityUnlocked(),
      mainResource: () => `${format(player.eternityPoints, 2, 2)} EP`,
      resourceList: [() => quantify("Eternity", player.eternities)],
    },
    {
      name: "Eternity",
      hasReached: () => player.eternityChalls.eterc1 > 0,
      mainResource: () => `${format(player.eternityPoints, 2, 2)} EP`,
      resourceList: [() => quantify("EC completion", player.eternityChalls.reduce((sum, c) => sum + c, 0))],
    },
    {
      name: "Time Dilation",
      hasReached: () => PlayerProgress.dilationUnlocked(),
      mainResource: () => `${format(player.eternityPoints, 2, 2)} EP`,
      resourceList: [() => `${format(player.dilation.dilatedTime, 2, 2)} DT`],
    },
    {
      name: "Reality",
      hasReached: () => player.realities > 0,
      mainResource: () => `${format(player.reality.realityMachines, 2, 2)} RM`,
      resourceList: [() => quantify("Reality", player.realities),
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`],
    },
    {
      name: "Teresa",
      hasReached: () => Teresa.isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2, 2)} RM`,
      resourceList: [() => quantify("Reality", player.realities),
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`],
    },
    {
      name: "Effarig",
      hasReached: () => TeresaUnlocks.effarig.isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2, 2)} RM`,
      resourceList: [() => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => quantify("Relic Shard", player.celestials.effarig.relicShards)],
    },
    {
      name: "The Nameless Ones",
      hasReached: () => EffarigUnlock.eternity.isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2, 2)} RM`,
      resourceList: [() => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`],
    },
    {
      name: "V",
      hasReached: () => Achievement(151).isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2, 2)} RM`,
      resourceList: [() => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => quantify("V-Achievement", player.celestials.v.runUnlocks.sum())],
    },
    {
      name: "Ra",
      hasReached: () => VUnlocks.raUnlock.isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2, 2)} RM`,
      resourceList: [() => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => `Levels: ${Ra.pets.all.map(p => formatInt(p.level)).join("/")}`],
    },
    {
      name: "Ra",
      hasReached: () => MachineHandler.isIMUnlocked,
      mainResource: () => `${formatMachines(player.reality.realityMachines, player.reality.imaginaryMachines)} RM`,
      resourceList: [() => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`],
    },
    {
      name: "Lai'tela",
      hasReached: () => Laitela.isUnlocked,
      mainResource: () => `${formatMachines(player.reality.realityMachines, player.reality.imaginaryMachines)} RM`,
      resourceList: [() => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => quantify("Singularity", player.celestials.laitela.singularities)],
    },
    {
      name: "Pelle",
      hasReached: () => Pelle.isDoomed,
      mainResource: () => quantify("Reality Shard", player.celestials.pelle.realityShards, 2),
      resourceList: [() => quantify("Remnant", player.celestials.pelle.remnants)],
    },
  ]
};
