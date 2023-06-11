// We define these in the local scope to override the player's notation setting; this is something we'll probably
// expand upon later once we look more closely at support for extended Unicode in DRP
function format(number, places, placesUnder1000) {
  return Notation.scientific.format(number, places, placesUnder1000);
}

function formatInt(value) {
  if (Notations.current.isPainful) return format(value, 2);
  return formatWithCommas(typeof value === "number" ? value.toFixed(0) : value.toNumber().toFixed(0));
}

function formatMachines(realPart, imagPart) {
  const parts = [];
  if (Decimal.neq(realPart, 0)) parts.push(format(realPart, 2));
  if (Decimal.neq(imagPart, 0)) parts.push(`${format(imagPart, 2, 2)}i`);
  if (Decimal.eq(realPart, 0) && Decimal.eq(imagPart, 0)) return format(0);
  return parts.join(" + ");
}

// This is used for Discord Rich Presence, the information which shows up on a person's profile badge in Discord if
// they are playing a game on Steam which has integration that pushes the info to Discord
export const discordRichPresence = {
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
        ? `${format(player.antimatter, 2, 1)} AM`
        : `${format(player.eternityPoints, 2)} EP`),
    },
    {
      name: () => `${Effarig.possessiveName} Reality - ${Effarig.currentStageName}`,
      activityToken: () => Effarig.isRunning,
      resource: () => {
        switch (Effarig.currentStage) {
          case EFFARIG_STAGES.INFINITY:
            return `${format(player.antimatter, 2, 1)} AM`;
          case EFFARIG_STAGES.ETERNITY:
            return `${format(player.infinityPoints, 2)} IP`;
          case EFFARIG_STAGES.REALITY:
          default:
            return `${format(player.eternityPoints, 2)} EP`;
        }
      },
    },
    {
      name: () => `${Enslaved.possessiveName} Reality`,
      activityToken: () => Enslaved.isRunning,
      resource: () => `${format(player.eternityPoints, 2)} EP`,
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
      name: () => {
        const dims = Laitela.maxAllowedDimension;
        const dimStr = dims ? `D${dims} max` : "Final";
        return `${Laitela.possessiveName} Reality - ${dimStr}`;
      },
      activityToken: () => Laitela.isRunning,
      resource: () => `${formatPercents(player.celestials.laitela.entropy, 2, 2)} Entropy`,
    },
    {
      name: () => "Dilation",
      activityToken: () => player.dilation.active,
      resource: () => `${format(player.antimatter, 2, 1)} AM`,
    },
    {
      name: token => `EC ${token}`,
      // This results in "EC 3x3" (for example) when there are remaining completions, and just "EC 3" if not
      activityToken: () => {
        if (!player.challenge.eternity.current) return false;
        const num = player.challenge.eternity.current;
        const ec = EternityChallenge(num);
        return ec.remainingCompletions ? `${num}x${ec.completions + 1}` : num;
      },
      resource: () => `${format(player.infinityPoints, 2)} IP`,
    },
    {
      name: token => `IC ${token}`,
      activityToken: () => player.challenge.infinity.current,
      resource: () => `${format(player.antimatter, 2, 1)} AM`,
    },
    {
      name: token => `NC ${token}`,
      activityToken: () => player.challenge.normal.current,
      resource: () => `${format(player.antimatter, 2, 1)} AM`,
    },
  ],

  /**
   * List of all the different progress stages which will have distinct behavior in DRP
   * @template
   * {
   *  @property {String} name                                     Name of this stage of the game to display. This will
   *    be used for the first line of text in DRP. This isn't necessarily unique, as the tracked resources may change
   *    without the stage changing
   *  @property {function: @return Boolean} hasReached            Function to check if this stage of the game has been
   *    reached. These checks are done starting at the end of the array and going backwards.
   *  @property {function: @return String} mainResource           Function returning the string describing the main
   *    resource for a stage of the game
   *  @property {Array: function: @return String} resourceList    Array of strings containing relevant resources for
   *    each particular part of the game. Largely just a list of key resources that are relevant at each section. The
   *    logic *can* handle this being undefined, but it probably shouldn't be due to poor appearance
   * }
   */
  stages: [
    {
      name: "Pre-Infinity",
      hasReached: () => true,
      mainResource: () => `${format(player.antimatter, 2, 1)} AM`,
      resourceList: [
        () => quantify("Boost", player.dimensionBoosts, 0, 0, formatInt),
        () => quantify("Galaxy", player.galaxies, 0, 0, formatInt),
      ],
    },
    {
      name: "Infinity",
      hasReached: () => PlayerProgress.infinityUnlocked(),
      mainResource: () => `${format(player.infinityPoints, 2)} IP`,
      resourceList: [() => quantify("Infinity", player.infinities, 0, 0, formatInt)],
    },
    {
      name: "Broken Infinity",
      hasReached: () => player.break,
      mainResource: () => `${format(player.infinityPoints, 2)} IP`,
      resourceList: [() => quantify("Infinity", player.infinities, 2, 0, format)],
    },
    {
      name: "Eternity",
      hasReached: () => PlayerProgress.eternityUnlocked(),
      mainResource: () => `${format(player.eternityPoints, 2)} EP`,
      resourceList: [() => quantify("Eternity", player.eternities, 0, 0, formatInt)],
    },
    {
      // Eternity Challenge era
      name: "Eternity",
      hasReached: () => player.eternityChalls.eterc1 > 0,
      mainResource: () => `${format(player.eternityPoints, 2)} EP`,
      resourceList: [
        () => quantify("EC completion", Object.values(player.eternityChalls).reduce((sum, c) => sum + c, 0), 0, 0, formatInt)
      ]
    },
    {
      name: "Time Dilation",
      hasReached: () => PlayerProgress.dilationUnlocked(),
      mainResource: () => `${format(player.eternityPoints, 2)} EP`,
      resourceList: [() => `${format(player.dilation.dilatedTime, 2, 2)} DT`],
    },
    {
      name: "Reality",
      hasReached: () => player.realities > 0,
      mainResource: () => `${format(player.reality.realityMachines, 2)} RM`,
      resourceList: [
        () => quantify("Reality", player.realities, 0, 0, formatInt),
        () => `Best Glyph Level: ${formatInt(player.records.bestReality.glyphLevel)}`
      ]
    },
    {
      name: () => Teresa.displayName,
      hasReached: () => Teresa.isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2)} RM`,
      resourceList: [
        () => quantify("Reality", player.realities, 0, 0, formatInt),
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => `Poured: ${format(player.celestials.teresa.pouredAmount, 2)} RM`
      ]
    },
    {
      name: () => Effarig.displayName,
      hasReached: () => TeresaUnlocks.effarig.isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2)} RM`,
      resourceList: [
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => quantify("Relic Shard", player.celestials.effarig.relicShards, 2, 0, format)
      ]
    },
    {
      name: () => Enslaved.displayName,
      hasReached: () => EffarigUnlock.eternity.isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2)} RM`,
      resourceList: [
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => `Charged: ${format(TimeSpan.fromMilliseconds(player.celestials.enslaved.stored).totalYears, 2)} years`
      ],
    },
    {
      name: () => V.displayName,
      hasReached: () => Achievement(151).isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2)} RM`,
      resourceList: [
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => quantify("V-Achievement", player.celestials.v.runUnlocks.sum(), 0, 0, formatInt)],
    },
    {
      name: () => Ra.displayName,
      hasReached: () => VUnlocks.raUnlock.isUnlocked,
      mainResource: () => `${format(player.reality.realityMachines, 2)} RM`,
      resourceList: [
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => `Ra Levels: ${Ra.pets.all.map(p => formatInt(p.level)).join("/")}`],
    },
    {
      // Imaginary Machines unlocked
      name: () => Ra.displayName,
      hasReached: () => MachineHandler.isIMUnlocked,
      mainResource: () => `${formatMachines(player.reality.realityMachines, player.reality.imaginaryMachines)} RM`,
      resourceList: [
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => `Ra Levels: ${Ra.pets.all.map(p => formatInt(p.level)).join("/")}`
      ],
    },
    {
      name: () => Laitela.displayName,
      hasReached: () => Laitela.isUnlocked,
      mainResource: () => `${formatMachines(player.reality.realityMachines, player.reality.imaginaryMachines)} RM`,
      resourceList: [
        () => `Best GL: ${formatInt(player.records.bestReality.glyphLevel)}`,
        () => quantify("Singularity", player.celestials.laitela.singularities, 2, 0, format)],
    },
    {
      // We can't use celestial displayName here like the others because that will cause the text scramble to get put on DRP
      name: "Pelle",
      hasReached: () => Pelle.isDoomed,
      mainResource: () => quantify("Reality Shard", player.celestials.pelle.realityShards, 2),
      resourceList: [() => quantify("Remnant", player.celestials.pelle.remnants, 2)],
    },
    {
      name: "END",
      hasReached: () => GameEnd.endState >= END_STATE_MARKERS.GAME_END,
      mainResource: () => "END Antimatter",
      resourceList: [() => "Nothing remains."],
    },
  ]
};
