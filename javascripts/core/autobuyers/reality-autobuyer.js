import { Autobuyer, AutobuyerState } from "./autobuyer.js";

Autobuyer.reality = new class RealityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.reality;
  }

  get name() {
    return `Reality`;
  }

  get isUnlocked() {
    return RealityUpgrade(25).isBought;
  }

  get canTick() {
    return super.canTick && !GlyphSelection.active;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get rm() {
    return this.data.rm;
  }

  set rm(value) {
    this.data.rm = value;
  }

  get glyph() {
    return this.data.glyph;
  }

  set glyph(value) {
    this.data.glyph = value;
  }

  toggleMode() {
    this.mode = [
      AUTO_REALITY_MODE.RM,
      AUTO_REALITY_MODE.GLYPH,
      AUTO_REALITY_MODE.EITHER,
      AUTO_REALITY_MODE.BOTH
    ]
      .nextSibling(this.mode);
  }

  bumpAmount(mult) {
    if (this.isUnlocked) {
      this.rm = this.rm.times(mult);
    }
  }

  tick() {
    let proc = false;
    const rmProc = MachineHandler.gainedRealityMachines.gte(this.rm);
    const glyphProc = gainedGlyphLevel().actualLevel >= Math.min(this.glyph, Glyphs.levelCap);
    switch (this.mode) {
      case AUTO_REALITY_MODE.RM:
        proc = rmProc;
        break;
      case AUTO_REALITY_MODE.GLYPH:
        proc = glyphProc;
        break;
      case AUTO_REALITY_MODE.EITHER:
        proc = rmProc || glyphProc;
        break;
      case AUTO_REALITY_MODE.BOTH:
        proc = rmProc && glyphProc;
        break;
    }
    if (proc) autoReality();
  }
}();
