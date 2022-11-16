import { GameDatabase } from "../game-database";

// Color prop is a combination of a B/W background and a border hex code
GameDatabase.reality.glyphCosmeticSets = {
  cards: {
    id: "cards",
    name: "Playing Card Suits",
    symbol: ["♤", "♧", "♡", "♢"],
    color: ["W#000000", "B#FF2222"],
  },
  currency: {
    id: "currency",
    name: "Currency",
    symbol: ["$", "₽", "¥", "€", "¢", "£", "₩"],
    color: ["W#00DD00"],
  },
  oldCurrency: {
    id: "oldCurrency",
    name: "Older Currency",
    symbol: ["₷", "₰", "₳", "₯", "₻"],
    color: ["B#00DD00"],
  },
  pipe: {
    id: "pipe",
    name: "Pipes 1",
    symbol: ["┌", "┐", "└", "┘", "─", "│"],
    color: ["B#33FF33"],
  },
  pipe2: {
    id: "pipe2",
    name: "Pipes 2",
    symbol: ["╔", "╗", "╚", "╝", "═", "║"],
    color: ["W#33FF33"],
  },
  trigram: {
    id: "trigram",
    name: "Trigrams",
    symbol: ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"],
    color: ["B#FFFFFF"],
  },
  arrow: {
    id: "arrow",
    name: "Arrows",
    symbol: ["←", "↓", "↑", "→", "↖", "↗", "↘", "↙"],
    color: ["W#CC0000"],
  },
  chess: {
    id: "chess",
    name: "Chess Pieces",
    symbol: ["♟", "♞", "♝", "♜", "♛", "♚"],
    color: ["B#AAAAAA"],
  },
  planet: {
    id: "planet",
    name: "Planetary Symbols",
    symbol: ["☿", "♀", "♁", "♂", "♃", "♄", "♆", "♇"],
    color: ["B#964B00"],
  },
  celestial: {
    id: "celestial",
    name: "Celestial Icons",
    symbol: ["⌬", "ᛝ", "♅"],
    color: ["B#00BCD4"],
  },
  alchemy: {
    id: "alchemy",
    name: "Alchemical Symbols",
    symbol: ["🜁", "🜂", "🜃", "🜄", "🜔", "🜍", "🜞"],
    color: ["B#FFD700"],
  },
  blob: {
    id: "blob",
    name: "Blobs",
    symbol: ["\uE011", "\uE019"],
    preventBlur: true,
    color: ["B#E4B51A"],
  },
};
