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

  // This looks hacky because isUnlocked is also used for game mechanic purposes with non-cosmetic
  // types and must be false for cursed, reality, and companion glyphs. However, we use it to determine
  // if a type should be displayed at all in the case of cosmetic types
  get canCustomize() {
    return (!this.isCosmetic || (this.isUnlocked?.() ?? true)) && (this._canCustomize?.() ?? true);
  }

  get defaultSymbol() {
    return {
      symbol: this._defaultSymbol,
      blur: !this.preventBlur,
    };
  }

  get defaultColor() {
    const color = this.id === "reality" ? GlyphAppearanceHandler.realityColor : this._defaultColor;
    const isNormallyDark = !GlyphAppearanceHandler.isLightBG;
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
      blur: !(this.preventBlur || GlyphAppearanceHandler.unblurredSymbols.includes(custom)),
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
      .filter(s => this.unlockedSets.includes(s.id))
      .map(s => s.symbol)
      .filter(s => s);
  },
  // Sort the colors by hue, otherwise finding specific colors would be a mess for UX.
  // However, colors "close enough to grayscale" are sorted separately and first
  get availableColors() {
    const sortedArray = Object.values(GameDatabase.reality.glyphCosmeticSets)
      .filter(s => this.unlockedSets.includes(s.id))
      .flatMap(s => s.color)
      .sort((a, b) => {
        const getHue = hex => {
          const parts = hex.split("#");
          const color = parts[1];
          const rgb = [
            parseInt(color.substring(0, 2), 16) / 255,
            parseInt(color.substring(2, 4), 16) / 255,
            parseInt(color.substring(4), 16) / 255
          ];
          const min = Math.min(...rgb), max = Math.max(...rgb);
          if (max - min < 0.3) return max;
          let rawHue;
          if (rgb[0] === max) rawHue = (rgb[1] - rgb[2]) / (max - min);
          else if (rgb[1] === max) rawHue = 2 + (rgb[2] - rgb[1]) / (max - min);
          else rawHue = 4 + (rgb[0] - rgb[1]) / (max - min);
          return 6 + ((rawHue + 6) % 6);
        };
        return getHue(a) - getHue(b);
      })
      .filter(c => c);

    // We want two rows in the color selection Vue component, but that displays options in columns (one column
    // per set of symbol options). Here we do a bit of array manipulation to lay out colors as two rows, separated
    // by BG color and with the longer row on top (UI doesn't handle empty top-row spots well)
    const blackArr = sortedArray.filter(c => c.charAt(0) === "B");
    const whiteArr = sortedArray.filter(c => c.charAt(0) === "W");
    const longer = blackArr.length > whiteArr.length ? blackArr : whiteArr;
    const shorter = blackArr.length > whiteArr.length ? whiteArr : blackArr;
    const combined = [];
    for (let index = 0; index < longer.length; index++) {
      if (index < shorter.length) combined.push([longer[index], shorter[index]]);
      else combined.push([longer[index]]);
    }

    return combined;
  },
  get availableTypes() {
    return Object.values(GameDatabase.reality.cosmeticGlyphs)
      .map(type => CosmeticGlyphTypes[type.id])
      .filter(type => type.isUnlocked())
      .map(type => type.id);
  },
  get unblurredSymbols() {
    return Object.values(GameDatabase.reality.glyphCosmeticSets)
      .filter(s => s.preventBlur)
      .map(s => s.symbol)
      .flat();
  },
  // Note: This can *technically* be inconsistent with the actual number of sets, but only y a cheated save.
  get expectedSetCount() {
    return ShopPurchaseData.singleCosmeticSet + player.records.fullGameCompletions;
  },

  // Returns true for "light" BG glyphs and false for "dark" BG glyphs
  get isLightBG() {
    switch (player.options.glyphBG) {
      case GLYPH_BG_SETTING.AUTO:
        return !Theme.current().isDark();
      case GLYPH_BG_SETTING.LIGHT:
        return true;
      case GLYPH_BG_SETTING.DARK:
        return false;
      default:
        throw new Error("Unrecognized Glyph BG setting");
    }
  },
  getBorderColor(type) {
    if (type === "cursed" && !CosmeticGlyphTypes.cursed.currentColor.str) return this.isLightBG ? "#ffffff" : "#000000";
    return CosmeticGlyphTypes[type].currentColor.border;
  },
  getRarityColor(strength, type) {
    const rarityEntry = getRarity(strength);
    const isLight = CosmeticGlyphTypes[type].currentColor.bg === "white";
    const colorKey = `${isLight ? "light" : "dark"}${player.options.highContrastRarity ? "HighContrast" : "Color"}`;
    return rarityEntry[colorKey];
  },
  getColorProps(colorStr) {
    // This condition is a bit odd - this specifically selects out the hybrid custom colors which have both a BG color
    // and a hex code. Reality color looks like "rgb(..." and also goes in this conditional
    if (colorStr?.charAt(1) !== "#") {
      return {
        border: colorStr,
        bg: this.isLightBG ? "white" : "black",
      };
    }
    return {
      border: colorStr.substring(1),
      bg: colorStr.charAt(0) === "B" ? "black" : "white",
    };
  },
  // Only used to ensure readable glyph tooltips
  getBaseColor(isInverted) {
    const isNormallyDark = !this.isLightBG;
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
    if (ShopPurchase.allCosmeticSets > 0) return Object.keys(GameDatabase.reality.glyphCosmeticSets);
    return [...new Set(player.reality.glyphs.cosmetics.unlockedFromNG.concat(ShopPurchaseData.unlockedCosmetics))];
  },
  get lockedSets() {
    return Object.keys(GameDatabase.reality.glyphCosmeticSets).filter(set => !this.unlockedSets.includes(set));
  },
  // Unlocks the set chosen in the modal, choosing a random available one as a fallback. This is only called for
  // sets unlocked through game completions; STD purchases are handled with ShopPurchaseData
  unlockSet() {
    const lockedSets = this.lockedSets;
    const toUnlock = GlyphAppearanceHandler.chosenFromModal?.id;

    let unlocked;
    if (toUnlock && lockedSets.includes(toUnlock)) {
      unlocked = toUnlock;
    } else if (!toUnlock && lockedSets.length > 0) {
      // Randomness doesn't need to be seeded since we normally let the player choose and randomness is just a fallback
      unlocked = lockedSets[Math.floor(Math.random() * lockedSets.length)];
    } else {
      return;
    }

    player.reality.glyphs.cosmetics.unlockedFromNG.push(unlocked);
    const entry = GameDatabase.reality.glyphCosmeticSets[unlocked];
    GameUI.notify.info(`You have unlocked the "${entry.name}" Set for Glyph cosmetics!`, 10000);
    GlyphAppearanceHandler.chosenFromModal = null;
    this.applyNotification();
  },
  applyNotification() {
    TabNotification.newGlyphCosmetic.clearTrigger();
    TabNotification.newGlyphCosmetic.tryTrigger();
    player.reality.glyphs.cosmetics.glowNotification = true;
  },

  // Deletes invalid glyph cosmetics for individual symbols or colors which aren't unlocked. Note that this should only
  // be called on import and not on page load, as there is a minor async delay on-load which will cause STD purchases
  // to not be accounted for when loading an already-existing local save
  clearInvalidCosmetics() {
    const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
    const allSymbols = GlyphAppearanceHandler.availableSymbols.flat();
    const allColors = GlyphAppearanceHandler.availableSymbols.flat();
    for (const glyph of allGlyphs) {
      if (!allSymbols.includes(glyph.symbol)) glyph.symbol = undefined;
      if (!allColors.includes(glyph.color)) glyph.color = undefined;
      if (!GlyphAppearanceHandler.availableTypes.includes(glyph.cosmetic)) glyph.cosmetic = undefined;
    }
    const cosmetics = player.reality.glyphs.cosmetics;
    for (const key of Object.keys(cosmetics.symbolMap)) {
      const selectedSymbol = cosmetics.symbolMap[key];
      if (!allSymbols.includes(selectedSymbol)) cosmetics.symbolMap[key] = undefined;
    }
    for (const key of Object.keys(cosmetics.colorMap)) {
      const selectedColor = cosmetics.symbolMap[key];
      if (!allColors.includes(selectedColor)) cosmetics.colorMap[key] = undefined;
    }
  }
};
