"use strict";

Autobuyer.reality = {
  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    return RealityUpgrade(25).isBought;
  },
  /**
   * @returns {boolean}
   */
  get isOn() {
    return player.realityBuyer.isOn;
  },
  /**
   * @param {boolean} value
   */
  set isOn(value) {
    player.realityBuyer.isOn = value;
  },
  toggle() {
    this.isOn = !this.isOn;
  },
  /**
   * @returns {boolean}
   */
  get isActive() {
    return this.isUnlocked && this.isOn;
  },
  /**
   * @returns {Decimal}
   */
  get rm() {
    return player.realityBuyer.rm;
  },
  /**
   * @param {Decimal} value
   */
  set rm(value) {
    player.realityBuyer.rm = value;
  },
  /**
   * @returns {number}
   */
  get glyph() {
    return player.realityBuyer.glyph;
  },
  /**
   * @param {number} value
   */
  set glyph(value) {
    player.realityBuyer.glyph = value;
  },
  /**
   * @returns {AutoRealityMode}
   */
  get mode() {
    return player.autoRealityMode;
  },
  /**
   * @param {AutoRealityMode} value
   */
  set mode(value) {
    player.autoRealityMode = value;
  },
  toggleMode() {
    this.mode = Object.values(AutoRealityMode).nextSibling(this.mode);
  },
  tick() {
    if (!this.isActive || GlyphSelection.active) return;
    let proc = false;
    const rmProc = gainedRealityMachines().gte(this.rm);
    const glyphProc = gainedGlyphLevel().actualLevel >= this.glyph;
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
};
