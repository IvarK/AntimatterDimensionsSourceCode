class CosmeticGlyphType {
  constructor(setup, isCosmetic) {
    this.id = setup.id;
    this._defaultSymbol = setup.symbol;
    this._defaultColor = setup.color;
    this.preventBlur = setup.preventBlur ?? false;
    this.isUnlocked = setup.isUnlocked;
    this._canCustomize = setup.canCustomize;
    this.fixedSymbolColor = setup.fixedSymbolColor ?? false;
    this.isCosmetic = isCosmetic;
  }

  get canCustomize() {
    return this._canCustomize?.() ?? true;
  }

  get defaultSymbol() {
    return {
      symbol: this._defaultSymbol,
      blur: !this.preventBlur,
    };
  }

  get defaultColor() {
    const color = this.id === "reality" ? GlyphAppearanceHandler.realityColor : this._defaultColor;
    const isNormallyDark = player.options.forceDarkGlyphs || Theme.current().isDark();
    return {
      border: color,
      bg: (isNormallyDark === (this.id === "cursed")) ? "white" : "black",
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
    const colorProps = GlyphAppearanceHandler.getColorProps(custom);
    return {
      ...colorProps,
      str: custom,
    };
  }

  get ignoreRarityColor() {
    return this.isCosmetic || this.fixedSymbolColor;
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
  setInModal: null,
  chosenFromModal: null,
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
      .map(s => s.symbol)
      .filter(s => s);
  },
  // Sort the colors by hue, otherwise finding specific colors would be a mess for UX.
  // However, colors "close enough to grayscale" are sorted separately and first and all black BGs are placed
  // before all white BGs
  get availableColors() {
    return Object.values(GameDatabase.reality.glyphCosmeticSets)
      .filter(s => player.reality.glyphs.cosmetics.availableSets.includes(s.id))
      .flatMap(s => s.color)
      .sort((a, b) => {
        const getHue = hex => {
          const parts = hex.split("#");
          const bg = parts[0] === "B" ? 0 : 10;
          const color = parts[1];
          const rgb = [
            parseInt(color.substring(0, 2), 16) / 255,
            parseInt(color.substring(2, 4), 16) / 255,
            parseInt(color.substring(4), 16) / 255
          ];
          const min = Math.min(...rgb), max = Math.max(...rgb);
          if (max - min < 0.1) return max + bg;
          let rawHue;
          if (rgb[0] === max) rawHue = (rgb[1] - rgb[2]) / (max - min);
          else if (rgb[1] === max) rawHue = 2 + (rgb[2] - rgb[1]) / (max - min);
          else rawHue = 4 + (rgb[0] - rgb[1]) / (max - min);
          return 1 + ((rawHue + 6) % 6) + bg;
        };
        return getHue(a) - getHue(b);
      })
      .filter(c => c)
      .map(c => [c]);
  },
  get availableTypes() {
    return Object.values(GameDatabase.reality.cosmeticGlyphs)
      .map(type => CosmeticGlyphTypes[type.id])
      .filter(type => type.isUnlocked)
      .map(type => type.id);
  },

  getBorderColor(type) {
    return CosmeticGlyphTypes[type].currentColor.border;
  },
  getRarityColor(strength) {
    const isDarkBG = player.options.forceDarkGlyphs || Theme.current().isDark();
    return getRarity(strength)[isDarkBG ? "darkColor" : "lightColor"];
  },
  getColorProps(colorStr) {
    // This condition is a bit odd - this specifically selects out the hybrid custom colors which have both a BG color
    // and a hex code. Reality color looks like "rgb(..." and also goes in this conditional
    if (colorStr.charAt(1) !== "#") {
      return {
        border: colorStr,
        bg: (player.options.forceDarkGlyphs || Theme.current().isDark()) ? "black" : "white",
      };
    }
    return {
      border: colorStr.substring(1),
      bg: colorStr.charAt(0) === "B" ? "black" : "white",
    };
  },
  // Only used to ensure readable glyph tooltips
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
  },

  get unlockedSets() {
    return player.reality.glyphs.cosmetics.availableSets;
  },
  get lockedSets() {
    return Object.keys(GameDatabase.reality.glyphCosmeticSets)
      .filter(set => !player.reality.glyphs.cosmetics.availableSets.includes(set));
  },
  // Attempts to unlock a specific given set, or a random one if none is given
  unlockSet(name) {
    const lockedSets = this.lockedSets;
    let unlocked;
    if (name && lockedSets.includes(name)) {
      unlocked = name;
    } else if (!name && lockedSets.length > 0) {
      // If the player wants to refresh-scum this then we let them (there's probably already going to be an infinite
      // lootbox cycle mechanic anyway)
      unlocked = lockedSets[Math.floor(Math.random() * lockedSets.length)];
    } else {
      return false;
    }

    player.reality.glyphs.cosmetics.availableSets.push(unlocked);
    const entry = GameDatabase.reality.glyphCosmeticSets[unlocked];
    GameUI.notify.info(`You have unlocked the "${entry.name}" Set for Glyph cosmetics!`, 10000);
    return true;
  }
};
