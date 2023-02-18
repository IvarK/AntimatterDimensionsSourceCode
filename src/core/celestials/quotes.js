import { BitUpgradeState } from "../game-mechanics";
import wordShift from "../word-shift";

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

// Gives an array specifying proportions of celestials to blend together on the modal, as a function of time, to
// provide a smoother transition between different celestials to reduce potential photosensitivity issues
function blendCel(cels) {
  const totalTime = cels.map(cel => cel[1]).sum();
  const tick = (Date.now() / 1000) % totalTime;

  // Blend the first blendTime seconds with the previous celestial and the last blendTime seconds with the next;
  // note that this results in a total transition time of 2*blendTime. We specifically set this to be half the duration
  // of the first entry - this is because in the case of all intervals having the same duration, this guarantees two
  // blended entries at all points in time.
  const blendTime = cels[0][1] / 2;
  let start = 0;
  for (let index = 0; index < cels.length; index++) {
    const prevCel = cels[(index + cels.length - 1) % cels.length], currCel = cels[index],
      nextCel = cels[(index + 1) % cels.length];

    // Durations of time from after last transition and after next transition. May be negative, which is how we
    // check to see if we're in the correct time interval (last should be positive, next should be negative)
    const lastTime = tick - start, nextTime = lastTime - currCel[1];
    if (nextTime > 0) {
      start += currCel[1];
      continue;
    }

    if (lastTime <= blendTime) {
      const t = 0.5 * lastTime / blendTime;
      return [[prevCel[0], 0.5 - t], [currCel[0], 0.5 + t]];
    }
    if (-nextTime <= blendTime) {
      const t = 0.5 * nextTime / blendTime;
      return [[currCel[0], 0.5 - t], [nextCel[0], 0.5 + t]];
    }

    // In principle the animation properties should never get to this return case, but we leave it here just in case -
    // the worst side-effect of reaching here is that some UI elements may appear to lose click detection for a
    // fraction of a second when transitioning from two blended entries to one
    return [[currCel[0], 1]];
  }
  throw new Error("Could not blend celestial fractions in Quote modal");
}

class QuoteLine {
  constructor(line, parent) {
    this._parent = parent;
    this._showCelestialName = line.showCelestialName ?? true;

    this._celestialArray = line.background
      ? () => blendCel(line.background)
      : [[parent.celestial, 1]];

    const replacementMatch = /\$(\d+)/gu;

    this._line = typeof line === "string"
      ? line
      // This matches each digit after a $ and replaces it with the wordCycle of an array with the digit it matched.
      : () => line.text.replaceAll(replacementMatch, (_, i) => wordShift.wordCycle(line[i]));
  }

  get line() {
    return typeof this._line === "function" ? this._line() : this._line;
  }

  get celestials() {
    return typeof this._celestialArray === "function" ? this._celestialArray() : this._celestialArray;
  }

  get celestialSymbols() {
    return this.celestials.map(c => Celestials[c[0]].symbol);
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
