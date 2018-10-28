let ui = {
  model: {
    player: player
  },
  actions: {},
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
        infinity: {
          dims: Array.from({length: 9}, () => {
            return {
              isAvailable: false,
            };
          })
        }
      },
      statistics: {
        subtab: String.empty
      }
    },
    shiftDown: false
  }
};