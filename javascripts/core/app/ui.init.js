"use strict";

// eslint-disable-next-line prefer-const
let ui = {
  view: {
    modal: {
      queue: [],
      current: undefined,
      cloudConflict: [],
      progressBar: undefined,
    },
    tabs: {
      reality: {
        openGlyphWeights: false,
        currentGlyphTooltip: -1,
        // 1 means up and left of the mouse
        glyphTooltipDirection: 1,
        draggingGlyphInfo: {
          id: 0,
          type: "",
          sacrificeValue: 0,
        },
        mouseoverGlyphInfo: {
          id: 0,
          type: "",
          sacrificeValue: 0,
          refineValue: 0,
        },
        automator: {
          fullScreen: false,
          editorScriptID: "",
          // TODO: enum
          lines: []
        }
      },
    },
    shiftDown: false,
    theme: "Normal",
    bigCrunch: false,
    scrollWindow: 0,
    draggingUIID: -1,
    currentContextMenu: null,
    tab: "dimensions",
    subtab: "antimatter",
    newUI: false,
    news: false,
    initialized: false,
    tutorialState: 0,
    tutorialActive: true,
    h2pForcedTab: undefined,
  },
  notationName: "",
  formatPreBreak: false,
  lastClickTime: 0,
};
