import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.tickspeed = {
  total: {
    name: () => "Total Tickspeed",
    displayOverride: () => {
      const tickRate = Tickspeed.perSecond;
      const activeDims = MultiplierTabHelper.activeDimCount("AD");
      return `${format(tickRate, 2, 2)}/sec on ${formatInt(activeDims)} ${pluralize("Dimension", activeDims)}
          ➜ ${formatX(tickRate.pow(activeDims), 2, 2)}`;
    },
    fakeValue: () => DC.E100,
    multValue: () => Tickspeed.perSecond.pow(MultiplierTabHelper.activeDimCount("AD")),
    isActive: () => true,
    overlay: ["<i class='fa-solid fa-clock' />"],
    icon: MultiplierTabIcons.TICKSPEED,
  },
  upgrades: {
    name: () => "Tickspeed Upgrades",
    displayOverride: () => `${formatInt(Tickspeed.totalUpgrades)} Total`,
    // Must be pow10 due to logarithmic scaling
    fakeValue: () => Decimal.pow10(Tickspeed.totalUpgrades),
    multValue: () => new Decimal.pow10(100 * MultiplierTabHelper.decomposeTickspeed().tickspeed),
    isActive: () => true,
    icon: MultiplierTabIcons.PURCHASE("AD"),
  },
  galaxies: {
    name: () => "Galaxies",
    displayOverride: () => {
      const ag = player.galaxies + GalaxyGenerator.galaxies;
      const rg = Replicanti.galaxies.total;
      const tg = player.dilation.totalTachyonGalaxies;
      return `${formatInt(ag + rg + tg)} Total`;
    },
    // Must be pow10 due to logarithmic scaling
    fakeValue: () => Decimal.pow10(effectiveBaseGalaxies()),
    multValue: () => new Decimal.pow10(100 * MultiplierTabHelper.decomposeTickspeed().galaxies),
    isActive: () => true,
    icon: MultiplierTabIcons.GALAXY,
  },
};

GameDatabase.multiplierTabValues.tickspeedUpgrades = {
  purchased: {
    name: () => "Purchased Tickspeed Upgrades",
    displayOverride: () => (Laitela.continuumActive
      ? formatFloat(Tickspeed.continuumValue, 2, 2)
      : formatInt(player.totalTickBought)),
    multValue: () => Decimal.pow10(Laitela.continuumActive ? Tickspeed.continuumValue : player.totalTickBought),
    isActive: () => true,
    icon: MultiplierTabIcons.PURCHASE("AD"),
  },
  free: {
    name: () => "Tickspeed Upgrades from TD",
    displayOverride: () => formatInt(player.totalTickGained),
    multValue: () => Decimal.pow10(player.totalTickGained),
    isActive: () => Currency.timeShards.gt(0),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("time"),
  }
};
