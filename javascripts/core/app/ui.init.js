let ui = {
  view: {
    modal: {
      current: undefined,
      cloudConflicts: [],
      message: String.empty,
      callback: undefined,
      closeButton: false,
      glyphSelection: false,
    },
    tabs: {
      current: undefined,
      dimensions: {
        subtab: String.empty,
        normal: {
          floatingText: Array.from({length: 9}, () => [])
        },
      },
      statistics: {
        subtab: String.empty
      },
      achievements: {
        subtab: String.empty
      },
      challenges: {
        subtab: String.empty
      },
      infinity: {
        subtab: String.empty
      },
      eternity: {
        subtab: String.empty
      },
      reality: {
        subtab: String.empty,
        openGlyphWeights: false,
        currentGlyphTooltip: -1,
      },
      celestials: {
        subtab: String.empty
      }
    },
    shiftDown: false,
    theme: undefined,
    bigCrunch: false,
    scrollWindow: 0,
    draggingUIID: -1,
  },
  notationName: String.empty,
};