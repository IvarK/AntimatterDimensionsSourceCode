export const awayProgressTypes = [
  {
    name: "antimatter",
    isUnlocked: () => true,
  }, {
    name: "dimensionBoosts",
    isUnlocked: () => true,
  }, {
    name: "antimatterGalaxies",
    reference: ["galaxies"],
    isUnlocked: () => true,
  }, {
    name: "infinities",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "infinityPoints",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }, {
    name: "replicanti",
    reference: ["replicanti", "amount"],
    isUnlocked: () => PlayerProgress.replicantiUnlocked() || PlayerProgress.eternityUnlocked(),
  }, {
    name: "replicantiGalaxies",
    reference: ["replicanti", "galaxies"],
    isUnlocked: () => PlayerProgress.replicantiUnlocked() || PlayerProgress.eternityUnlocked(),
  }, {
    name: "eternities",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }, {
    name: "eternityPoints",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }, {
    name: "tachyonParticles",
    reference: ["dilation", "tachyonParticles"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "dilatedTime",
    reference: ["dilation", "dilatedTime"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "timeTheorems",
    reference: ["timestudy", "theorem"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "tachyonGalaxies",
    reference: ["dilation", "totalTachyonGalaxies"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }, {
    name: "achievementAmount",
    reference: ["achievementBits"],
    applyFn: x => x.map(b => countValuesFromBitmask(b)).sum(),
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "realities",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "realityMachines",
    reference: ["reality", "realityMachines"],
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }, {
    name: "blackHole",
    isUnlocked: () => BlackHole(1).isUnlocked,
    // Functions as the visible option for both first & second BHs, never appears due to having no reference.
    appearsInAwayModal: false,
  }, {
    name: "firstBlackHole",
    awayOption: "blackHole",
    reference: ["blackHole", "0", "activations"],
    isUnlocked: () => BlackHole(1).isUnlocked,
    classObjectReference: "black-hole",
    showOption: false,
  }, {
    name: "secondBlackHole",
    awayOption: "blackHole",
    reference: ["blackHole", "1", "activations"],
    isUnlocked: () => BlackHole(2).isUnlocked,
    classObjectReference: "black-hole",
    showOption: false,
  }, {
    name: "relicShards",
    reference: ["celestials", "effarig", "relicShards"],
    isUnlocked: () => TeresaUnlocks.effarig.canBeApplied,
  }, {
    name: "celestialMemories",
    isUnlocked: () => VUnlocks.raUnlock.isUnlocked,
    // Functions as the visible option for all Memories, never appears due to having no reference.
    appearsInAwayModal: false,
  }, {
    name: "teresaMemories",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "teresa", "memories"],
    isUnlocked: () => Ra.pets.teresa.isUnlocked && !Ra.pets.teresa.isCapped,
    showOption: false,
  }, {
    name: "effarigMemories",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "effarig", "memories"],
    isUnlocked: () => Ra.pets.effarig.isUnlocked && !Ra.pets.effarig.isCapped,
    showOption: false,
  }, {
    name: "enslavedMemories",
    forcedName: "Nameless Memories",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "enslaved", "memories"],
    isUnlocked: () => Ra.pets.enslaved.isUnlocked && !Ra.pets.enslaved.isCapped,
    showOption: false,
  }, {
    name: "vMemories",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "v", "memories"],
    isUnlocked: () => Ra.pets.v.isUnlocked && !Ra.pets.v.isCapped,
    showOption: false,
  }, {
    name: "imaginaryMachines",
    reference: ["reality", "imaginaryMachines"],
    isUnlocked: () => MachineHandler.isIMUnlocked,
  }, {
    name: "darkMatter",
    reference: ["celestials", "laitela", "darkMatter"],
    isUnlocked: () => Laitela.isUnlocked,
  }, {
    name: "darkEnergy",
    reference: ["celestials", "laitela", "darkEnergy"],
    isUnlocked: () => Laitela.isUnlocked,
  }, {
    name: "singularities",
    reference: ["celestials", "laitela", "singularities"],
    isUnlocked: () => Laitela.isUnlocked,
  }, {
    name: "realityShards",
    reference: ["celestials", "pelle", "realityShards"],
    isUnlocked: () => Pelle.isDoomed,
  },
];
