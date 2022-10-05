
export const MultiplierTabIcons = {
  DIMENSION(type, tier) {
    const tierText = tier ?? "";
    switch (type) {
      case "AD":
        return { text: `Ω${tierText}`, color: "var(--color-antimatter)" };
      case "ID":
        return { text: `∞${tierText}`, color: "var(--color-infinity)" };
      case "TD":
        return { text: `Δ${tierText}`, color: "var(--color-eternity)" };
      default:
        throw new Error("Unrecognized dimension type in multiplier tab icons");
    }
  },
  PURCHASE(type, tier) {
    const text = `<i class="fas fa-arrow-up-right-dots" />${tier ?? ""}`;
    switch (type) {
      case "AD":
        return { text, color: "var(--color-antimatter)" };
      case "ID":
        return { text, color: "var(--color-infinity)" };
      case "TD":
        return { text, color: "var(--color-eternity)" };
      case "baseID":
        return { text: `<i class="fas fa-arrows-up-to-line" />`, color: "var(--color-infinity)" };
      case "tesseractID":
        return {
          text: `<i class="fas fa-up-right-and-down-left-from-center" />`,
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
        return { text: `∞${tierText}`, color: "var(--color-infinity)" };
      case "eternity":
        return { text: `Δ${tierText}`, color: "var(--color-eternity)" };
      default:
        throw new Error("Unrecognized challenge type in multiplier tab icons");
    }
  },
  // Regular sacrifice and glyph sacrifice
  SACRIFICE(type) {
    const icon = `<i class="fas fa-turn-down" />`;
    switch (type) {
      case "antimatter":
        return { text: `Ω${icon}`, color: "var(--color-antimatter)" };
      case "infinity":
        return { text: `∞${icon}`, color: "var(--color-infinity)" };
      case "time":
        return { text: `Δ${icon}`, color: "var(--color-eternity)" };
      case "dilation":
        return { text: `Ψ${icon}`, color: "var(--color-dilation)" };
      default:
        throw new Error("Unrecognized sacrifice type in multiplier tab icons");
    }
  },
  UPGRADE(type) {
    const icon = `<i class="fas fa-arrow-up" />`;
    switch (type) {
      case "infinity":
        return { text: `∞${icon}`, color: "var(--color-infinity)" };
      case "eternity":
        return { text: `Δ${icon}`, color: "var(--color-eternity)" };
      case "dilation":
        return { text: `Ψ${icon}`, color: "var(--color-dilation)" };
      case "reality":
        return { text: `Ϟ${icon}`, color: "var(--color-reality)" };
      case "imaginary":
        return { text: `<i class="far fa-lightbulb" />${icon}`, color: "var(--color-ra--base)" };
      default:
        throw new Error("Unrecognized upgrade type in multiplier tab icons");
    }
  },
  // Icons for base IP/EP
  CONVERT_FROM(currency) {
    if (currency === "AM") {
      return {
        text: `<i class='fas fa-atom' /><i class='fa-solid fa-arrow-right-arrow-left' />`,
        color: "var(--color-antimatter)",
      };
    }
    if (currency === "IP") {
      return {
        text: `∞<i class='fa-solid fa-arrow-right-arrow-left' />`,
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
      text: `<i class='fas fa-calculator' />`,
      color,
    };
  },
  ANTIMATTER: {
    text: `<i class='fas fa-atom' />`,
    color: "var(--color-antimatter)",
  },
  DIMBOOST: {
    text: `<i class="fas fa-angles-up" />`,
    color: GameDatabase.reality.glyphTypes.power.color,
  },
  TICKSPEED: {
    text: `<i class="fas fa-clock" />`,
    color: "var(--color-eternity)",
  },
  GALAXY: {
    text: `<i class="fas fa-bahai" />`,
    color: "var(--color-eternity)",
  },
  ACHIEVEMENT: {
    text: `<i class="fas fa-trophy" />`,
    color: "var(--color-v--base)",
  },
  BREAK_INFINITY: {
    text: `<i class="fab fa-skyatlas" />`,
    color: "var(--color-infinity)",
  },
  INFINITY_POWER: {
    text: `∞<i class="fas fa-arrows-turn-right" />`,
    color: "var(--color-infinity)",
  },
  IPOW_CONVERSION: {
    text: `<i class="fas fa-arrow-down-up-across-line" />`,
    color: "var(--color-infinity)",
  },
  REPLICANTI: {
    text: "Ξ",
    color: GameDatabase.reality.glyphTypes.replication.color,
  },
  TIME_STUDY: {
    text: `<i class="fas fa-book" />`,
    color: "var(--color-eternity)",
  },
  TACHYON_PARTICLES: {
    text: `<i class="fas fa-meteor" />`,
    color: "var(--color-dilation)",
  },
  GENERIC_GLYPH: {
    text: `<i class="fas fa-clone" />`,
    color: "var(--color-reality)",
  },
  SPECIFIC_GLYPH(type) {
    return {
      text: GameDatabase.reality.glyphTypes[type].symbol,
      color: GameDatabase.reality.glyphTypes[type].color,
    };
  },
  BLACK_HOLE: {
    text: `<i class="fas fa-circle" />`,
    color: "var(--color-reality)",
  },
  GAMESPEED: {
    text: `<i class="fas fa-clock" />`,
    color: "var(--color-reality)",
  },
  GENERIC_V: {
    text: "⌬",
    color: "var(--color-v--base)",
  },
  GENERIC_RA: {
    text: `<i class="fas fa-sun" />`,
    color: "var(--color-ra--base)",
  },
  ALCHEMY: {
    text: `<i class="fas fa-vial" />`,
    color: "var(--color-ra-pet--effarig)",
  },
  BH_PULSE: {
    text: `<i class="fas fa-expand-arrows-alt" />`,
    color: "var(--color-reality)",
  },
  SINGULARITY: {
    text: `<i class="fas fa-arrows-to-dot" />`,
    color: "var(--color-laitela--base)",
  },
  PELLE: {
    text: "♅",
    color: "var(--color-pelle--base)",
  },
  IAP: {
    text: `<i class="fas fa-coins" />`,
    color: "var(--color-accent)",
  },
};
