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

  getSymbol(type) {
    return (this.isActive && Object.keys(this.symbolMap).includes(type))
      ? this.symbolMap[type]
      : undefined;
  },

  getColor(type) {
    return (this.isActive && Object.keys(this.colorMap).includes(type))
      ? this.colorMap[type]
      : undefined;
  }
};