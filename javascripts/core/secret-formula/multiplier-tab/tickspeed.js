import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

import { MultiplierTabHelper } from "./helper-functions";

// See index.js for documentation
GameDatabase.multiplierTabValues.tickspeed = {
  // Both multValue entries are multiplied by 1e10 as a bit of a cheat; decomposeTickspeed returns a fraction, but the
  // Vue component suppresses numbers less than one. Multiplying by 1e10 is a workaround because in practice the split
  // between the components should never be that skewed
  total: {
    name: () => "Total Tickspeed",
    displayOverride: () => {
      const tickRate = Tickspeed.perSecond;
      const activeDims = MultiplierTabHelper.activeDimCount("AD");
      return `${format(tickRate, 2, 2)}/sec on ${formatInt(activeDims)} ${pluralize("Dimension", activeDims)}
          ➜ ${formatX(tickRate.pow(activeDims), 2, 2)}`;
    },
    multValue: () => Tickspeed.perSecond.pow(MultiplierTabHelper.activeDimCount("AD")),
    isActive: () => true,
    color: () => "var(--color-eternity)",
    overlay: ["<i class='fa-solid fa-clock' />"],
    barOverlay: () => `<i class="fas fa-clock" />`,
  },
  upgrades: {
    name: () => "Tickspeed Upgrades",
    displayOverride: () => `${formatInt(Tickspeed.totalUpgrades)} Total`,
    multValue: () => new Decimal.pow10(1e10 * MultiplierTabHelper.decomposeTickspeed().tickspeed),
    isActive: () => true,
    color: () => GameDatabase.reality.glyphTypes.power.color,
    barOverlay: () => `<i class="fas fa-arrow-up" />`,
  },
  galaxies: {
    name: () => "Galaxies",
    displayOverride: () => {
      const ag = player.galaxies + GalaxyGenerator.galaxies;
      const rg = Replicanti.galaxies.total;
      const tg = player.dilation.totalTachyonGalaxies;
      return `${formatInt(ag + rg + tg)} Total`;
    },
    multValue: () => new Decimal.pow10(1e10 * MultiplierTabHelper.decomposeTickspeed().galaxies),
    isActive: () => true,
    color: () => "var(--color-eternity)",
    barOverlay: () => `<i class="fas fa-bahai" />`,
  },
};

GameDatabase.multiplierTabValues.tickspeedUpgrades = {
  purchased: {
    name: () => "Purchased Tickspeed Upgrades",
    displayOverride: () => (Laitela.continuumActive
      ? format(Tickspeed.continuumValue, 2, 2)
      : formatInt(player.totalTickBought)),
    multValue: () => Decimal.pow10(Laitela.continuumActive ? Tickspeed.continuumValue : player.totalTickBought),
    isActive: () => true,
    color: () => GameDatabase.reality.glyphTypes.power.color,
    barOverlay: () => `<i class="fas fa-arrow-up-right-dots" />`,
  },
  free: {
    name: () => "Tickspeed Upgrades from TD",
    displayOverride: () => formatInt(player.totalTickGained),
    multValue: () => Decimal.pow10(player.totalTickGained),
    isActive: () => Currency.timeShards.gt(0),
    color: () => "var(--color-eternity)",
    barOverlay: () => `Δ`,
  }
};
