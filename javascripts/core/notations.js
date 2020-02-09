"use strict";

const Notation = (function() {
  const N = ADNotations;
  const notation = (type, ...params) => {
    const n = new type(...params);
    n.setAsCurrent = () => {
      player.options.notation = n.name;
      ui.notationName = n.name;
    };
    return n;
  };
  const painful = n => {
    n.isPainful = true;
    return n;
  };
  return {
    scientific: notation(N.ScientificNotation),
    engineering: notation(N.EngineeringNotation),
    letters: notation(N.LettersNotation),
    standard: painful(notation(N.StandardNotation)),
    cancer: painful(notation(N.CancerNotation)),
    mixedScientific: notation(N.MixedScientificNotation),
    mixedEngineering: notation(N.MixedEngineeringNotation),
    logarithm: notation(N.LogarithmNotation),
    brackets: painful(notation(N.BracketsNotation)),
    infinity: notation(N.InfinityNotation),
    roman: painful(notation(N.RomanNotation)),
    dots: notation(N.DotsNotation),
    zalgo: painful(notation(N.ZalgoNotation)),
    hex: notation(N.HexNotation),
    imperial: painful(notation(N.ImperialNotation)),
    clock: notation(N.ClockNotation),
    prime: notation(N.PrimeNotation),
    bar: notation(N.BarNotation),
    shi: painful(notation(N.ShiNotation)),
    blind: painful(notation(N.BlindNotation)),
    custom: notation(N.CustomNotation, ["this", "changes", "on", "load"])
  };
}());

Notation.cancer.setAsCurrent = () => {
  player.options.notation = Notation.cancer.name;
  ui.notationName = Notation.cancer.name;
  GameUI.notify.success("😂😂😂");
};

const Notations = {
  // Defined as a list here for exact order in options tab.
  all: [
    Notation.scientific,
    Notation.engineering,
    Notation.letters,
    Notation.standard,
    Notation.cancer,
    Notation.mixedScientific,
    Notation.mixedEngineering,
    Notation.logarithm,
    Notation.brackets,
    Notation.infinity,
    Notation.roman,
    Notation.dots,
    Notation.zalgo,
    Notation.hex,
    Notation.imperial,
    Notation.clock,
    Notation.prime,
    Notation.bar,
    Notation.shi,
    Notation.blind,
    Notation.custom,
  ],
  find: name => {
    const notation = Notations.all.find(n => n.name === name);
    return notation === undefined ? Notation.mixedScientific : notation;
  },
  get current() {
    return GameUI.initialized ? ui.notation : Notation.mixedScientific;
  },
  // This extra junk is added to the name so that if the custom notation changes,
  // the UI recomputes the custom notation.
  customNotationName(letters, separator) {
    return 'Custom ' + letters.map(i => i.replace(/,/g, ',0')).join(',1') + ',' + separator;
  },
  updateCustomNotation(letters, useSpaceSeparator) {
    const separator = useSpaceSeparator ? " " : "";
    const n = Notations.find("Custom");
    n.letters = letters;
    n.mantissaExponentSeparator = separator;
    n.separator = separator;
    ui.notationName = this.customNotationName(letters, separator);
  }
};

ADNotations.Settings.isInfinite = decimal => ui.formatPreBreak && decimal.gte(Decimal.MAX_NUMBER);

EventHub.logic.on(GAME_EVENT.GAME_TICK_AFTER, () => {
  ui.formatPreBreak = !player.break || (NormalChallenge.isRunning && !Enslaved.isRunning);
});
