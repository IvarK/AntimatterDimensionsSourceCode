import { reality } from "@/core/secret-formula/reality";

/**
 * Every entry in this object is a styling specification for bars within the multiplier tab.
 * {
 *  @property {String} text       String specifying the color to render the background of the bar (often a CSS var)
 *  @property {String} symbol     String to show as text on the bar, may be HTML (allows for font awesome icons)
 *  @property {String} textColor  A text color to override the default --color-text for better contrast
 * }
 */
export const MultiplierTabIcons = {
  DIMENSION(type, tier) {
    const tierText = tier ?? "";
    switch (type) {
      case "AD":
        return { symbol: `<b>Ω${tierText}</b>`, color: "var(--color-antimatter)" };
      case "ID":
        return { symbol: `<b>∞${tierText}</b>`, color: "var(--color-infinity)" };
      case "TD":
        return { symbol: `<b>Δ${tierText}</b>`, color: "var(--color-eternity)" };
      default:
        throw new Error("Unrecognized dimension type in multiplier tab icons");
    }
  },
  PURCHASE(type, tier) {
    const symbol = `<i class="fas fa-arrow-up-right-dots" />${tier ?? ""}`;
    switch (type) {
      case "AD":
        return { symbol, color: "var(--color-antimatter)" };
      case "ID":
        return { symbol, color: "var(--color-infinity)" };
      case "TD":
        return { symbol, color: "var(--color-eternity)" };
      case "baseID":
        return { symbol: `<i class="fas fa-arrows-up-to-line" />`, color: "var(--color-infinity)" };
      case "tesseractID":
        return {
          symbol: `<i class="fas fa-up-right-and-down-left-from-center" />`,
          color: "var(--color-enslaved--base)"
        };
      default:
        throw new Error("Unrecognized purchase type in multiplier tab icons");
    }
  },
  CHALLENGE(type, tier) {
    const tierText = `<i class="fas fa-arrow-down-wide-short" />${tier ?? ""}`;
    switch (type) {
      case "infinity":
        return { symbol: `<b>∞</b>${tierText}`, color: "var(--color-infinity)" };
      case "eternity":
        return { symbol: `<b>Δ</b>${tierText}`, color: "var(--color-eternity)" };
      default:
        throw new Error("Unrecognized challenge type in multiplier tab icons");
    }
  },
  // Regular sacrifice and glyph sacrifice
  SACRIFICE(type) {
    const icon = `<i class="fas fa-turn-down" />`;
    switch (type) {
      case "antimatter":
        return { symbol: `<b>Ω</b>${icon}`, color: "var(--color-antimatter)" };
      case "infinity":
        return { symbol: `<b>∞</b>${icon}`, color: "var(--color-infinity)" };
      case "time":
        return { symbol: `<b>Δ</b>${icon}`, color: "var(--color-eternity)" };
      case "dilation":
        return { symbol: `<b>Ψ</b>${icon}`, color: "var(--color-dilation)", textColor: "black" };
      default:
        throw new Error("Unrecognized sacrifice type in multiplier tab icons");
    }
  },
  UPGRADE(type) {
    const icon = `<i class="fas fa-arrow-up" />`;
    switch (type) {
      case "infinity":
        return { symbol: `<b>∞</b>${icon}`, color: "var(--color-infinity)" };
      case "eternity":
        return { symbol: `<b>Δ</b>${icon}`, color: "var(--color-eternity)" };
      case "dilation":
        return { symbol: `<b>Ψ</b>${icon}`, color: "var(--color-dilation)" };
      case "reality":
        return { symbol: `<b>Ϟ</b>${icon}`, color: "var(--color-reality)" };
      case "imaginary":
        return { symbol: `<i class="far fa-lightbulb" />${icon}`, color: "var(--color-ra--base)" };
      default:
        throw new Error("Unrecognized upgrade type in multiplier tab icons");
    }
  },
  // Icons for base IP/EP
  CONVERT_FROM(currency) {
    if (currency === "AM") {
      return {
        symbol: `<i class='fas fa-atom' /><i class='fa-solid fa-arrow-right-arrow-left' />`,
        color: "var(--color-antimatter)",
      };
    }
    if (currency === "IP") {
      return {
        symbol: `<b>∞</b><i class='fa-solid fa-arrow-right-arrow-left' />`,
        color: "var(--color-infinity)",
      };
    }
    return {};
  },
  // IP and EP formula divisors
  DIVISOR(currency) {
    let color;
    if (currency === "IP") color = "var(--color-infinity)";
    if (currency === "EP") color = "var(--color-eternity)";
    return {
      symbol: `<i class='fas fa-calculator' />`,
      color,
    };
  },
  ANTIMATTER: {
    symbol: `<i class='fas fa-atom' />`,
    color: "var(--color-antimatter)",
  },
  DIMBOOST: {
    symbol: `<i class="fas fa-angles-up" />`,
    color: reality.glyphTypes.power.color,
  },
  TICKSPEED: {
    symbol: `<i class="fas fa-clock" />`,
    color: "var(--color-eternity)",
  },
  GALAXY: {
    symbol: `<i class="fas fa-bahai" />`,
    color: "var(--color-eternity)",
  },
  ACHIEVEMENT: {
    symbol: `<i class="fas fa-trophy" />`,
    color: "var(--color-v--base)",
    textColor: "black",
  },
  BREAK_INFINITY: {
    symbol: `<b>∝</b>`,
    color: "var(--color-infinity)",
    textColor: "black",
  },
  INFINITY_POWER: {
    symbol: `<b>∞</b><i class="fas fa-arrows-turn-right" />`,
    color: "var(--color-infinity)",
    textColor: "black",
  },
  IPOW_CONVERSION: {
    symbol: `<i class="fas fa-arrow-down-up-across-line" />`,
    color: "var(--color-infinity)",
    textColor: "black",
  },
  TIME_STUDY: {
    symbol: `<i class="fas fa-book" />`,
    color: "var(--color-eternity)",
  },
  TACHYON_PARTICLES: {
    symbol: `<i class="fas fa-meteor" />`,
    color: "var(--color-dilation)",
  },
  GENERIC_GLYPH: {
    symbol: `<i class="fas fa-clone" />`,
    color: "var(--color-reality)",
  },
  SPECIFIC_GLYPH(type) {
    return {
      symbol: `<b>${reality.glyphTypes[type].symbol}</b>`,
      color: reality.glyphTypes[type].color,
    };
  },
  BLACK_HOLE: {
    symbol: `<i class="fas fa-circle" />`,
    color: "var(--color-reality)",
  },
  GAMESPEED: {
    symbol: `<i class="fas fa-clock" />`,
    color: "var(--color-reality)",
  },
  GENERIC_TERESA: {
    symbol: "<b>Ϟ</b>",
    color: "var(--color-teresa--base)",
  },
  GENERIC_ENSLAVED: {
    symbol: `<div class="o-tab-btn--cel3">\uf0c1</div>`,
    color: "var(--color-enslaved--base)",
  },
  GENERIC_V: {
    symbol: "<b>⌬</b>",
    color: "var(--color-v--base)",
    textColor: "black",
  },
  GENERIC_RA: {
    symbol: `<i class="fas fa-sun" />`,
    color: "var(--color-ra--base)",
  },
  ALCHEMY: {
    symbol: `<i class="fas fa-vial" />`,
    color: "var(--color-ra-pet--effarig)",
  },
  BH_PULSE: {
    symbol: `<i class="fas fa-expand-arrows-alt" />`,
    color: "var(--color-reality)",
  },
  GENERIC_LAITELA: {
    symbol: "<b>ᛝ</b>",
    color: "var(--color-laitela--base)",
    textColor: "var(--color-laitela--accent)",
  },
  SINGULARITY: {
    symbol: `<i class="fas fa-arrows-up-down-left-right" />`,
    color: "var(--color-laitela--base)",
    textColor: "var(--color-laitela--accent)",
  },
  PELLE: {
    symbol: "<b>♅</b>",
    color: "var(--color-pelle--base)",
  },
  IAP: {
    symbol: `<i class="fas fa-coins" />`,
    color: "var(--color-accent)",
  },
};
