let ui = {
  view: {
    modal: {
      current: undefined,
      cloudConflicts: [],
      message: ""
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
      celestials: {
        subtab: String.empty
      }
    },
    shiftDown: false,
    theme: undefined
  }
};