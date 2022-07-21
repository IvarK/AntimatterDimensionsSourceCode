import { BitUpgradeState } from "../game-mechanics/index";
import wordShift from "../wordShift";

export const Quote = {
  addToQueue(quote) {
    ui.view.quotes.queue.push(quote);
    if (!ui.view.quotes.current) this.advanceQueue();
  },
  advanceQueue() {
    ui.view.quotes.current = ui.view.quotes.queue.shift();
  },
  showHistory(history) {
    ui.view.quotes.history = history;
  },
  clearQueue() {
    ui.view.quotes.queue = [];
    ui.view.quotes.current = undefined;
  },
  clearHistory() {
    ui.view.quotes.history = undefined;
  },
  clearAll() {
    this.clearQueue();
    this.clearHistory();
  },
  get isOpen() {
    return ui.view.quotes.current !== undefined;
  },
  get isHistoryOpen() {
    return ui.view.quotes.history !== undefined;
  }
};


function celCycle(cels) {
  const totalTime = cels.map(cel => cel[1]).sum();
  let tick = (Date.now() / 100) % totalTime;
  let index = -1;
  while (tick >= 0 && index < cels.length - 1) {
    index++;
    tick -= cels[index][1];
  }
  return cels[index][0];
}

class QuoteLine {
  constructor(line, parent) {
    this._parent = parent;
    this._showCelestialName = line.showCelestialName ?? true;

    this._celestial = line.background
      ? () => celCycle(line.background)
      : parent.celestial;

    const replacementMatch = /\$(\d+)/gu;

    this._line = typeof line === "string"
      ? line
      // This matches each digit after a $ and replaces it with the wordCycle of an array with the digit it matched.
      : () => line.text.replaceAll(replacementMatch, (_, i) => wordShift.wordCycle(line[i]));
  }

  get line() {
    return typeof this._line === "function" ? this._line() : this._line;
  }

  get celestial() {
    return typeof this._celestial === "function" ? this._celestial() : this._celestial;
  }

  get celestialSymbol() {
    return Celestials[this.celestial].symbol;
  }

  get showCelestialName() {
    return this._showCelestialName;
  }

  get celestialName() {
    return Celestials[this._parent.celestial].displayName;
  }
}

class CelQuotes extends BitUpgradeState {
  constructor(config, celestial) {
    super(config);
    this._celestial = celestial;
    this._lines = config.lines.map(line => new QuoteLine(line, this));
  }

  get bits() { return player.celestials[this._celestial].quoteBits; }
  set bits(value) { player.celestials[this._celestial].quoteBits = value; }

  get requirement() {
    // If requirement is defined, it is always a function returning a boolean.
    return this.config.requirement?.();
  }

  get celestial() {
    return this._celestial;
  }

  line(id) {
    return this._lines[id];
  }

  get totalLines() {
    return this._lines.length;
  }

  show() { this.unlock(); }
  onUnlock() { this.present(); }

  present() {
    Quote.addToQueue(this);
  }
}


export const Quotes = {
  teresa: mapGameDataToObject(
    GameDatabase.celestials.quotes.teresa,
    config => new CelQuotes(config, "teresa")
  ),
  effarig: mapGameDataToObject(
    GameDatabase.celestials.quotes.effarig,
    config => new CelQuotes(config, "effarig")
  ),
  enslaved: mapGameDataToObject(
    GameDatabase.celestials.quotes.enslaved,
    config => new CelQuotes(config, "enslaved")
  ),
  v: mapGameDataToObject(
    GameDatabase.celestials.quotes.v,
    config => new CelQuotes(config, "v")
  ),
  ra: mapGameDataToObject(
    GameDatabase.celestials.quotes.ra,
    config => new CelQuotes(config, "ra")
  ),
  laitela: mapGameDataToObject(
    GameDatabase.celestials.quotes.laitela,
    config => new CelQuotes(config, "laitela")
  ),
  pelle: mapGameDataToObject(
    GameDatabase.celestials.quotes.pelle,
    config => new CelQuotes(config, "pelle")
  ),
};
