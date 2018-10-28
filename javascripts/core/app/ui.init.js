let ui = {
  model: { },
  actions: { },
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
      }
    },
    shiftDown: false,
    theme: undefined
  }
};