import * as Electron from "@/steam/bindings/electron";

export function openExternalLink(url) {
  if (Electron.isModuleLoaded()) {
    Electron.openExternal(url);
  } else {
    window.open(url, "_blank").focus();
  }
}
