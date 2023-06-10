export const state = {
  view: {
    modal: {
      queue: [],
      current: undefined,
      cloudConflict: [],
      progressBar: undefined,
    },
    quotes: {
      queue: [],
      current: undefined,
      history: undefined
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
          inInventory: false,
        },
        automator: {
          fullScreen: false,
          editorScriptID: "",
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
