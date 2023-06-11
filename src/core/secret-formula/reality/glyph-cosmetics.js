// Color prop is a combination of a B/W background and a border hex code
export const glyphCosmeticSets = {
  cards: {
    id: "cards",
    name: "Playing Card Suits",
    symbol: ["♠", "♥", "♦", "♣", "♤", "♧", "♡", "♢"],
    color: ["W#000000", "B#FF2222"],
  },
  lower: {
    id: "lower",
    name: "Lowercase Glyphs",
    symbol: ["ω", "ξ", "δ", "ψ"],
  },
  sus: {
    id: "sus",
    name: "Suspicious",
    symbol: ["ඔ", "ඕ", "ඞ", "ඩ"],
    color: ["B#FCA40A"]
  },
  currency: {
    id: "currency",
    name: "Modern Currency",
    symbol: ["$", "₽", "¥", "€", "¢", "£", "₩"],
    preventBlur: true,
    color: ["W#00DD00"],
  },
  oldCurrency: {
    id: "oldCurrency",
    name: "Older Currency",
    symbol: ["₷", "₰", "₳", "₯", "₻"],
    preventBlur: true,
    color: ["B#00DD00"],
  },
  pipe: {
    id: "pipe",
    name: "Single Pipes",
    symbol: ["┌", "┐", "└", "┘", "─", "│"],
    color: ["B#33FF33"],
  },
  pipe2: {
    id: "pipe2",
    name: "Double Pipes",
    symbol: ["╔", "╗", "╚", "╝", "═", "║"],
    color: ["W#33FF33"],
  },
  trigram: {
    id: "trigram",
    name: "Trigrams",
    symbol: ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"],
    preventBlur: true,
    color: ["B#FFFFFF"],
  },
  arrow: {
    id: "arrow",
    name: "Single Arrows",
    symbol: ["←", "↓", "↑", "→", "↖", "↗", "↘", "↙"],
    color: ["W#CC0000"],
  },
  arrow2: {
    id: "arrow2",
    name: "Double Arrows",
    symbol: ["⇄", "⇅", "⇔", "⇕"],
    color: ["W#0000CC"],
  },
  arrow3: {
    id: "arrow3",
    name: "Special Arrows",
    symbol: ["↺", "↯", "↬", "⇱", "⇲", "⇮", "↭"],
    preventBlur: true,
    color: ["W#CCCC00"],
  },
  integral: {
    id: "integral",
    name: "Integration",
    symbol: ["∬", "∭", "∮", "∯", "∰", "∱", "∲", "∳"],
    preventBlur: true,
    color: ["B#123456"]
  },
  numbers: {
    id: "numbers",
    name: "Circled Numbers",
    symbol: ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"],
    preventBlur: true,
    color: ["B#607D8B"]
  },
  blocks: {
    id: "blocks",
    name: "2x2 Blocks",
    symbol: ["▘", "▚", "▞", "▙", "▛", "▜", "▟"],
  },
  shapes: {
    id: "shapes",
    name: "Miscellaneous Shapes",
    symbol: ["▰", "▲", "◆", "◎", "◍"],
    preventBlur: true,
  },
  chess: {
    id: "chess",
    name: "Chess Pieces",
    symbol: ["♟", "♞", "♝", "♜", "♛", "♚"],
    preventBlur: true,
    color: ["B#AAAAAA"],
  },
  planet: {
    id: "planet",
    name: "Planetary Symbols",
    symbol: ["☿", "♀", "♁", "♂", "♃", "♄", "♆", "♇"],
    preventBlur: true,
    color: ["B#964B00"],
  },
  musical: {
    id: "musical",
    name: "Musical Symbols",
    symbol: ["♩", "♪", "♬", "♭", "♮", "♯"],
    preventBlur: true,
    color: ["W#E621E6"]
  },
  recycle: {
    id: "recycle",
    name: "Recycling Symbols",
    symbol: ["♻", "♳", "♴", "♵", "♶", "♷", "♸", "♹"],
    preventBlur: true,
  },
  dice: {
    id: "dice",
    name: "Dice Faces",
    symbol: ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"],
    preventBlur: true,
  },
  hazard: {
    id: "hazard",
    name: "Hazard Symbols",
    symbol: ["☠", "☢", "☣", "⚠"],
    preventBlur: true,
    color: ["W#FCA40A"]
  },
  celestial: {
    id: "celestial",
    name: "Celestial Icons",
    symbol: ["\uF0C1", "⌬", "ᛝ", "♅"],
    color: ["B#00BCD4"],
  },
  alchemy: {
    id: "alchemy",
    name: "Alchemical Symbols",
    symbol: ["🜁", "🜂", "🜃", "🜄", "🜔", "🜍", "🜞", "🜚"],
    color: ["B#FFD700"],
  },
  blob: {
    id: "blob",
    name: "Blobs",
    symbol: ["\uE011", "\uE012", "\uE013", "\uE014", "\uE016", "\uE01A", "\uE01C"],
    preventBlur: true,
    color: ["B#E4B51A"],
  },
  blob2: {
    id: "blob2",
    name: "More Blobs",
    symbol: ["\uE01D", "\uE01E", "\uE021", "\uE024", "\uE025", "\uE026", "\uE027"],
    preventBlur: true,
  },
  star: {
    id: "star",
    name: "Geometric Stars",
    symbol: ["★", "☆", "✪", "✯", "✭", "✫", "🜞"],
  },
  star2: {
    id: "star2",
    name: "Realistic Stars",
    symbol: ["✶", "✦", "✧", "✺", "✹", "✷"],
    color: ["W#D4FFFF", "W#FDFFCC"],
  },
  gem: {
    id: "gem",
    name: "Gemstones",
    symbol: ["💎"],
    color: ["B#035E3B", "B#943B47", "B#032C54"],
  },
  heiroglyph: {
    id: "heiroglyph",
    name: "Common Hieroglyphs",
    symbol: ["𓂀", "𓀶", "𓅊", "𓇌", "𓊝", "☥"],
    preventBlur: true,
  },
  paperclip: {
    id: "paperclip",
    name: "Useless Paperclips",
    symbol: ["𓄲", "𓄳", "𓄴", "𓄵", "𓄶", "𓄷", "𓄸"],
    preventBlur: true,
    color: ["B#222222"],
  },
  snake: {
    id: "snake",
    name: "Various Snakes",
    symbol: ["𓆓", "𓆔", "𓆕", "𓆖", "𓆗", "𓆘"],
    preventBlur: true,
  },
  egyptNumber: {
    id: "egyptNumber",
    name: "Egyptian Numbers",
    symbol: ["𓆄", "𓅔", "𓆾", "𓂰", "𓍦", "𓎋", "𓐀", "𓃐"],
    preventBlur: true,
    color: ["W#123456"]
  },
  egyptWeather: {
    id: "egyptWeather",
    name: "Egyptian Weathervanes",
    symbol: ["𓈹", "𓈧", "𓈷", "𓉈", "𓈩", "𓈻", "𓈽"],
    preventBlur: true,
    color: ["W#607D8B"]
  },
  limbs: {
    id: "limbs",
    name: "Awkward Limbs",
    symbol: ["𓈝", "𓄒", "𓃂", "𓃁", "𓂩", "𓂙", "𓂓", "𓂼"],
    preventBlur: true,
    color: ["B#E621E6"]
  },
  animal: {
    id: "animal",
    name: "Moses' Ark",
    symbol: ["𓆏", "𓆉", "𓅬", "𓅃", "𓃲", "𓆣", "𓆊", "𓃰"],
    preventBlur: true,
    color: ["W#0000AA"],
  },
};
