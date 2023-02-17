import * as Electron from "./bindings/electron";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.5;

let zoomFactor = 1;

export const ElectronRuntime = {
  initialize() {
    if (!this.isActive) {
      return;
    }

    zoomFactor = Number(localStorage.getItem("Zoom"));
    zoomFactor = Number.isFinite(zoomFactor) ? zoomFactor : 1;
    window.addEventListener("resize", () => this.updateZoom());
  },

  get isActive() {
    return Electron.isModuleLoaded();
  },

  increaseZoom() {
    if (!this.isActive) {
      return;
    }

    if (zoomFactor > MAX_ZOOM) {
      GameUI.notify.info("Zoom Level is at Maximum");
      return;
    }

    this.zoomFactor = Math.round((zoomFactor + 0.1) * 10) / 10;
  },

  decreaseZoom() {
    if (!this.isActive) {
      return;
    }

    if (zoomFactor < MIN_ZOOM) {
      GameUI.notify.info("Zoom Level is at Minimum");
      return;
    }

    this.zoomFactor = Math.round((zoomFactor - 0.1) * 10) / 10;
  },

  resetZoom() {
    if (!this.isActive) {
      return;
    }

    this.zoomFactor = 1;
  },

  get zoomFactor() {
    return zoomFactor;
  },

  set zoomFactor(value) {
    zoomFactor = value;
    localStorage.setItem("Zoom", zoomFactor.toString());
    this.updateZoom();
    GameUI.notify.info(`Size changed to ${Math.round(zoomFactor * 100)}%`);
  },

  updateZoom() {
    if (!this.isActive) {
      return;
    }

    const setSize = 1020;
    const sizeDiff = window.outerHeight / setSize;
    Electron.setZoomFactor(sizeDiff * zoomFactor);
  }
};
