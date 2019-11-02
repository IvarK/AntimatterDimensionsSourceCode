"use strict";

// eslint-disable-next-line prefer-const
let ui = {
  view: {
    modal: {
      current: undefined,
      cloudConflicts: [],
      glyphSelection: false,
      progressBar: undefined,
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
        draggingGlyphInfo: {
          id: 0,
          type: "",
          sacrificeValue: 0,
        },
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
    news: false,
    initialized: false,
  },
  notationName: "",
  formatPreBreak: false
};
