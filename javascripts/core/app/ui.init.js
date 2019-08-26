"use strict";

let ui = {
  view: {
    modal: {
      current: undefined,
      cloudConflicts: [],
      message: "",
      callback: undefined,
      closeButton: false,
      glyphSelection: false,
    },
    tabs: {
      dimensions: {
        normal: {
          floatingText: Array.from({length: 9}, () => [])
        },
      },
      reality: {
        openGlyphWeights: false,
        currentGlyphTooltip: -1,
        automator: {
          fullScreen: false,
          editorScriptID: "",
          // TODO: enum
          lines: []
        }
      }
    },
    shiftDown: false,
    theme: "Normal",
    bigCrunch: false,
    scrollWindow: 0,
    draggingUIID: -1,
    currentContextMenu: null,
    tab: "dimensions",
    subtab: "normal",
    newUI: false,
    newsHidden: false
  },
  notationName: "",
  formatPreBreak: false
};
