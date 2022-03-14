import { GameDatabase } from "../game-database.js";

GameDatabase.celestials.ra = {
  teresa: {
    name: "Teresa",
    color: "#8596ea",
    chunkGain: "Eternity Points",
    memoryGain: "current Reality Machines",
    requiredUnlock: () => undefined,
    rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.eternityPoints.value.pLog10() / 1e4, 3),
    memoryProductionMultiplier: () => (Ra.has(RA_UNLOCKS.TERESA_XP)
      ? 1 + Math.pow(Currency.realityMachines.value.pLog10() / 100, 0.5)
      : 1)
  },
  effarig: {
    name: "Effarig",
    color: "#ea8585",
    chunkGain: "Relic Shards gained",
    memoryGain: "best Glyph level",
    requiredUnlock: () => RA_UNLOCKS.EFFARIG_UNLOCK,
    rawMemoryChunksPerSecond: () => 4 * Math.pow(Effarig.shardsGained, 0.1),
    memoryProductionMultiplier: () => (Ra.has(RA_UNLOCKS.EFFARIG_XP)
      ? 1 + player.records.bestReality.glyphLevel / 7000
      : 1)
  },
  enslaved: {
    name: "Enslaved",
    color: "#f1aa7f",
    chunkGain: "Time Shards",
    memoryGain: "total time played",
    requiredUnlock: () => RA_UNLOCKS.ENSLAVED_UNLOCK,
    rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.timeShards.value.pLog10() / 3e5, 2),
    memoryProductionMultiplier: () => (Ra.has(RA_UNLOCKS.ENSLAVED_XP)
      ? 1 + Math.log10(player.records.totalTimePlayed) / 200
      : 1)
  },
  v: {
    name: "V",
    color: "#ead584",
    chunkGain: "Infinity Power",
    memoryGain: "total Memory levels",
    requiredUnlock: () => RA_UNLOCKS.V_UNLOCK,
    rawMemoryChunksPerSecond: () => 4 * Math.pow(Currency.infinityPower.value.pLog10() / 1e7, 1.5),
    memoryProductionMultiplier: () => (Ra.has(RA_UNLOCKS.V_XP)
      ? 1 + Ra.totalPetLevel / 50
      : 1)
  }
};
