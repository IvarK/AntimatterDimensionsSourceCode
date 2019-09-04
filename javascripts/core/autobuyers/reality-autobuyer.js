"use strict";

Autobuyer.reality = new class RealityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.reality;
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
      AutoRealityMode.RM,
      AutoRealityMode.GLYPH,
      AutoRealityMode.EITHER,
      AutoRealityMode.BOTH
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
    const rmProc = gainedRealityMachines().gte(this.rm);
    const glyphProc = gainedGlyphLevel().actualLevel >= Math.min(this.glyph, Glyphs.glyphLevelCap);
    switch (this.mode) {
      case AutoRealityMode.RM:
        proc = rmProc;
        break;
      case AutoRealityMode.GLYPH:
        proc = glyphProc;
        break;
      case AutoRealityMode.EITHER:
        proc = rmProc || glyphProc;
        break;
      case AutoRealityMode.BOTH:
        proc = rmProc && glyphProc;
        break;
    }
    if (proc) autoReality();
  }
}();
