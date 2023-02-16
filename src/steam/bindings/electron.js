import { NodeModule } from "./node-module";

/**
 * @type {NodeModule<any>}
 */
const module = new NodeModule("electron");

export function isModuleLoaded() {
  return module.isLoaded;
}

export function setZoomFactor(zoomFactor) {
  const setSize = 1020;
  const sizeDiff = window.outerHeight / setSize;
  return module.safeCall(
    x => x.webFrame.setZoomFactor(sizeDiff * zoomFactor)
  );
}

export function openExternal(url) {
  return module.safeCall(
    x => x.shell.openExternal(url)
  );
}
