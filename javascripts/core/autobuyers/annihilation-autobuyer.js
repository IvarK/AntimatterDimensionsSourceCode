import { Autobuyer, AutobuyerState } from "./autobuyer.js";

Autobuyer.annihilation = new class AnnihilationAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.annihilation;
  }

  get name() {
    return `Annihilation`;
  }

  get isUnlocked() {
    return Laitela.darkMatterMult > 1;
  }

  get multiplier() {
    return this.data.multiplier;
  }

  set multiplier(value) {
    this.data.multiplier = value;
  }

  get bulk() {
    return 0;
  }

  get hasInput() {
    return true;
  }

  get inputType() {
    return "float";
  }

  get inputEntry() {
    return "multiplier";
  }

  tick() {
    if (Laitela.darkMatterMultGain >= this.multiplier) {
      Laitela.annihilate();
    }
  }
}();
