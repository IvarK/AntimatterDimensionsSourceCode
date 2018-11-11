/*class Autobuyer {
  constructor(target) {
    this.target = target;
    this.cost = 1
    this.interval = 5000;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.tier = 1;
    this.bulk = 1;
  }

}*/


var Autobuyer = function Autobuyer(target) {
    this.target = target
    this.cost = 1
    this.interval = 5000;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.tier = 1;
    this.bulk = 1;
}

Autobuyer.tickTimer = 0;
Autobuyer.intervalTimer = 0;
Autobuyer.lastDimBoost = 0;
Autobuyer.lastGalaxy = 0;

const AutoCrunchMode = {
  AMOUNT: "amount",
  TIME: "time",
  RELATIVE: "relative"
};

const AutoEternityMode = {
  AMOUNT: "amount",
  TIME: "time",
  RELATIVE: "relative"
};

const AutoRealityMode = {
  RM: "rm",
  GLYPH: "glyph",
  EITHER: "either",
  BOTH: "both"
};