let ui = {
  view: {
    modal: {
      current: undefined,
      cloudConflicts: [],
      message: String.empty,
      callback: undefined,
      closeButton: false
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
      celestials: {
        subtab: String.empty
      }
    },
    shiftDown: false,
    theme: undefined,
    bigCrunch: false
  }
};