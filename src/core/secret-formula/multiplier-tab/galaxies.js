import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const galaxies = {
  // Note: none of the galaxy types use the global multiplier that applies to all of them within multValue, which
  // very slightly reduces performance impact and is okay because it's applied consistently
  antimatter: {
    name: "Antimatter Galaxies",
    displayOverride: () => {
      const num = player.galaxies + GalaxyGenerator.galaxies;
      const mult = MultiplierTabHelper.globalGalaxyMult();
      return `${formatInt(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => Decimal.pow10(player.galaxies + GalaxyGenerator.galaxies),
    isActive: true,
    icon: MultiplierTabIcons.ANTIMATTER,
  },
  replicanti: {
    name: "Replicanti Galaxies",
    displayOverride: () => {
      const num = Replicanti.galaxies.total;
      let rg = Replicanti.galaxies.bought;
      rg *= (1 + Effects.sum(TimeStudy(132), TimeStudy(133)));
      rg += Replicanti.galaxies.extra;
      rg += Math.min(Replicanti.galaxies.bought, ReplicantiUpgrade.galaxies.value) *
          Effects.sum(EternityChallenge(8).reward);
      const mult = rg / Math.clampMin(num, 1) * MultiplierTabHelper.globalGalaxyMult();
      return `${formatInt(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => {
      let rg = Replicanti.galaxies.bought;
      rg *= (1 + Effects.sum(TimeStudy(132), TimeStudy(133)));
      rg += Replicanti.galaxies.extra;
      rg += Math.min(Replicanti.galaxies.bought, ReplicantiUpgrade.galaxies.value) *
          Effects.sum(EternityChallenge(8).reward);
      return Decimal.pow10(rg);
    },
    isActive: () => Replicanti.areUnlocked,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("replication"),
  },
  tachyon: {
    name: "Tachyon Galaxies",
    displayOverride: () => {
      const num = player.dilation.totalTachyonGalaxies;
      const mult = MultiplierTabHelper.globalGalaxyMult() *
          (1 + Math.max(0, Replicanti.amount.log10() / 1e6) * AlchemyResource.alternation.effectValue);
      return `${formatInt(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => {
      const num = player.dilation.totalTachyonGalaxies;
      const mult = 1 + Math.max(0, Replicanti.amount.log10() / 1e6) * AlchemyResource.alternation.effectValue;
      return Decimal.pow10(num * mult);
    },
    isActive: () => player.dilation.totalTachyonGalaxies > 0,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("dilation"),
  },
  nerfPelle: {
    name: "Doomed Reality",
    displayOverride: () => `All Galaxy strength /${formatInt(2)}`,
    powValue: 0.5,
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  }
};
