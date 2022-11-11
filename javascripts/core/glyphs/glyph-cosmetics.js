const COSMETIC_SETS = [
  {
    name: "cards",
    symbol: ["♤", "♧", "♡", "♢"],
    color: ["#000000", "#FF2222"],
  },
  {
    name: "rainbow",
    symbol: [],
    color: ["#FF0000", "#FF8800", "#FFFF00", "#00FF00", "#0000CC", "#00BBBB"],
  },
  {
    name: "blob",
    symbol: ["\uE011", "\uE019"],
    color: ["#E4B51A"],
  },
  {
    name: "colors",
    symbol: [],
    color: ["#E42222", "#F04418", "#755220", "#123456", "#FACADE", "#BEEF72"],
  },
  {
    name: "grayscale",
    symbol: [],
    color: ["#444444", "#888888", "#CCCCCC"],
  },
];

export const GlyphCosmeticHandler = {
  get isActive() {
    return player.reality.glyphs.cosmetics.active;
  },
  get symbolMap() {
    return player.reality.glyphs.cosmetics.symbolMap;
  },
  get colorMap() {
    return player.reality.glyphs.cosmetics.colorMap;
  },
  get availableSymbols() {
    return COSMETIC_SETS
      .filter(s => player.reality.glyphs.cosmetics.availableSets.includes(s.name))
      .flatMap(s => s.symbol);
  },
  // Sort the colors by hue, otherwise finding specific colors would be a mess for UX.
  // However, colors "close enough to grayscale" are sorted separately and first
  get availableColors() {
    return COSMETIC_SETS
      .filter(s => player.reality.glyphs.cosmetics.availableSets.includes(s.name))
      .flatMap(s => s.color)
      .sort((a, b) => {
        const getHue = hex => {
          const str = hex.split("#")[1];
          const rgb = [
            parseInt(str.substring(0, 2), 16) / 255,
            parseInt(str.substring(2, 4), 16) / 255,
            parseInt(str.substring(4), 16) / 255
          ];
          const min = Math.min(...rgb), max = Math.max(...rgb);
          if (max - min < 0.1) return max;
          let rawHue;
          if (rgb[0] === max) rawHue = (rgb[1] - rgb[2]) / (max - min);
          else if (rgb[1] === max) rawHue = 2 + (rgb[2] - rgb[1]) / (max - min);
          else rawHue = 4 + (rgb[0] - rgb[1]) / (max - min);
          return 1 + ((rawHue + 6) % 6);
        };
        return getHue(a) - getHue(b);
      });
  },
  getSymbol(type) {
    return (this.isActive && this.symbolMap[type])
      ? this.symbolMap[type]
      : undefined;
  },
  getColor(type) {
    if (!this.isActive || !this.colorMap[type]) {
      if (type === "cursed") return getBaseColor(false);
      if (type === "reality") return getRealityColor();
      return undefined;
    }
    return this.colorMap[type];
  }
};