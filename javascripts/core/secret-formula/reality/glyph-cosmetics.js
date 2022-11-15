import { GameDatabase } from "../game-database";

GameDatabase.reality.glyphCosmeticSets = {
  cards: {
    id: "cards",
    name: "Playing Card Suits",
    symbol: ["♤", "♧", "♡", "♢"],
    color: ["#000000", "#FF2222"],
  },
  rainbow: {
    id: "rainbow",
    name: "Rainbow Colors",
    symbol: [],
    color: ["#FF0000", "#FF8800", "#FFFF00", "#00FF00", "#0000CC", "#00BBBB"],
  },
  blob: {
    id: "blob",
    name: "Blobs",
    symbol: ["\uE011", "\uE019"],
    preventBlur: true,
    color: ["#E4B51A"],
  },
  colors: {
    id: "colors",
    name: "Miscellaneous Colors",
    symbol: [],
    color: ["#E42222", "#F04418", "#755220", "#123456", "#FACADE", "#BEEF72"],
  },
  gray: {
    id: "gray",
    name: "Gray",
    symbol: [],
    color: ["#444444", "#888888", "#CCCCCC"],
  },
};
