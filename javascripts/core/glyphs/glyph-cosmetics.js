class CosmeticGlyphType {
  constructor(setup, isCosmetic) {
    this.id = setup.id;
    this._defaultSymbol = setup.symbol;
    this._defaultColor = setup.color;
    this.preventBlur = setup.preventBlur ?? false;
    this.isUnlocked = setup.isUnlocked;
    this._canCustomize = setup.canCustomize ?? true;
    this.fixedSymbolColor = setup.fixedSymbolColor ?? false;
    this._isCosmetic = isCosmetic;
  }

  get canCustomize() {
    return (this.isUnlocked?.() ?? true) && (this._canCustomize?.() ?? true);
  }

  get defaultSymbol() {
    return {
      symbol: this._defaultSymbol,
      blur: !this.preventBlur,
    };
  }

  get defaultColor() {
    const color = this.id === "reality" ? GlyphAppearanceHandler.realityColor : this._defaultColor;
    return {
      border: color,
      bg: (player.options.forceDarkGlyphs || Theme.current().isDark()) ? "black" : "white",
    };
  }

  get currentSymbol() {
    const custom = player.reality.glyphs.cosmetics.symbolMap[this.id];
    if (!player.reality.glyphs.cosmetics.active || !custom) return this.defaultSymbol;
    return {
      symbol: custom,
      blur: !this.preventBlur,
    };
  }

  get currentColor() {
    const custom = player.reality.glyphs.cosmetics.colorMap[this.id];
    if (!player.reality.glyphs.cosmetics.active || !custom) return this.defaultColor;
    return {
      border: custom,
      bg: (player.options.forceDarkGlyphs || Theme.current().isDark()) ? "black" : "white",
    };
  }

  get ignoreRarityColor() {
    return this._isCosmetic || this.fixedSymbolColor;
  }
}

const functionalGlyphs = mapGameDataToObject(
  GameDatabase.reality.glyphTypes,
  config => new CosmeticGlyphType(config, false)
);

const cosmeticGlyphs = mapGameDataToObject(
  GameDatabase.reality.cosmeticGlyphs,
  config => new CosmeticGlyphType(config, true)
);

export const CosmeticGlyphTypes = {
  ...functionalGlyphs,
  ...cosmeticGlyphs,
  get list() {
    return Object.keys({ ...GameDatabase.reality.glyphTypes, ...GameDatabase.reality.cosmeticGlyphs })
      .map(e => CosmeticGlyphTypes[e]);
  },
};

export const GlyphAppearanceHandler = {
  get cosmeticsEnabled() {
    return player.reality.glyphs.cosmetics.active;
  },
  get symbolMap() {
    return player.reality.glyphs.cosmetics.symbolMap;
  },
  get colorMap() {
    return player.reality.glyphs.cosmetics.colorMap;
  },
  get availableSymbols() {
    return Object.values(GameDatabase.reality.glyphCosmeticSets)
      .filter(s => player.reality.glyphs.cosmetics.availableSets.includes(s.id))
      .flatMap(s => s.symbol);
  },
  // Sort the colors by hue, otherwise finding specific colors would be a mess for UX.
  // However, colors "close enough to grayscale" are sorted separately and first
  get availableColors() {
    return Object.values(GameDatabase.reality.glyphCosmeticSets)
      .filter(s => player.reality.glyphs.cosmetics.availableSets.includes(s.id))
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

  getBorderColor(type) {
    return CosmeticGlyphTypes[type].currentColor.border;
  },
  getRarityColor(strength) {
    const isDarkBG = player.options.forceDarkGlyphs || Theme.current().isDark();
    return getRarity(strength)[isDarkBG ? "darkColor" : "lightColor"];
  },
  getBaseColor(isInverted) {
    const isNormallyDark = player.options.forceDarkGlyphs || Theme.current().isDark();
    if (isInverted) return isNormallyDark ? "white" : "black";
    return isNormallyDark ? "black" : "white";
  },

  // This produces a linearly interpolated color between the basic glyph colors, but with RGB channels copied and
  // hardcoded from the color data because that's probably preferable to a very hacky hex conversion method. The
  // order used is {infinity, dilation, power, replication, time, infinity, ... }. This is used in multiple places
  // and this approach is much lighter on performance due to colored keyframe animations causing significant lag.
  get realityColor() {
    // RGB values for the colors to interpolate between
    const r = [182, 100, 34, 3, 178, 182];
    const g = [127, 221, 170, 169, 65, 127];
    const b = [51, 23, 72, 244, 227, 51];

    // Integer and fractional parts for interpolation parameter (10s period, equal 2s per step)
    const timer = Date.now() % 10000;
    const i = Math.floor(timer / 2000);
    const f = timer / 2000 - i;

    return `rgb(${r[i] * (1 - f) + r[i + 1] * f},
      ${g[i] * (1 - f) + g[i + 1] * f},
      ${b[i] * (1 - f) + b[i + 1] * f})`;
  }
};
