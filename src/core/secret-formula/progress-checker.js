export const progressStages = [
  /**
   * This is used in both the catchup modal and for cloud save comparisons. Due to the fact that it's used for
   * cloud comparisons, there's a lot of processing that needs to be done on raw player-like objects that aren't
   * actually the player object itself. This means we can't take advantage of a lot of accessors and whatnot, and
   * that many props which are normally Decimals are actually Strings at this point.
   * @template
   * {
   *  @property {Number} id         Value corresponding to entry in PROGRESS_STAGE enum
   *  @property {String} name       Name describing the stage of the game this entry is associated with
   *  @property {function: @return Boolean} hasReached        Checking function for whether this stage has been
   *    reached; all checks are run in descending order, starting at the end of the list and moving upward. The
   *    last one checked (first entry) always returns true as a catch-all condition
   *  @property {String | function: @return Number} suggestedResource     A resource or multiple resources which may be
   *    useful for the player to aim for at this stage. It's okay to reference the player object in this prop because
   *    it's only ever used in the catchup modal and not in the cloud save conflict checker.
   *  @property {function: @return Number} subProgressValue   A value between 0 and 1 corresponding approximately
   *    to the progress within a stage. Values near 0 correspond to near the end of the previous stage and values
   *    near 1 correspond to near the start of the next stage; however in-between values are not an indicator of
   *    absolute progress and shouldn't be used as such
   * }
   */
  {
    id: PROGRESS_STAGE.PRE_INFINITY,
    name: "Antimatter Production",
    hasReached: () => true,
    suggestedResource: "Antimatter",
    // Galaxies are worth 1/3 each, boosts break ties within galaxies, and antimatter breaks ties within boosts
    subProgressValue: save => 0.33 * save.galaxies + 0.02 * save.dimensionBoosts +
      new Decimal(save.antimatter).log10() / 16000,
  },
  {
    id: PROGRESS_STAGE.EARLY_INFINITY,
    name: "Infinity",
    hasReached: save => new Decimal(save.infinities).gt(0),
    suggestedResource: "Infinity Points",
    // Half from infinity count, half from crunch autobuyer state
    subProgressValue: save => Math.clampMax(new Decimal(save.infinities).toNumber(), 500) / 1000 +
      Math.log10(150000 / player.auto.bigCrunch.interval) / 6.35,
  },
  {
    id: PROGRESS_STAGE.BREAK_INFINITY,
    name: "Broken Infinity",
    hasReached: save => save.auto.bigCrunch.interval <= 100,
    suggestedResource: "Infinity Points",
    subProgressValue: save => Math.sqrt(new Decimal(save.infinityPoints).log10() / 145),
  },
  {
    id: PROGRESS_STAGE.REPLICANTI,
    name: "Replicanti",
    hasReached: save => save.replicanti.unl,
    suggestedResource: "Infinity Points",
    subProgressValue: save => Math.sqrt((new Decimal(save.infinityPoints).log10() - 140) / 170),
  },
  {
    id: PROGRESS_STAGE.EARLY_ETERNITY,
    name: "Eternity",
    hasReached: save => new Decimal(save.eternities).gt(0),
    suggestedResource: "Eternity Points and Eternity count",
    subProgressValue: save => new Decimal(save.eternities).clampMax(1e5).toNumber() / 1e5,
  },
  {
    id: PROGRESS_STAGE.ETERNITY_CHALLENGES,
    name: "Eternity Challenges",
    hasReached: save => save.eternityChalls.eterc1 > 0,
    suggestedResource: "Eternity Challenge Completions and Eternity Points",
    // Half from ECs, half from EP (up to e1300)
    subProgressValue: save => 0.008 * Object.values(save.eternityChalls).reduce((sum, c) => sum + c, 0) +
      new Decimal(save.eternityPoints).log10() / 2500,
  },
  {
    id: PROGRESS_STAGE.EARLY_DILATION,
    name: "Time Dilation",
    hasReached: save => new Decimal(save.dilation.dilatedTime).gt(0),
    suggestedResource: "Dilated Time",
    subProgressValue: save => new Decimal(save.dilation.dilatedTime).log10() / 15,
  },
  {
    id: PROGRESS_STAGE.LATE_ETERNITY,
    name: "Late Eternity",
    hasReached: save => new Decimal(save.dilation.dilatedTime).gt(1e15),
    suggestedResource: () => (new Decimal(player.eternityPoints).log10() > 4000
      ? "Eternity Points and/or Dilated Time. Alternatively, you can unlock and perform your first Reality"
      : "Eternity Points and/or Dilated Time"
    ),
    // Tracks up to e8000 even though many players will reality well before that; we still want to distinguish
    // which saves are farther all the way up to the zeroth-reality RM cap
    subProgressValue: save => Math.clampMax(Math.sqrt((new Decimal(save.eternityPoints).log10() - 1300) / 6700), 1),
  },
  {
    id: PROGRESS_STAGE.EARLY_REALITY,
    name: "Reality",
    hasReached: save => save.realities > 0,
    // For the first few realities, we give a bit of extra suggestion just in case the player ended up taking a break
    // and returned in the middle of a reality while they're still relatively slow
    suggestedResource: () => {
      if (player.realities > 5) return "Reality Machines";
      const suffix = "in your current Reality, and your Reality Machines in the long term";
      if (player.eternities.eq(0)) return `Infinity Points ${suffix}`;
      if (player.dilation.dilatedTime.eq(0)) return `Eternity Points ${suffix}`;
      return `Eternity Points and/or Dilated Time ${suffix}`;
    },
    subProgressValue: save => Math.clampMax(save.realities / 100, 1),
  },
  {
    id: PROGRESS_STAGE.TERESA,
    name: "Teresa (1st Celestial)",
    hasReached: save => save.celestials?.teresa?.quoteBits > 0,
    suggestedResource: "Reality Machines",
    subProgressValue: save => Math.log10(1 + save.celestials.teresa.pouredAmount) / 21,
  },
  {
    id: PROGRESS_STAGE.EFFARIG,
    name: "Effarig (2nd Celestial)",
    hasReached: save => save.celestials?.effarig?.quoteBits > 0,
    suggestedResource: "Reality Machines and Relic Shards",
    subProgressValue: save => Math.log10(1 + save.celestials.effarig.relicShards) / 14,
  },
  {
    id: PROGRESS_STAGE.ENSLAVED,
    name: "The Nameless Ones (3rd Celestial)",
    hasReached: save => save.celestials?.enslaved?.quoteBits > 0,
    suggestedResource: "Reality Machines and Glyph Level",
    subProgressValue: save => Math.sqrt((new Decimal(save.reality.realityMachines).log10() - 30) / 30),
  },
  {
    id: PROGRESS_STAGE.V,
    name: "V (4th Celestial)",
    hasReached: save => save.celestials?.v?.quoteBits > 0,
    suggestedResource: "Number of V-Achievements",
    subProgressValue: save => 0.0277 * Object.values(save.celestials.v.runUnlocks)
      .reduce((total, ach) => total + ach, 0),
  },
  {
    id: PROGRESS_STAGE.RA,
    name: "Ra (5th Celestial)",
    hasReached: save => save.celestials?.ra?.quoteBits > 0,
    suggestedResource: "Celestial Memories",
    subProgressValue: save => Object.values(save.celestials.ra.pets).reduce((sum, pet) => sum + pet.level, 0) / 100,
  },
  {
    id: PROGRESS_STAGE.IMAGINARY_MACHINES,
    name: "Imaginary Machines",
    hasReached: save => save.reality?.iMCap > 0,
    suggestedResource: "Imaginary Machines",
    subProgressValue: save => Math.log10(1 + save.reality.iMCap) / 9,
  },
  {
    id: PROGRESS_STAGE.LAITELA,
    name: "Lai'tela (6th Celestial)",
    hasReached: save => save.celestials?.laitela?.quoteBits > 0,
    suggestedResource: "Dark Matter and Singularities",
    subProgressValue: save => new Decimal(save.celestials.laitela.darkMatter).log10() / 308.25,
  },
  {
    id: PROGRESS_STAGE.PELLE,
    name: "Pelle (7th Celestial)",
    hasReached: save => save.celestials?.pelle?.doomed,
    suggestedResource: "Remnants",
    subProgressValue: save => Math.log10(1 + save.celestials.pelle.remnants) / 9,
  },
];
