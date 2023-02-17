import { NodeModule } from "./node-module";

/**
 * @type {NodeModule<any>}
 */
const module = new NodeModule("electron");

export function isModuleLoaded() {
  return module.isLoaded;
}

export function setZoomFactor(zoomFactor) {
  return module.safeCall(
    x => x.webFrame.setZoomFactor(zoomFactor)
  );
}

export function openExternal(url) {
  return module.safeCall(
    x => x.shell.openExternal(url)
  );
}
