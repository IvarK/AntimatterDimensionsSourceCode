"use strict";

class AwayProgress {
  constructor(config) {
    this.name = config.name;
    this.isUnlocked = config.isUnlocked;
    this.awayOption = config.awayOption === undefined ? this.name : config.awayOption;
    this.showOption = config.showOption === undefined ? true : config.showOption;
    // This is an array of strings, each one the name of the next entry in the player object to navigate to
    // If there is no reference, it is accessed directly by the name through the player object.
    this.reference = config.reference === undefined ? [this.name] : config.reference;
    this.classObjectReference = config.classObjectReference === undefined ? this.name : config.classObjectReference;
  }

  get option() {
    return player.options.awayProgress[this.awayOption];
  }

  set option(value) {
    player.options.awayProgress[this.awayOption] = value;
  }

  get classObject() {
    // Format the camelCase name to kebab-case
    return `c-modal-away-progress__${
      this.classObjectReference.replace(/[A-Z]/gu, match => `-${match.toLowerCase()}`)
    }`;
  }

  get formatName() {
    // Format the camelCase name to Title Case, with spaces added before the capital letters
    return this.name
      .replace(/[A-Z]/gu, match => ` ${match}`)
      .replace(/^\w/u, c => c.toUpperCase());
  }

  get isBlackHole() {
    return this.name.includes("BlackHole");
  }

  // Pass in player object. Navigate to there using each reference point. Return the place you arrived at.
  navigateTo(from) {
    let place = from;
    for (const goTo of this.reference) {
      place = place[goTo];
    }
    return place;
  }
}

const AwayProgressTypes = {
  antimatter: new AwayProgress({
    name: "antimatter",
    isUnlocked: () => true,
  }),
  dimensionBoosts: new AwayProgress({
    name: "dimensionBoosts",
    isUnlocked: () => true,
  }),
  antimatterGalaxies: new AwayProgress({
    name: "antimatterGalaxies",
    reference: ["galaxies"],
    isUnlocked: () => true,
  }),
  infinities: new AwayProgress({
    name: "infinities",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }),
  infinityPoints: new AwayProgress({
    name: "infinityPoints",
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
  }),
  replicanti: new AwayProgress({
    name: "replicanti",
    reference: ["replicanti", "amount"],
    isUnlocked: () => PlayerProgress.replicantiUnlocked() || PlayerProgress.eternityUnlocked(),
  }),
  replicantiGalaxies: new AwayProgress({
    name: "replicantiGalaxies",
    reference: ["replicanti", "galaxies"],
    isUnlocked: () => PlayerProgress.replicantiUnlocked() || PlayerProgress.eternityUnlocked(),
  }),
  eternities: new AwayProgress({
    name: "eternities",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }),
  eternityPoints: new AwayProgress({
    name: "eternityPoints",
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
  }),
  tachyonParticles: new AwayProgress({
    name: "tachyonParticles",
    reference: ["dilation", "tachyonParticles"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }),
  dilatedTime: new AwayProgress({
    name: "dilatedTime",
    reference: ["dilation", "dilatedTime"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }),
  tachyonGalaxies: new AwayProgress({
    name: "tachyonGalaxies",
    reference: ["dilation", "totalTachyonGalaxies"],
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
  }),
  realities: new AwayProgress({
    name: "realities",
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }),
  realityMachines: new AwayProgress({
    name: "realityMachines",
    reference: ["reality", "realityMachines"],
    isUnlocked: () => PlayerProgress.realityUnlocked(),
  }),
  imaginaryMachines: new AwayProgress({
    name: "imaginaryMachines",
    reference: ["reality", "imaginaryMachines"],
    isUnlocked: () => MachineHandler.isIMUnlocked,
  }),
  relicShards: new AwayProgress({
    name: "relicShards",
    reference: ["celestials", "effarig", "relicShards"],
    isUnlocked: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
  }),
  celestialMemories: new AwayProgress({
    name: "celestialMemories",
    isUnlocked: () => V.has(V_UNLOCKS.RA_UNLOCK),
    // Functions as the visible option for all Memories, never appears due to having no reference.
  }),
  teresaMemories: new AwayProgress({
    name: "teresaMemories",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "teresa", "memories"],
    isUnlocked: () => Ra.pets.teresa.isUnlocked && !Ra.pets.teresa.isCapped,
    showOption: false,
  }),
  effarigMemories: new AwayProgress({
    name: "effarigMemories",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "effarig", "memories"],
    isUnlocked: () => Ra.pets.effarig.isUnlocked && !Ra.pets.effarig.isCapped,
    showOption: false,
  }),
  enslavedMemories: new AwayProgress({
    name: "enslavedMemories",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "enslaved", "memories"],
    isUnlocked: () => Ra.pets.enslaved.isUnlocked && !Ra.pets.enslaved.isCapped,
    showOption: false,
  }),
  vMemories: new AwayProgress({
    name: "vMemories",
    awayOption: "celestialMemories",
    reference: ["celestials", "ra", "pets", "v", "memories"],
    isUnlocked: () => Ra.pets.v.isUnlocked && !Ra.pets.v.isCapped,
    showOption: false,
  }),
  darkMatter: new AwayProgress({
    name: "darkMatter",
    reference: ["celestials", "laitela", "darkMatter"],
    isUnlocked: () => Laitela.isUnlocked,
  }),
  darkEnergy: new AwayProgress({
    name: "darkEnergy",
    reference: ["celestials", "laitela", "darkEnergy"],
    isUnlocked: () => Laitela.isUnlocked,
  }),
  singularities: new AwayProgress({
    name: "singularities",
    reference: ["celestials", "laitela", "singularities"],
    isUnlocked: () => Laitela.isUnlocked,
  }),
  blackHole: new AwayProgress({
    name: "blackHole",
    isUnlocked: () => BlackHole(1).isUnlocked,
    // Functions as the visible option for both first & second BHs, never appears due to having no reference.
  }),
  firstBlackHole: new AwayProgress({
    name: "firstBlackHole",
    awayOption: "blackHole",
    reference: ["blackHole", "0", "activations"],
    isUnlocked: () => BlackHole(1).isUnlocked,
    classObjectReference: "black-hole",
    showOption: false,
  }),
  secondBlackHole: new AwayProgress({
    name: "secondBlackHole",
    awayOption: "blackHole",
    reference: ["blackHole", "1", "activations"],
    isUnlocked: () => BlackHole(2).isUnlocked,
    classObjectReference: "black-hole",
    showOption: false,
  }),
};

AwayProgressTypes.all = Object.values(AwayProgressTypes);
