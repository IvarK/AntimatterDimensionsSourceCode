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
      current: undefined,
      dimensions: {
        subtab: "",
        normal: {
          floatingText: Array.from({length: 9}, () => [])
        },
      },
      statistics: {
        subtab: ""
      },
      achievements: {
        subtab: ""
      },
      challenges: {
        subtab: ""
      },
      infinity: {
        subtab: ""
      },
      eternity: {
        subtab: ""
      },
      reality: {
        subtab: "",
        openGlyphWeights: false,
        currentGlyphTooltip: -1,
      },
      celestials: {
        subtab: ""
      }
    },
    shiftDown: false,
    theme: "Normal",
    bigCrunch: false,
    scrollWindow: 0,
    draggingUIID: -1,
    currentContextMenu: null,
    page: player.options.newUI ? "new-dimensions-tab" : "normal-dim-tab",
    newUI: player.options.newUI
  },
  notationName: "",
};